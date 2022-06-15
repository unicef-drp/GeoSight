"""Test for Harvester model."""
from django.test.testcases import TestCase

from geosight.data.tests.model_factories.indicator import IndicatorF
from geosight.harvester.models.harvester import ALL_HARVESTERS
from geosight.harvester.tests.model_factories import HarvesterF


class HarvesterTest(TestCase):
    """Test for Harvester model."""

    def test_create(self):
        """Test create."""
        for harvester_class in ALL_HARVESTERS:
            harvester = HarvesterF(
                indicator=IndicatorF(),
                harvester_class=harvester_class[0]
            )
            self.assertFalse(harvester.is_run)
            self.assertTrue(harvester.active)
            self.assertEqual(harvester.harvester_class, harvester_class[0])

            default_attr = list(
                harvester.get_harvester_class.additional_attributes().keys()
            )
            default_attr.sort()
            harvester_attr = list(
                harvester.harvesterattribute_set.values_list('name', flat=True)
            )
            harvester_attr.sort()
            self.assertEqual(default_attr, harvester_attr)
