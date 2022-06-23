"""Base for test API."""
from django.test.testcases import TestCase

from geosight.data.tests.model_factories import (
    IndicatorF, IndicatorGroupF,
    IndicatorRuleF
)


class BaseHarvesterTest(TestCase):
    """Base for test API."""

    reporting_level = 'District'

    def setUp(self):
        """To setup tests."""
        self.indicator = IndicatorF(
            group=IndicatorGroupF(),
            reporting_level='District'
        )
        IndicatorRuleF(indicator=self.indicator, rule='x==1'),
        IndicatorRuleF(indicator=self.indicator, rule='x==2'),
        IndicatorRuleF(indicator=self.indicator, rule='x==3'),
        IndicatorRuleF(indicator=self.indicator, rule='x==4'),
