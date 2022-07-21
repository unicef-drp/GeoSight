"""Harvester from exposed API."""
import uuid

from django.shortcuts import reverse

from geosight.harvester.harveters._base import BaseHarvester


class UsingExposedAPI(BaseHarvester):
    """Harvester from exposed API.

    Harvester to indicate the indicator is just receiving
    data using exposed API from external client
    """

    description = (
        "Harvester to indicate the indicator is just "
        "receiving data using exposed API from external client"
    )

    @staticmethod
    def additional_attributes(**kwargs) -> dict:
        """Return additional attributes."""
        api_url = ''
        if 'indicator' in kwargs and kwargs['indicator']:
            api_url = reverse(
                'indicator-upload-values-api',
                args=[kwargs['indicator'].id]
            )
        return {
            'token': {
                'title': "Token",
                'description': (
                    "Token that will be used "
                    "for pushing data using API."
                ),
                'value': str(uuid.uuid4()),
                'read_only': True
            },
            'API URL': {
                'title': "API URL",
                'description': "Note for this API.",
                'value': api_url,
                'read_only': True,
                'autocreated': True
            },
            'note': {
                'title': "Note",
                'description': "Note for this API.",
                'required': False
            },
        }

    def _process(self):
        """To run the harvester."""
        return

    @property
    def allow_to_harvest_new_data(self):
        """Check if the new data can be harvested.

        It will check based on the frequency.
        """
        return False
