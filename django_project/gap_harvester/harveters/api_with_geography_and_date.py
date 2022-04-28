from datetime import datetime

from gap_harvester.harveters._base import (
    BaseHarvester, HarvestingError
)


class APIWithGeographyAndDate(BaseHarvester):
    """
    Harvester just get the data from api and has list and
    map the geography name with data
    """
    description = "Harvester to harvest from API with list of geography with it's value and the value's date"

    @staticmethod
    def additional_attributes(**kwargs) -> dict:
        return {
            'api_url': {
                'description': "URL of api"
            },
            'keys_for_list': {
                'description': (
                    "The string keys for where the list. "
                    "Use like this : x['features']. "
                    "It will check data['features']."
                    "Let it empty if it is directly list."
                )
            },
            'keys_for_geography_identifier': {
                'description': (
                    "Key for the geography identifier in row of list. "
                    "Example: x['properties']['name']. "
                    "It will check row['properties']['name']."
                )
            },
            'keys_for_value': {
                'description': (
                    "Key for the value in row of list. "
                    "Example: x['properties']['value']. "
                    "It will check row['properties']['value']."
                )
            },
            'keys_for_date': {
                'description': (
                    "Key for the date in row of list. "
                    "Example: x['properties']['date']. "
                    "it will check row['properties']['date']."
                )
            },
            'date_format': {
                'description': (
                    "Format of the date from the data. "
                    "Check <a href='https://strftime.org/'>here</a>."
                    "Let it empty to use timestamp instead."
                ),
                'required': False
            },
        }

    def _process(self):
        """ Run the harvester """

        try:
            api_url = self.attributes['api_url']
            if not api_url:
                raise KeyError('api_url ')
            keys_for_geography_identifier = self.attributes['keys_for_geography_identifier']
            if not keys_for_geography_identifier:
                raise KeyError('keys_for_geography_identifier ')
            keys_for_value = self.attributes['keys_for_value']
            if not keys_for_value:
                raise KeyError('keys_for_value ')
            keys_for_date = self.attributes['keys_for_date']
            if not keys_for_date:
                raise KeyError('keys_for_date ')
            date_format = self.attributes['date_format']
            keys_for_list = self.attributes['keys_for_list']
        except KeyError as e:
            raise HarvestingError(f'{e} is not provided.')

        response = self._request_api(api_url)
        self._update(f'Request API : {api_url}')

        data_list = response.json()
        if keys_for_list:
            try:
                data_list = self.eval_json(data_list, keys_for_list)
            except KeyError as e:
                raise HarvestingError(f'{e} is found.')
        for row in data_list:
            try:
                value = self.eval_json(row, keys_for_value)
                date_data = self.eval_json(row, keys_for_date)
                if date_format:
                    date_data = datetime.strptime(date_data, date_format).date()
                else:
                    try:
                        date_data = datetime.fromtimestamp(date_data).date()
                    except ValueError:
                        date_data = datetime.fromtimestamp(int(date_data) / 1000).date()
                    except TypeError:
                        raise HarvestingError(f'The date is not in timestamp, so needs to put time format in attributes.')

                geography_name = self.eval_json(row, keys_for_geography_identifier)
                geography_identifier = self.mapping[geography_name]
                geometry = self.reporting_units.filter(
                    identifier=geography_identifier
                ).first()

                if geometry:
                    self._update(f'Save data for {geometry.identifier} with date {date_data} and value {value}')
                    self.save_indicator_data(
                        value, date_data, geometry
                    )
                else:
                    self._update(f'Geometry {geography_identifier} does not exist')

            except KeyError as e:
                self._update(f'{e} is found.')
