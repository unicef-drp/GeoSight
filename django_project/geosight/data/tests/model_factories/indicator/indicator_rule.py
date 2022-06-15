"""Factory model for IndicatorRule."""
import factory

from geosight.data.models.indicator import IndicatorRule
from geosight.data.tests.model_factories.indicator import IndicatorF


class IndicatorRuleF(factory.django.DjangoModelFactory):
    """Factory of IndicatorRule."""

    name = factory.Sequence(lambda n: 'Rule {}'.format(n))
    indicator = factory.SubFactory(IndicatorF)
    color = factory.Sequence(lambda n: '#{}'.format(n))

    class Meta:  # noqa: D106
        model = IndicatorRule
