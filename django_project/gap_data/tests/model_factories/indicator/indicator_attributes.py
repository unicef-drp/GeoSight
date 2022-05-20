"""Factory for Indicator Attributes."""
import factory

from gap_data.models.indicator import IndicatorGroup, IndicatorFrequency


class IndicatorGroupF(factory.django.DjangoModelFactory):
    """Factory for IndicatorGroup."""

    name = factory.Sequence(lambda n: 'Group {}'.format(n))

    class Meta:  # noqa: D106
        model = IndicatorGroup


class IndicatorFrequencyF(factory.django.DjangoModelFactory):
    """Factory for IndicatorFrequency."""

    name = factory.Sequence(lambda n: 'Frequency {}'.format(n))
    frequency = factory.Sequence(lambda n: n)

    class Meta:  # noqa: D106
        model = IndicatorFrequency
