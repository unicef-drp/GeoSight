"""Factory for BasemapLayer."""
import factory

from geosight.data.models.basemap_layer import BasemapLayer, BasemapLayerParameter


class BasemapLayerF(factory.django.DjangoModelFactory):
    """Factory for BasemapLayer."""

    name = factory.Sequence(lambda n: 'Basemap Layer {}'.format(n))

    class Meta:  # noqa: D106
        model = BasemapLayer


class BasemapLayerParameterF(factory.django.DjangoModelFactory):
    """Factory for BasemapLayerParameter."""

    basemap_layer = factory.SubFactory(BasemapLayerF)
    name = factory.Sequence(lambda n: 'Param {}'.format(n))

    class Meta:  # noqa: D106
        model = BasemapLayerParameter
