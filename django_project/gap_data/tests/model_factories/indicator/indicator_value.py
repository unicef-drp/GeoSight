"""Factory model for Indicator Value."""
import datetime

import factory

from gap_data.models.indicator import IndicatorValue, IndicatorExtraValue
from gap_data.tests.model_factories.indicator.indicator import IndicatorF


class IndicatorValueF(factory.django.DjangoModelFactory):
    """Factory of IndicatorValue."""

    geom_identifier = factory.Sequence(lambda n: 'Geom {}'.format(n))
    value = factory.Sequence(lambda n: n)
    date = datetime.datetime.now()
    indicator = factory.SubFactory(IndicatorF)

    class Meta:  # noqa: D106
        model = IndicatorValue


class IndicatorExtraValueF(factory.django.DjangoModelFactory):
    """Factory of IndicatorExtraValue."""

    indicator_value = factory.SubFactory(IndicatorValueF)
    name = factory.Sequence(lambda n: 'Indicator Extra {}'.format(n))
    value = factory.Sequence(lambda n: n)

    class Meta:  # noqa: D106
        model = IndicatorExtraValue
