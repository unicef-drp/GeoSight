"""Factory for ContextLayer."""
import factory

from gap_data.models.context_layer import (
    ContextLayer, ContextLayerParameter, ContextLayerStyle
)
from gap_data.tests.model_factories.instance import InstanceF


class ContextLayerF(factory.django.DjangoModelFactory):
    """Factory for ContextLayer."""

    instance = factory.SubFactory(InstanceF)
    name = factory.Sequence(lambda n: 'Context Layer {}'.format(n))

    class Meta:  # noqa: D106
        model = ContextLayer


class ContextLayerParameterF(factory.django.DjangoModelFactory):
    """Factory for ContextLayerParameter."""

    context_layer = factory.SubFactory(ContextLayerF)
    name = factory.Sequence(lambda n: 'Param {}'.format(n))

    class Meta:  # noqa: D106
        model = ContextLayerParameter


class ContextLayerStyleF(factory.django.DjangoModelFactory):
    """Factory for ContextLayerStyle."""

    context_layer = factory.SubFactory(ContextLayerF)
    name = factory.Sequence(lambda n: 'Param {}'.format(n))

    class Meta:  # noqa: D106
        model = ContextLayerStyle
