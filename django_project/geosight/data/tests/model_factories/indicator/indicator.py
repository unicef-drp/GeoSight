"""Factory for Indicator."""
import factory

from geosight.data.models.indicator import Indicator
from geosight.data.tests.model_factories.indicator import (
    IndicatorGroupF, IndicatorFrequencyF
)


class IndicatorF(factory.django.DjangoModelFactory):
    """Factory for Indicator."""

    group = factory.SubFactory(IndicatorGroupF)
    frequency = factory.SubFactory(IndicatorFrequencyF)
    reporting_level = factory.Sequence(lambda n: 'Level {}'.format(n))
    name = factory.Sequence(lambda n: 'Indicator {}'.format(n))

    class Meta:  # noqa: D106
        model = Indicator
