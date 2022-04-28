from django.test.testcases import TestCase

from gap_data.tests.model_factories import (
    IndicatorF, InstanceF, IndicatorGroupF,
    GeometryLevelNameF, GeometryF,
    IndicatorScenarioRuleF
)


class BaseHarvesterTest(TestCase):
    """ Base for test API """

    def setUp(self):
        self.instance = InstanceF()
        level = GeometryLevelNameF()
        self.indicator = IndicatorF(
            group=IndicatorGroupF(
                instance=self.instance
            ),
            geometry_reporting_level=level
        )
        IndicatorScenarioRuleF(indicator=self.indicator, rule='x==1'),
        IndicatorScenarioRuleF(indicator=self.indicator, rule='x==2'),
        IndicatorScenarioRuleF(indicator=self.indicator, rule='x==3'),
        IndicatorScenarioRuleF(indicator=self.indicator, rule='x==4'),

        GeometryF(
            identifier='A',
            instance=self.instance,
            geometry_level=level
        )

        GeometryF(
            identifier='B',
            instance=self.instance,
            geometry_level=level
        )

        GeometryF(
            identifier='C',
            instance=self.instance,
            geometry_level=level
        )
