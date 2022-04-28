import factory

from gap_data.models.indicator import Indicator
from gap_data.tests.model_factories.geometry import (
    GeometryLevelNameF
)
from gap_data.tests.model_factories.indicator.indicator_attributes import (
    IndicatorGroupF, IndicatorFrequencyF
)


class IndicatorF(factory.django.DjangoModelFactory):
    group = factory.SubFactory(IndicatorGroupF)
    frequency = factory.SubFactory(IndicatorFrequencyF)
    geometry_reporting_level = factory.SubFactory(GeometryLevelNameF)
    name = factory.Sequence(lambda n: 'Indicator {}'.format(n))

    class Meta:
        model = Indicator
