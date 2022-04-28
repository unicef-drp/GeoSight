""".Test for IndicatorValue model."""
from django.test.testcases import TestCase

from gap_data.tests.model_factories import (
    IndicatorValueF, IndicatorF, GeometryF
)


class IndicatorValueTest(TestCase):
    """.Test for IndicatorValue model."""

    def setUp(self):
        """To setup test."""
        self.name = 'Scenario Rule 1'
        self.indicator_name = 'Indicator 1'

    def test_create(self):
        """Test create."""
        indicator = IndicatorF(name=self.indicator_name)
        geometry = GeometryF()
        value = IndicatorValueF(
            indicator=indicator,
            geometry=geometry
        )
        self.assertEquals(value.indicator, indicator)
        self.assertEquals(value.geometry, geometry)
