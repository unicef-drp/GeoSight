import json
import os
from datetime import datetime

from django.conf import settings
from django.db import transaction
from pyexcel_xls import get_data as xls_get
from pyexcel_xlsx import get_data as xlsx_get

from gap_data.models import (
    Geometry, IndicatorValue, IndicatorExtraValue
)
from gap_harvester.harveters._base import (
    BaseHarvester, HarvestingError
)


class RecordError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class SharepointHarvester(BaseHarvester):
    """
    Harvester using sharepoint file in the volume settings.ONEDRIVE_ROOT
    """
    description = (
        "Harvester using sharepoint file. <br>"
        "It will fetch the data from file and the file synced frequently."
    )

    @staticmethod
    def additional_attributes(**kwargs) -> dict:
        attr = {
            'file': {
                'title': "Path of file",
                'description': "The path of file in the server."
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
                'description': "The name of column in the file contains administration code"
            },
            'column_name_month': {
                'title': "Column Name: Month",
                'description': "The name of column in the file contains month data"
            },
            'column_name_year': {
                'title': "Column Name: Year",
                'description': "The name of column in the file contains year data"
            },
            'column_name_value': {
                'title': "Column Name: Value",
                'description': "The name of column in the file contains data"
            },
            'extra_columns': {
                'title': "Columns Name: Extra Data",
                'description': "List of columns as extra data",
                'required': False
            },
        }
        return attr

    def _process(self):
        """ Run the harvester """
        indicator = self.harvester.indicator
        rule_names = [name.lower() for name in list(
            indicator.indicatorscenariorule_set.values_list('name', flat=True)
        )]
        rules = list(indicator.indicatorscenariorule_set.values_list('rule', flat=True))
        default_attr = SharepointHarvester.additional_attributes()

        # format data
        self._update('Fetching data')
        row_number_for_header = 'row_number_for_header'
        try:
            column_header = int(self.attributes[row_number_for_header])
        except ValueError:
            raise HarvestingError(f"{default_attr[row_number_for_header]['title']} is not an integer")

        # get data from file
        filepath = os.path.join(settings.ONEDRIVE_ROOT, self.attributes['file'])
        if not os.path.exists(filepath):
            raise HarvestingError(f'File {filepath} does not exist or deleted')

        # check the file extension
        if str(filepath).split('.')[-1] == 'xls':
            sheet = xls_get(filepath)
        elif str(filepath).split('.')[-1] == 'xlsx':
            sheet = xlsx_get(filepath)
        else:
            raise HarvestingError(f'File is not in excel format.')

        # check the sheet
        if sheet:
            try:
                records = sheet[self.attributes.get('sheet_name', '')][column_header - 1:]
                headers = records[0]
            except KeyError:
                raise HarvestingError(f'Sheet name : {self.attributes.get("sheet_name", "")} does not exist.')

            # get index of each columns
            idx_administration_code = headers.index(self.attributes['column_name_administration_code'])
            idx_month = headers.index(self.attributes['column_name_month'])
            idx_year = headers.index(self.attributes['column_name_year'])
            idx_value = headers.index(self.attributes['column_name_value'])

            # check index of extra data
            extra_data = {}
            if 'extra_columns' in self.attributes and self.attributes['extra_columns']:
                for extra in self.attributes['extra_columns'].split(','):
                    extra_data[extra] = headers.index(extra)

            # Save the data in atomic
            # When 1 is error, we need to raise exeptions
            success = True
            details = []
            date_found = None
            error_separator = ':error:'
            with transaction.atomic():
                details.append(headers)

                # check per line
                total = len(records[1:])
                for record_idx, record in enumerate(records[1:]):
                    self._update(f'Processing line {record_idx + column_header}/{total + column_header}')
                    detail = [str(r) for r in record]

                    # -----------------------------------------------------------------------
                    # Validation
                    # -----------------------------------------------------------------------
                    geometry, date_time, year, month = None, None, None, None
                    try:
                        geometry = self.reporting_units.get(
                            identifier=record[idx_administration_code]
                        )
                    except Geometry.DoesNotExist:
                        detail[idx_administration_code] += error_separator + 'Does not exist'

                    # check the value
                    value = record[idx_value]
                    try:
                        # convert to percent
                        value = float(value)

                        # this is specifically for %
                        if indicator.unit == '%':
                            value = value * 100
                            detail[idx_value] = f'{value}%'

                        # check the value in range
                        if value < indicator.min_value or value > indicator.max_value:
                            detail[idx_value] += error_separator + f'Value is not between {indicator.min_value}-{indicator.max_value}'
                    except ValueError:
                        try:
                            rule_index = rule_names.index(value.lower())
                        except ValueError:
                            detail[idx_value] += error_separator + f'Value is not in {rule_names}'
                        else:
                            try:
                                value = float(rules[rule_index].replace(' ', '').replace('x==', ''))
                            except ValueError:
                                detail[idx_value] += error_separator + f"Can't apply {value} to any rule"

                    # Check year in integer
                    if not record[idx_year]:
                        detail[idx_year] += error_separator + 'Year is empty'
                    else:
                        try:
                            year = int(record[idx_year])
                        except ValueError:
                            detail[idx_year] += error_separator + 'Year is not integer'

                    # Check month in integer
                    if not record[idx_month]:
                        detail[idx_month] += error_separator + 'Month is empty'
                    else:
                        try:
                            month = int(record[idx_month])
                        except ValueError:
                            detail[idx_month] += error_separator + 'Month is not integer'

                    if year and month:
                        try:
                            date_time = datetime(year, month, 1)
                            if not date_found:
                                date_found = date_time
                            if date_found != date_time:
                                detail[idx_month] += error_separator + f'Date is not {date_found.month}-{date_found.year}'
                        except ValueError as e:
                            detail[idx_month] += error_separator + str(e)
                            if 'month' not in e:
                                detail[idx_year] += error_separator + str(e)

                    if geometry and date_time:
                        indicator_value, created = IndicatorValue.objects.get_or_create(
                            indicator=indicator,
                            date=date_time,
                            geometry=geometry,
                            defaults={
                                'value': value
                            }
                        )
                        if not created:
                            detail[idx_month] += error_separator + f'Data exist for {date_found.month}-{date_found.year}'
                        else:
                            indicator_value.save()
                            for key, value in extra_data.items():
                                try:
                                    IndicatorExtraValue.objects.get_or_create(
                                        indicator_value=indicator_value,
                                        name=key,
                                        value=record[value]
                                    )
                                except IndexError:
                                    pass

                    # check if error separator is in detail
                    if error_separator in json.dumps(detail):
                        success = False

                    # -----------------------------------------------------------------------
                    # End of validation
                    # -----------------------------------------------------------------------
                    details.append(detail)

                if not success:
                    self.log.detail = json.dumps(details)
                    raise HarvestingError('Progress did not success. No data saved. Please check the detail to fix the error.')
        else:
            raise HarvestingError(f'Sheet name : {self.attributes.get("sheet_name", "")} does not exist.')
