"""Harvest data from spreadsheet for multi indicator."""
import json
from datetime import datetime

from django.db import transaction
from django.utils.timezone import now
from pyexcel_xls import get_data as xls_get
from pyexcel_xlsx import get_data as xlsx_get

from gap_data.models import (
    Instance, Geometry, Indicator, IndicatorValue
)
from gap_harvester.harveters._base import (
    BaseHarvester, HarvestingError
)


class ExcelHarvester(BaseHarvester):
    """Harvest data from spreadsheet for multi indicator."""

    description = (
        "Harvest data from spreadsheet for multi indicator. "
        "<br>Create data in the spreadsheet with the name of "
        "indicator as the column name."
        "<br>Select what sheet name should be use and select "
        "what column name that will be used for specific indicator."
    )

    @staticmethod
    def additional_attributes(**kwargs) -> dict:
        """Return additional attributes."""
        attr = {
            'date': {
                'title': "Date of Data",
                'description': "The date for the data that will be used.",
                'required': False,
                'type': 'date'
            },
            'file': {
                'title': "URL of file",
                'description': (
                    "The url of file that will be downloaded to be harvested"
                )
            },
            'sheet_name': {
                'title': "Sheet name",
                'description': "Sheet that will be used"
            },
            'row_number_for_header': {
                'title': "Row Number: Header",
                'description': "Row number that will be used as header."
            },
            'column_name_administration_code': {
                'title': "Column Name: Administration Code",
                'description': (
                    "The name of column in "
                    "the file contains administration code"
                )
            },
            'instance_slug': {
                'title': "Slug of the instance",
                'description': "The instance slug of this harvester"
            },
        }
        try:
            instance = kwargs['instance']
            for indicator in instance.indicators.order_by('name'):
                shortcode = indicator.shortcode
                attr[indicator.id] = {
                    'title': "Column Name: " + indicator.full_name,
                    'description': indicator.description,
                    'class': 'indicator-name',
                    'required': False,
                    'data': {
                        'name': indicator.name,
                        'description': indicator.description,
                        'shortcode': shortcode if shortcode else '',
                    }
                }
        except KeyError:
            pass
        return attr

    def get_records(self):
        """Get records form upload session."""
        _file_attr = self.harvester.harvesterattribute_set.get(name='file')
        _file = _file_attr.file

        records = []
        if _file:
            _file.seek(0)
        elif _file_attr.value:
            _file = _file_attr.value
        else:
            raise HarvestingError('File is not found')

        sheet = None
        if str(_file).split('.')[-1] == 'xls':
            sheet = xls_get(_file)
        elif str(_file).split('.')[-1] == 'xlsx':
            sheet = xlsx_get(_file)
        if sheet:
            try:
                records = sheet[self.attributes.get('sheet_name', '')]
            except KeyError:
                raise HarvestingError(
                    f'Sheet name : {self.attributes.get("sheet_name", "")}'
                    f' does not exist.'
                )
        return records

    def _process(self):
        """Run the harvester."""
        default_attr = ExcelHarvester.additional_attributes()
        # fetch data
        self._update('Fetching data')

        try:
            instance = Instance.objects.get(
                slug=self.attributes['instance_slug']
            )
        except Instance.DoesNotExist:
            raise HarvestingError(
                'The instance is not found, please reupload.'
            )

        # date
        date = now().date()
        if self.attributes['date']:
            try:
                date = datetime.strptime(
                    self.attributes['date'], "%Y-%m-%d").date()
            except ValueError:
                raise HarvestingError('Date is not in format %Y-%m-%d')

            # format data
        row_number_for_header = 'row_number_for_header'
        try:
            column_header = int(self.attributes[row_number_for_header])
        except ValueError:
            raise HarvestingError(
                f"{default_attr[row_number_for_header]['title']} "
                f"is not an integer"
            )

        records = self.get_records()[column_header - 1:]
        headers = records[0]

        # get keys
        indicators_column = {}
        key_column_name_administration_code = None
        try:
            key_column_name_administration_code = headers.index(
                self.attributes['column_name_administration_code']
            )
        except ValueError as e:
            if 'not in list' in str(e):
                raise HarvestingError(str(e).replace(
                    'is not in list', '') + ' column is not found')

        for indicator in instance.indicators:
            try:
                indicators_column[
                    headers.index(self.attributes[str(indicator.id)])
                ] = indicator
            except ValueError:
                pass

        # Save the data in atomic
        # When 1 is error, we need to raise exeptions
        success = True
        details = []
        error_separator = ':error:'
        with transaction.atomic():
            details.append(headers)
            total = len(records[1:])
            for record_idx, record in enumerate(records[1:]):
                self._update(
                    f'Processing line {record_idx + column_header}/'
                    f'{total + column_header}'
                )
                detail = [str(r) for r in record]
                administrative_code = record[
                    key_column_name_administration_code]

                geometry = None
                try:
                    geometry = indicator.reporting_units.get(
                        identifier=administrative_code
                    )
                except Geometry.DoesNotExist:
                    detail[key_column_name_administration_code] += (
                        f'{error_separator}Geometry does not exist'
                    )

                # we check the values per indicator
                for idx, indicator in indicators_column.items():
                    value = record[idx]
                    try:
                        value = value.strip()
                    except AttributeError:
                        pass
                    try:
                        if value is None or value == '':
                            continue
                        else:
                            try:
                                if float(value) < indicator.min_value \
                                        or float(value) > indicator.max_value:
                                    detail[idx] += (
                                        f'{error_separator}'
                                        f'Value is not between '
                                        f'{indicator.min_value}-'
                                        f'{indicator.max_value}'
                                    )
                                    continue
                            except ValueError:
                                rules = indicator.indicatorscenariorule_set
                                rule = rules.filter(
                                    name__iexact=value).first()
                                if not rule:
                                    detail[idx] += (
                                        f'{error_separator}'
                                        f'Value is not recognized'
                                    )
                                    continue
                                value = float(
                                    rule.rule.replace(' ', '').replace(
                                        'x==', '')
                                )

                            value = float(value)
                            if geometry:
                                indicator_value, created = \
                                    IndicatorValue.objects.get_or_create(
                                        indicator=indicator,
                                        date=date,
                                        geometry=geometry,
                                        defaults={
                                            'value': value
                                        }
                                    )
                                indicator_value.value = value
                                indicator_value.save()
                    except Indicator.DoesNotExist:
                        detail[idx] += (
                            f'{error_separator}Indicator does not exist'
                        )
                    except ValueError:
                        detail[
                            key_column_name_administration_code
                        ] += error_separator + 'Value is not a number'

                # check if error separator is in detail
                if error_separator in json.dumps(detail):
                    success = False

                # -----------------------------------------------------------------------
                # End of validation
                # -----------------------------------------------------------------------
                details.append(detail)

            if not success:
                self.log.detail = json.dumps(details)
                raise HarvestingError(
                    'Progress did not success. No data saved. '
                    'Please check the detail to fix the error.'
                )
