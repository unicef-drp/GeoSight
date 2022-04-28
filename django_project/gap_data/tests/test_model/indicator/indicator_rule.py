from django.test.testcases import TestCase

from gap_data.tests.model_factories import (
    IndicatorScenarioRuleF, IndicatorF
)


class IndicatorScenarioRuleTest(TestCase):
    """ Test for IndicatorScenarioRule model """

    def setUp(self):
        self.name = 'Scenario Rule 1'
        self.indicator_name = 'Indicator 1'

    def test_create(self):
        indicator = IndicatorF(name=self.indicator_name)
        scenario_rule = IndicatorScenarioRuleF(
            name=self.name,
            indicator=indicator
        )
        self.assertEquals(scenario_rule.name, self.name)
        self.assertEquals(scenario_rule.indicator, indicator)
