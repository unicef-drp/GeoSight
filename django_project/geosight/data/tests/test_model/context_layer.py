"""Test for Basemap model."""
from django.test.testcases import TestCase

from geosight.data.serializer.context_layer import ContextLayerSerializer
from geosight.data.tests.model_factories import ContextLayerF, ContextLayerStyleF


class BasemapLayerTest(TestCase):
    """Test for Basemap model."""

    def setUp(self):
        """To setup test."""
        self.name = 'Context Layer 1'
        self.params = {
            'param 1': 'value 1',
            'param 2': 'value 2',
            'param 3': 'value 3',
        }
        self.style = {
            'style 1': 'value 1',
            'style 2': 'value 2',
            'style 3': 'value 3',
        }

    def test_create(self):
        """Test create."""
        context_layer = ContextLayerF(
            name=self.name,
            url='test?' + '&'.join(
                [f'{key}={value}' for key, value in self.params.items()]
            )
        )
        for name, value in self.style.items():
            ContextLayerStyleF(
                context_layer=context_layer,
                name=name,
                value=value
            )

        context_layer_data = ContextLayerSerializer(context_layer).data
        self.assertEquals(context_layer_data['name'], self.name)
        for key, value in context_layer_data['parameters'].items():
            self.assertEquals(self.params[key], value)
        for key, value in context_layer_data['style'].items():
            self.assertEquals(self.style[key], value)
