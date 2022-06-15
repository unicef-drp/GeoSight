"""Factory for ContextLayer."""
import factory

from geosight.data.models.context_layer import ContextLayer, ContextLayerStyle


class ContextLayerF(factory.django.DjangoModelFactory):
    """Factory for ContextLayer."""

    name = factory.Sequence(lambda n: 'Context Layer {}'.format(n))

    class Meta:  # noqa: D106
        model = ContextLayer


class ContextLayerStyleF(factory.django.DjangoModelFactory):
    """Factory for ContextLayerStyle."""

    context_layer = factory.SubFactory(ContextLayerF)
    name = factory.Sequence(lambda n: 'Param {}'.format(n))

    class Meta:  # noqa: D106
        model = ContextLayerStyle
