"""Harvester get the data from api with geography and today date."""
from django.utils.timezone import now

from gap_harvester.harveters._base import (
    BaseHarvester, HarvestingError
)


class APIWithGeographyAndTodayDate(BaseHarvester):
    """Harvester get the data from api with geography and today date."""

    description = (
        "Harvester to harvest from API with list of geography with "
        "it's value using date when the harvester run."
    )

    @staticmethod
    def additional_attributes(**kwargs) -> dict:
        """Return additional attributes."""
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
        }

    def _process(self):
        """Run the harvester."""
        try:
            api_url = self.attributes['api_url']
            if not api_url:
                raise KeyError('api_url ')
            keys_for_list = self.attributes['keys_for_list']
            keys_for_geography_identifier = self.attributes[
                'keys_for_geography_identifier']
            if not keys_for_geography_identifier:
                raise KeyError('keys_for_geography_identifier ')
            keys_for_value = self.attributes['keys_for_value']
            if not keys_for_value:
                raise KeyError('keys_for_value ')
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
                date_data = now()

                geography_name = self.eval_json(
                    row, keys_for_geography_identifier)
                geography_identifier = self.mapping[geography_name]
                geometry = self.reporting_units.filter(
                    identifier=geography_identifier
                ).first()

                if geometry:
                    self._update(
                        (
                            f'Save data for {geometry.identifier} '
                            f'with date {date_data} and value {value}'
                        )
                    )
                    self.save_indicator_data(
                        value, date_data, geometry
                    )
                else:
                    self._update(
                        f'Geometry {geography_identifier} does not exist')

            except KeyError as e:
                self._update(f'{e} is found.')
