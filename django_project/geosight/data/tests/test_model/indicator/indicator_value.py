""".Test for IndicatorValue model."""
from django.test.testcases import TestCase

from geosight.data.tests.model_factories import (
    IndicatorValueF, IndicatorF
)


class IndicatorValueTest(TestCase):
    """.Test for IndicatorValue model."""

    def setUp(self):
        """To setup test."""
        self.name = 'Rule 1'
        self.indicator_name = 'Indicator 1'

    def test_create(self):
        """Test create."""
        indicator = IndicatorF(name=self.indicator_name)
        value = IndicatorValueF(
            indicator=indicator,
            geom_identifier='Prov1'
        )
        self.assertEquals(value.indicator, indicator)
        self.assertEquals(value.geom_identifier, 'Prov1')
