"""Test API for Indicator Values."""
from django.contrib.auth import get_user_model
from django.test import Client
from django.test.testcases import TestCase
from django.urls import reverse

from gap_data.models.indicator.indicator import Indicator
from gap_data.tests.model_factories import (
    InstanceF, IndicatorGroupF, IndicatorF,
    GeometryF, IndicatorValueF, GeometryLevelNameF,
    GeometryLevelInstanceF, UserF
)

User = get_user_model()


class IndicatorValuesAPITest(TestCase):
    """Test API for Indicator Values."""

    def setUp(self):
        """To setup test."""
        self.instance = InstanceF(name='instance')
        self.group = IndicatorGroupF(name='group', instance=self.instance)

        # init value
        self.level = GeometryLevelNameF(name='country')
        self.indicator_1 = IndicatorF(
            group=self.group, geometry_reporting_level=self.level
        )
        self.indicator_2 = IndicatorF(
            group=self.group,
            geometry_reporting_level=self.level
        )

        self.indicator_3 = IndicatorF(
            group=self.group,
            geometry_reporting_level=self.level
        )

        GeometryLevelInstanceF(instance=self.instance, level=self.level)
        self.geometry_country_1 = GeometryF(
            instance=self.instance,
            geometry_level=self.level
        )
        self.geometry_country_2 = GeometryF(
            instance=self.instance,
            geometry_level=self.level
        )

        # init indicator value
        IndicatorValueF(
            indicator=self.indicator_1, geometry=self.geometry_country_1,
            value=1, date='2000-01-01'
        )
        IndicatorValueF(
            indicator=self.indicator_1, geometry=self.geometry_country_1,
            value=1, date='2000-01-02'
        )

        IndicatorValueF(
            indicator=self.indicator_1, geometry=self.geometry_country_2,
            value=1, date='2000-01-01'
        )
        IndicatorValueF(
            indicator=self.indicator_1, geometry=self.geometry_country_2,
            value=3, date='2000-01-02'
        )
        IndicatorValueF(
            indicator=self.indicator_1, geometry=self.geometry_country_2,
            value=3, date='2000-01-03'
        )

        IndicatorValueF(
            indicator=self.indicator_2, geometry=self.geometry_country_2,
            value=1, date='2000-01-01'
        )
        IndicatorValueF(
            indicator=self.indicator_2, geometry=self.geometry_country_2,
            value=3, date='2000-01-02'
        )
        IndicatorValueF(
            indicator=self.indicator_2, geometry=self.geometry_country_2,
            value=2, date='2000-01-03'
        )

        # user
        self.username = 'test'
        self.password = 'testpassword'
        self.user = UserF(
            username=self.username, password=self.password, is_superuser=True
        )

    def test_indicator_list_api(self):
        """Test indicator list by api."""
        instance = InstanceF(name='instance 2')
        group = IndicatorGroupF(name='group 2', instance=instance)
        IndicatorF(group=group)
        IndicatorF(group=group)

        client = Client()
        response = client.get(
            reverse('indicator-list-api', kwargs={
                'slug': self.instance.slug
            })
        )
        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(response.data), 3)

        # check in the new instance
        response = client.get(
            reverse('indicator-list-api', kwargs={
                'slug': instance.slug
            })
        )
        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(response.data), 2)

    def test_indicator_values_by_geometry(self):
        """Test IndicatorValuesByGeometry API."""
        client = Client()
        response = client.get(
            reverse('indicator-values-by-geometry', kwargs={
                'slug': self.instance.slug,
                'pk': self.indicator_1.pk,
                'geometry_pk': self.geometry_country_1.pk,
            })
        )
        self.assertEquals(response.status_code, 403)

        client = Client()
        client.login(username=self.username, password=self.password)
        response = client.get(
            reverse('indicator-values-by-geometry', kwargs={
                'slug': self.instance.slug,
                'pk': self.indicator_1.pk,
                'geometry_pk': self.geometry_country_1.pk,
            })
        )
        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(response.data), 2)

        response = client.get(
            reverse('indicator-values-by-geometry', kwargs={
                'slug': self.instance.slug,
                'pk': self.indicator_2.pk,
                'geometry_pk': self.geometry_country_2.pk,
            })
        )
        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(response.data), 3)

        # post new data
        response = client.post(
            reverse('indicator-values-by-geometry', kwargs={
                'slug': self.instance.slug,
                'pk': self.indicator_2.pk,
                'geometry_pk': self.geometry_country_2.pk,
            }),
            data={
                'date': '2000-01-10',
                'value': 1
            }
        )
        self.assertEquals(response.status_code, 200)

        response = client.get(
            reverse('indicator-values-by-geometry', kwargs={
                'slug': self.instance.slug,
                'pk': self.indicator_2.pk,
                'geometry_pk': self.geometry_country_2.pk,
            })
        )
        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(response.data), 4)

    def test_indicator_values_by_date(self):
        """Test IndicatorValuesByGeometryAndLevel API."""
        client = Client()
        client.login(username=self.username, password=self.password)
        response = client.get(
            reverse('indicator-values-by-date-api', kwargs={
                'slug': self.instance.slug,
                'pk': self.indicator_1.pk,
                'geometry_identifier': self.geometry_country_1.identifier,
                'geometry_level': self.level.name,
                'date': '2000-01-01'
            })
        )
        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(response.data), 1)
        for data in response.data:
            self.assertEquals(data['value'], 1)

    def test_indicator_reporting_units(self):
        """Test IndicatorReportingUnits API."""
        client = Client()
        response = client.get(
            reverse('indicator-reporting-units-api', kwargs={
                'slug': self.instance.slug,
                'pk': self.indicator_1.pk
            })
        )
        self.assertEquals(response.status_code, 403)
        indicator = Indicator.objects.get(id=self.indicator_1.id)
        self.assertEquals(indicator.reporting_units.count(), 2)

        # check the reporting is 1
        client = Client()
        client.login(username=self.username, password=self.password)
        response = client.post(
            reverse('indicator-reporting-units-api', kwargs={
                'slug': self.instance.slug,
                'pk': self.indicator_1.pk
            }),
            data={
                "ids": str(self.geometry_country_1.id)
            }
        )
        self.assertEquals(response.status_code, 200)

        indicator = Indicator.objects.get(id=self.indicator_1.id)
        self.assertEquals(indicator.reporting_units.count(), 1)

        # check the reporting is 2
        client = Client()
        client.login(username=self.username, password=self.password)
        response = client.post(
            reverse('indicator-reporting-units-api', kwargs={
                'slug': self.instance.slug,
                'pk': self.indicator_1.pk
            }),
            data={
                "ids": ','.join(
                    [
                        str(self.geometry_country_1.id),
                        str(self.geometry_country_2.id)
                    ]
                )
            }
        )
        self.assertEquals(response.status_code, 200)

        indicator = Indicator.objects.get(id=self.indicator_1.id)
        self.assertEquals(indicator.reporting_units.count(), 2)
