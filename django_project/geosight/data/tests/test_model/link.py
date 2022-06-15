"""Test for Link model."""
from django.test.testcases import TestCase

from geosight.data.tests.model_factories import LinkF


class LinkTest(TestCase):
    """Test for Link model."""

    def setUp(self):
        """To setup test."""
        self.name = 'Link1'

    def test_create(self):
        """Test create."""
        link = LinkF(
            name=self.name
        )
        self.assertEquals(link.name, self.name)
