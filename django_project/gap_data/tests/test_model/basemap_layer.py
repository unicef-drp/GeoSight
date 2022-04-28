import urllib.parse

from django.test.testcases import TestCase

from gap_data.serializer.basemap_layer import BasemapLayerSerializer
from gap_data.tests.model_factories import (
    BasemapLayerF, BasemapLayerParameterF
)


class BasemapLayerTest(TestCase):
    """ Test for Basemap model """

    def setUp(self):
        self.name = 'Base Map 1'
        self.params = {
            'param 1': 'value 1',
            'param 2': 'value 2',
            'param 3': 'value 3',
        }

    def test_create(self):
        basemap = BasemapLayerF(
            name=self.name
        )

        for name, value in self.params.items():
            BasemapLayerParameterF(
                basemap_layer=basemap,
                name=name,
                value=value
            )

        basemap_data = BasemapLayerSerializer(basemap).data
        self.assertEquals(basemap_data['name'], self.name)
        for key, value in basemap_data['parameters'].items():
            self.assertEquals(urllib.parse.quote(self.params[key]), value)
