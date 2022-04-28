"""Factory for BasemapLayer."""
import factory

from gap_data.models.basemap_layer import BasemapLayer, BasemapLayerParameter
from gap_data.tests.model_factories.instance import InstanceF


class BasemapLayerF(factory.django.DjangoModelFactory):
    """Factory for BasemapLayer."""

    instance = factory.SubFactory(InstanceF)
    name = factory.Sequence(lambda n: 'Basemap Layer {}'.format(n))

    class Meta:  # noqa: D106
        model = BasemapLayer


class BasemapLayerParameterF(factory.django.DjangoModelFactory):
    """Factory for BasemapLayerParameter."""

    basemap_layer = factory.SubFactory(BasemapLayerF)
    name = factory.Sequence(lambda n: 'Param {}'.format(n))

    class Meta:  # noqa: D106
        model = BasemapLayerParameter
