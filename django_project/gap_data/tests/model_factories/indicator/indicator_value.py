"""Factory model for Indicator Value."""
import datetime

import factory

from gap_data.models.indicator import IndicatorValue, IndicatorExtraValue
from gap_data.tests.model_factories.reference_layer import GeometryF
from gap_data.tests.model_factories.indicator.indicator import IndicatorF


class IndicatorValueF(factory.django.DjangoModelFactory):
    """Factory of IndicatorValue."""

    geometry = factory.SubFactory(GeometryF)
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
