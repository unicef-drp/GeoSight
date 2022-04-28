import uuid

from django.shortcuts import reverse

from gap_harvester.harveters._base import BaseHarvester


class UsingExposedAPI(BaseHarvester):
    """
    Harvester to indicate the indicator is just receiving data using exposed API from external client
    """
    description = "Harvester to indicate the indicator is just receiving data using exposed API from external client"

    @staticmethod
    def additional_attributes(**kwargs) -> dict:
        api_url = ''
        if 'instance' in kwargs and 'indicator' in kwargs:
            api_url = reverse(
                'indicator-values-api', args=[kwargs['instance'].slug, kwargs['indicator'].id]
            )
        return {
            'token': {
                'title': "Token",
                'description': "Token that will be used for pushing data using API.",
                'value': str(uuid.uuid4()),
                'read_only': True
            },
            'API URL': {
                'title': "API URL",
                'description': "Note for this API.",
                'value': f'<a href="{api_url}">{api_url}</a>',
                'read_only': True
            },
            'note': {
                'title': "Note",
                'description': "Note for this API.",
                'required': False
            },
        }

    def _process(self):
        """ Run the harvester """
        return

    @property
    def allow_to_harvest_new_data(self):
        """
        Allowing if the new data can be harvested
        It will check based on the frequency
        """
        return False
