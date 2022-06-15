"""Test for IndicatorGroup model."""
from django.test.testcases import TestCase

from geosight.data.tests.model_factories import (
    IndicatorGroupF, IndicatorFrequencyF
)


class IndicatorGroupTest(TestCase):
    """Test for IndicatorGroup model."""

    def setUp(self):
        """To setup test."""
        self.name = 'Group 1'

    def test_create(self):
        """Test create."""
        group = IndicatorGroupF(
            name=self.name
        )
        self.assertEquals(group.name, self.name)


class IndicatorFrequencyTest(TestCase):
    """Test for IndicatorFrequency model."""

    def setUp(self):
        """To setup test."""
        self.name = 'Frequency 1'

    def test_create(self):
        """Test create."""
        frequency = IndicatorFrequencyF(
            name=self.name
        )
        self.assertEquals(frequency.name, self.name)
