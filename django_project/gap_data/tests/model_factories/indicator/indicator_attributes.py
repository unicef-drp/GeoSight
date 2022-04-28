"""Factory for Indicator Attributes."""
import factory

from gap_data.models.indicator import IndicatorGroup, IndicatorFrequency
from gap_data.tests.model_factories.instance import InstanceF


class IndicatorGroupF(factory.django.DjangoModelFactory):
    """Factory for IndicatorGroup."""

    instance = factory.SubFactory(InstanceF)
    name = factory.Sequence(lambda n: 'Group {}'.format(n))

    class Meta:  # noqa: D106
        model = IndicatorGroup


class IndicatorFrequencyF(factory.django.DjangoModelFactory):
    """Factory for IndicatorFrequency."""

    name = factory.Sequence(lambda n: 'Frequency {}'.format(n))
    frequency = factory.Sequence(lambda n: n)

    class Meta:  # noqa: D106
        model = IndicatorFrequency
