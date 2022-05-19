"""Test for Indicator detail api."""
from django.test import Client
from django.test.testcases import TestCase
from django.urls import reverse

from gap_data.models.indicator import Indicator
from gap_data.tests.model_factories import (
    IndicatorF, IndicatorGroupF, UserF
)


class IndicatorDetailApiTest(TestCase):
    """Test for Indicator detail api."""

    def setUp(self):
        """To setup test."""
        name = 'Indicator 1'
        group = IndicatorGroupF()
        self.indicator = IndicatorF(
            name=name,
            group=group
        )
        self.url = reverse(
            'indicator-detail-api', kwargs={
                'pk': self.indicator.pk
            }
        )

    def test_delete_indicator_view_no_login(self):
        """Test delete indicator with no login."""
        client = Client()
        response = client.delete(self.url)
        self.assertEquals(response.status_code, 403)

    def test_delete_indicator_view_not_staff(self):
        """Test delete indicator with as non staff."""
        username = 'test'
        password = 'testpassword'
        UserF(username=username, password=password, is_superuser=False)
        client = Client()
        client.login(username=username, password=password)
        response = client.delete(self.url)
        self.assertEquals(response.status_code, 403)

    def test_delete_indicator_view_staff(self):
        """Test delete indicator with as staff."""
        username = 'admin'
        password = 'adminpassword'
        UserF(username=username, password=password, is_superuser=True)
        client = Client()
        client.login(username=username, password=password)
        response = client.delete(self.url)
        self.assertEquals(response.status_code, 200)
        self.assertFalse(Indicator.objects.filter(
            pk=self.indicator.pk).first()
                         )
