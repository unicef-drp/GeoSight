"""Base for test API."""
from django.test.testcases import TestCase

from gap_data.tests.model_factories import (
    IndicatorF, IndicatorGroupF,
    GeometryLevelNameF, GeometryF,
    IndicatorScenarioRuleF
)


class BaseHarvesterTest(TestCase):
    """Base for test API."""

    def setUp(self):
        """To setup tests."""
        level = GeometryLevelNameF()
        self.indicator = IndicatorF(
            group=IndicatorGroupF(),
            geometry_reporting_level=level
        )
        IndicatorScenarioRuleF(indicator=self.indicator, rule='x==1'),
        IndicatorScenarioRuleF(indicator=self.indicator, rule='x==2'),
        IndicatorScenarioRuleF(indicator=self.indicator, rule='x==3'),
        IndicatorScenarioRuleF(indicator=self.indicator, rule='x==4'),

        GeometryF(
            identifier='A',
            geometry_level=level
        )

        GeometryF(
            identifier='B',
            geometry_level=level
        )

        GeometryF(
            identifier='C',
            geometry_level=level
        )
