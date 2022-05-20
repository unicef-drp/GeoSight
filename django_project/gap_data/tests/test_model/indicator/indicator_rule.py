"""Test for IndicatorRule model."""
from django.test.testcases import TestCase

from gap_data.tests.model_factories import IndicatorRuleF, IndicatorF


class IndicatorRuleTest(TestCase):
    """Test for IndicatorRule model."""

    def setUp(self):
        """To setup test."""
        self.name = 'Indicator Rule 1'
        self.indicator_name = 'Indicator 1'

    def test_create(self):
        """Test create."""
        indicator = IndicatorF(name=self.indicator_name)
        indicator_rule = IndicatorRuleF(
            name=self.name,
            indicator=indicator
        )
        self.assertEquals(indicator_rule.name, self.name)
        self.assertEquals(indicator_rule.indicator, indicator)
