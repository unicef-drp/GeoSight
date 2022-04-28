from django.test.testcases import TestCase

from gap_data.tests.model_factories import (
    IndicatorGroupF, IndicatorFrequencyF
)


class IndicatorGroupTest(TestCase):
    """ Test for IndicatorGroup model """

    def setUp(self):
        self.name = 'Group 1'

    def test_create(self):
        group = IndicatorGroupF(
            name=self.name
        )
        self.assertEquals(group.name, self.name)


class IndicatorFrequencyTest(TestCase):
    """ Test for IndicatorFrequency model """

    def setUp(self):
        self.name = 'Frequency 1'

    def test_create(self):
        frequency = IndicatorFrequencyF(
            name=self.name
        )
        self.assertEquals(frequency.name, self.name)
