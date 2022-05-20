""".Test for Indicator model."""
from datetime import datetime, timedelta

from django.test.testcases import TestCase

from gap_data.models.indicator.indicator import Indicator, AggregationMethod
from gap_data.tests.model_factories import (
    IndicatorF, IndicatorGroupF, IndicatorFrequencyF,
    GeometryLevelNameF, GeometryF, IndicatorValueF, IndicatorRuleF
)


class IndicatorTest(TestCase):
    """.Test for Indicator model."""

    def setUp(self):
        """To setup test."""
        self.name = 'Indicator 1'

    def test_create(self):
        """Test create."""
        group = IndicatorGroupF()
        frequency = IndicatorFrequencyF()
        geometry_reporting_level = GeometryLevelNameF()

        indicator = IndicatorF(
            name=self.name,
            group=group,
            frequency=frequency,
            reporting_level=geometry_reporting_level.name
        )
        self.assertEquals(indicator.name, self.name)
        self.assertEquals(indicator.group, group)
        self.assertEquals(indicator.frequency, frequency)
        self.assertEquals(
            indicator.reporting_level, geometry_reporting_level.name)

    def test_allow_to_harvest_new_data(self):
        """Test allow harvest new data."""
        frequency = IndicatorFrequencyF(
            frequency=10
        )
        indicator = IndicatorF(
            name=self.name,
            group=IndicatorGroupF(),
            frequency=frequency,
            reporting_level=GeometryLevelNameF().name
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
        """Test list method."""
        group = IndicatorGroupF()
        geometry_reporting_level = GeometryLevelNameF()
        IndicatorF(
            name='Name 1',
            group=group,
            reporting_level=geometry_reporting_level.name
        )
        IndicatorF(
            name='Name 1',
            group=group,
            reporting_level=geometry_reporting_level.name
        )
        self.assertEquals(Indicator.objects.count(), 2)

    def test_rules(self):
        """Check rules."""
        geometry_reporting_level = GeometryLevelNameF()
        indicator = IndicatorF(
            name='Name 1',
            group=IndicatorGroupF(),
            reporting_level=geometry_reporting_level.name
        )
        rules = [
            IndicatorRuleF(indicator=indicator, rule='x==1'),
            IndicatorRuleF(indicator=indicator, rule='x==2 or x==3'),
            IndicatorRuleF(indicator=indicator, rule='x>=4 and x<=5'),
            IndicatorRuleF(indicator=indicator, rule='x>5'),
            IndicatorRuleF(indicator=indicator, rule='x<5')
        ]
        for rule in rules:
            found = False
            color = ''
            for indicator_rule in indicator.rules_dict():
                if indicator_rule['name'] == rule.name:
                    found = True
                    color = indicator_rule['color']
            self.assertTrue(found)
            self.assertEquals(
                rule.color,
                color
            )

    def test_value(self):
        """Test value."""
        country = GeometryLevelNameF(name='country')
        province = GeometryLevelNameF(name='province')
        geom_country = GeometryF(name='Country', geometry_level=country)
        geom_province_1 = GeometryF(
            name='Province 1',
            geometry_level=province, child_of=geom_country)
        geom_province_2 = GeometryF(
            name='Province 2',
            geometry_level=province, child_of=geom_country)
        geom_province_3 = GeometryF(
            name='Province 3',
            geometry_level=province, child_of=geom_country)
        # indicator 1
        indicator = IndicatorF(
            name='Name 1',
            group=IndicatorGroupF(),
            reporting_level=province.name,
            aggregation_method=AggregationMethod.MAJORITY
        )
        # rules = [
        #     IndicatorRuleF(
        #         indicator=indicator, rule='x==1'
        #     ),
        #     IndicatorRuleF(
        #         indicator=indicator, rule='x==2 or x==3'
        #     ),
        #     IndicatorRuleF(
        #         indicator=indicator, rule='x>=4 and x<=5'
        #     ),
        #     IndicatorRuleF(
        #         indicator=indicator, rule='x>5'
        #     )
        # ]
        # set value
        IndicatorValueF(
            indicator=indicator, date=datetime.today() - timedelta(days=10),
            value=1,
            geom_identifier=geom_province_1.identifier
        )
        IndicatorValueF(
            indicator=indicator, value=3,
            geom_identifier=geom_province_1.identifier
        )
        IndicatorValueF(
            indicator=indicator, value=2,
            geom_identifier=geom_province_2.identifier
        )
        IndicatorValueF(
            indicator=indicator, value=2,
            geom_identifier=geom_province_3.identifier
        )
        # TODO:
        #  Fix this
        # values = indicator.values(geom_country, country, datetime.today())
        # predicted_value = {
        #     'indicator_id': indicator.id,
        #     'geometry_id': geom_country.id,
        #     'geometry_code': geom_country.identifier,
        #     'geometry_name': geom_country.name,
        #     'value': 2.0,
        #     'rule_value': 2,
        #     'rule_text': rules[1].name,
        #     'text_color': None,
        #     'background_color': rules[1].color
        # }
        # for key, value in values[0].items():
        #     self.assertEquals(
        #         value, predicted_value[key]
        #     )
