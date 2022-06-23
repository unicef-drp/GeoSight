""".Test for Indicator model."""
from datetime import datetime, timedelta

from django.test.testcases import TestCase

from geosight.data.models.indicator.indicator import (
    Indicator, AggregationMethod
)
from geosight.data.tests.model_factories import (
    IndicatorF, IndicatorGroupF, IndicatorFrequencyF,
    IndicatorValueF, IndicatorRuleF
)


class IndicatorTest(TestCase):
    """.Test for Indicator model."""

    geometry_reporting_level = 'District'

    def setUp(self):
        """To setup test."""
        self.name = 'Indicator 1'

    def test_create(self):
        """Test create."""
        group = IndicatorGroupF()
        frequency = IndicatorFrequencyF()

        indicator = IndicatorF(
            name=self.name,
            group=group,
            frequency=frequency,
            reporting_level=self.geometry_reporting_level
        )
        self.assertEquals(indicator.name, self.name)
        self.assertEquals(indicator.group, group)
        self.assertEquals(indicator.frequency, frequency)
        self.assertEquals(
            indicator.reporting_level, self.geometry_reporting_level)

    def test_allow_to_harvest_new_data(self):
        """Test allow harvest new data."""
        frequency = IndicatorFrequencyF(
            frequency=10
        )
        indicator = IndicatorF(
            name=self.name,
            group=IndicatorGroupF(),
            frequency=frequency,
            reporting_level=self.geometry_reporting_level
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
        geometry_reporting_level = self.geometry_reporting_level
        IndicatorF(
            name='Name 1',
            group=group,
            reporting_level=geometry_reporting_level
        )
        IndicatorF(
            name='Name 1',
            group=group,
            reporting_level=geometry_reporting_level
        )
        self.assertEquals(Indicator.objects.count(), 2)

    def test_rules(self):
        """Check rules."""
        indicator = IndicatorF(
            name='Name 1',
            group=IndicatorGroupF(),
            reporting_level=self.geometry_reporting_level
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
        province = 'province'
        # indicator 1
        indicator = IndicatorF(
            name='Name 1',
            group=IndicatorGroupF(),
            reporting_level=province,
            aggregation_method=AggregationMethod.MAJORITY
        )
        # set value
        IndicatorValueF(
            indicator=indicator, date=datetime.today() - timedelta(days=10),
            value=1,
            geom_identifier='Prov1'
        )
        IndicatorValueF(
            indicator=indicator, value=3,
            geom_identifier='Prov1'
        )
        IndicatorValueF(
            indicator=indicator, value=2,
            geom_identifier='Prov2'
        )
        IndicatorValueF(
            indicator=indicator, value=2,
            geom_identifier='Prov3'
        )
