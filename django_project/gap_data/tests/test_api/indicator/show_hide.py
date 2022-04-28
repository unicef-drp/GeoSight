from django.test import Client
from django.test.testcases import TestCase
from django.urls import reverse

from gap_data.models.indicator import Indicator
from gap_data.tests.model_factories import (
    IndicatorF, InstanceF, IndicatorGroupF, UserF
)


class IndicatorShowHideViewTest(TestCase):
    """ Test for Indicator show hide api"""

    def setUp(self):
        name = 'Indicator 1'
        instance = InstanceF()
        group = IndicatorGroupF(
            instance=instance
        )
        self.indicator = IndicatorF(
            name=name,
            group=group
        )
        self.show_url = reverse(
            'indicator-show-api', kwargs={
                'slug': instance.slug,
                'pk': self.indicator.pk
            }
        )
        self.hide_url = reverse(
            'indicator-hide-api', kwargs={
                'slug': instance.slug,
                'pk': self.indicator.pk
            }
        )

    def test_show_hide_no_login(self):
        client = Client()
        response = client.patch(self.show_url)
        self.assertEquals(response.status_code, 403)
        response = client.patch(self.hide_url)
        self.assertEquals(response.status_code, 403)

    def test_show_hide_not_staff(self):
        username = 'test'
        password = 'testpassword'
        UserF(username=username, password=password, is_superuser=False)
        client = Client()
        client.login(username=username, password=password)
        response = client.patch(self.show_url)
        self.assertEquals(response.status_code, 403)
        response = client.patch(self.hide_url)
        self.assertEquals(response.status_code, 403)

    def test_show_hide_staff(self):
        username = 'admin'
        password = 'adminpassword'
        UserF(username=username, password=password, is_superuser=True)
        client = Client()
        client.login(username=username, password=password)
        response = client.patch(self.hide_url)
        self.assertEquals(response.status_code, 200)
        self.assertTrue(
            Indicator.objects.filter(pk=self.indicator.pk).first()
        )
        self.assertFalse(
            Indicator.objects.filter(pk=self.indicator.pk).first().show_in_context_analysis
        )
        response = client.patch(self.show_url)
        self.assertEquals(response.status_code, 200)
        self.assertTrue(
            Indicator.objects.filter(pk=self.indicator.pk).first()
        )
        self.assertTrue(
            Indicator.objects.filter(pk=self.indicator.pk).first().show_in_context_analysis
        )
