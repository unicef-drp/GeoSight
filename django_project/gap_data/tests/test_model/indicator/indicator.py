from datetime import datetime, timedelta

from django.test.testcases import TestCase

from gap_data.models.indicator.indicator import Indicator, AggregationMethod
from gap_data.tests.model_factories import (
    IndicatorF, InstanceF, IndicatorGroupF, IndicatorFrequencyF,
    GeometryLevelNameF, GeometryF, IndicatorValueF, IndicatorScenarioRuleF,
    ScenarioLevelF
)


class IndicatorTest(TestCase):
    """ Test for Indicator model """

    def setUp(self):
        self.name = 'Indicator 1'

    def test_create(self):
        group = IndicatorGroupF(
            instance=InstanceF()
        )
        frequency = IndicatorFrequencyF()
        geometry_reporting_level = GeometryLevelNameF()

        indicator = IndicatorF(
            name=self.name,
            group=group,
            frequency=frequency,
            geometry_reporting_level=geometry_reporting_level
        )
        self.assertEquals(indicator.name, self.name)
        self.assertEquals(indicator.group, group)
        self.assertEquals(indicator.frequency, frequency)
        self.assertEquals(indicator.geometry_reporting_level,
                          geometry_reporting_level)

    def test_allow_to_harvest_new_data(self):
        frequency = IndicatorFrequencyF(
            frequency=10
        )
        indicator = IndicatorF(
            name=self.name,
            group=IndicatorGroupF(
                instance=InstanceF()
            ),
            frequency=frequency,
            geometry_reporting_level=GeometryLevelNameF()
        )

        # if no data yet
        self.assertTrue(indicator.allow_to_harvest_new_data)

        # if data but expired
        IndicatorValueF(
            date=datetime.today() - timedelta(days=frequency.frequency + 1),
            indicator=indicator
        )
        self.assertTrue(indicator.allow_to_harvest_new_data)

        # if data is new
        IndicatorValueF(
            date=datetime.today() - timedelta(days=frequency.frequency - 1),
            indicator=indicator
        )
        self.assertFalse(indicator.allow_to_harvest_new_data)

    def test_list(self):
        """ Test list method """
        group = IndicatorGroupF(
            instance=InstanceF()
        )
        geometry_reporting_level = GeometryLevelNameF()
        IndicatorF(
            name='Name 1',
            group=group,
            show_in_context_analysis=True,
            geometry_reporting_level=geometry_reporting_level
        )
        IndicatorF(
            name='Name 1',
            group=group,
            show_in_context_analysis=False,
            geometry_reporting_level=geometry_reporting_level
        )
        self.assertEquals(len(Indicator.list()), 1)

    def test_rules(self):
        """ Check legends """
        geometry_reporting_level = GeometryLevelNameF()
        indicator = IndicatorF(
            name='Name 1',
            group=IndicatorGroupF(
                instance=InstanceF()
            ),
            geometry_reporting_level=geometry_reporting_level
        )
        rules = [
            IndicatorScenarioRuleF(indicator=indicator, rule='x==1'),
            IndicatorScenarioRuleF(indicator=indicator, rule='x==2 or x==3'),
            IndicatorScenarioRuleF(indicator=indicator, rule='x>=4 and x<=5'),
            IndicatorScenarioRuleF(indicator=indicator, rule='x>5'),
            IndicatorScenarioRuleF(indicator=indicator, rule='x<5')
        ]
        for rule in rules:
            self.assertTrue(rule.name in indicator.legends.keys())
            self.assertEquals(rule.color,
                              indicator.legends[rule.name]['color'])
            self.assertEquals(rule.scenario_level.level,
                              indicator.legends[rule.name]['level'])

        # check scenario rules
        self.assertEquals(
            indicator.scenario_rule(rules[0].scenario_level.level), rules[0])

        # check rules by value
        self.assertEquals(indicator.scenario_level(1), rules[0].scenario_level)
        self.assertEquals(indicator.scenario_level(2), rules[1].scenario_level)
        self.assertEquals(indicator.scenario_level(4), rules[2].scenario_level)
        self.assertEquals(indicator.scenario_level(6), rules[3].scenario_level)
        self.assertEquals(indicator.scenario_level(0), rules[4].scenario_level)

    def test_value(self):
        instance = InstanceF()
        level_1 = ScenarioLevelF(name='Level 1', level=1)
        level_2 = ScenarioLevelF(name='Level 2', level=2)
        level_3 = ScenarioLevelF(name='Level 3', level=3)
        level_4 = ScenarioLevelF(name='Level 4', level=4)

        country = GeometryLevelNameF(name='country')
        province = GeometryLevelNameF(name='province')
        geom_country = GeometryF(name='Country', geometry_level=country)
        geom_province_1 = GeometryF(
            instance=instance, name='Province 1',
            geometry_level=province, child_of=geom_country)
        geom_province_2 = GeometryF(
            instance=instance, name='Province 2',
            geometry_level=province, child_of=geom_country)
        geom_province_3 = GeometryF(
            instance=instance, name='Province 3',
            geometry_level=province, child_of=geom_country)
        # indicator 1
        indicator = IndicatorF(
            name='Name 1',
            group=IndicatorGroupF(
                instance=instance
            ),
            geometry_reporting_level=province,
            aggregation_method=AggregationMethod.MAJORITY
        )
        rules = [
            IndicatorScenarioRuleF(
                indicator=indicator, rule='x==1', scenario_level=level_1
            ),
            IndicatorScenarioRuleF(
                indicator=indicator, rule='x==2 or x==3',
                scenario_level=level_2
            ),
            IndicatorScenarioRuleF(
                indicator=indicator, rule='x>=4 and x<=5',
                scenario_level=level_3
            ),
            IndicatorScenarioRuleF(
                indicator=indicator, rule='x>5', scenario_level=level_4
            )
        ]
        # set value
        IndicatorValueF(
            indicator=indicator, date=datetime.today() - timedelta(days=10),
            value=1,
            geometry=geom_province_1
        )
        IndicatorValueF(
            indicator=indicator, value=3,
            geometry=geom_province_1
        )
        IndicatorValueF(
            indicator=indicator, value=2,
            geometry=geom_province_2
        )
        IndicatorValueF(
            indicator=indicator, value=2,
            geometry=geom_province_3
        )
        values = indicator.values(geom_country, country, datetime.today())
        predicted_value = {
            'indicator_id': indicator.id,
            'geometry_id': geom_country.id,
            'geometry_code': geom_country.identifier,
            'geometry_name': geom_country.name,
            'value': 2.0,
            'scenario_value': 2,
            'scenario_text': rules[1].name,
            'text_color': None,
            'background_color': rules[1].color
        }
        for key, value in values[0].items():
            self.assertEquals(
                value, predicted_value[key]
            )
