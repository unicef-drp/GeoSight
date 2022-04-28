from datetime import date

from django.contrib.auth import get_user_model
from django.test import Client
from django.test.testcases import TestCase
from django.urls import reverse

from gap_data.tests.model_factories import (
    GeometryF, InstanceF, GeometryLevelNameF
)

User = get_user_model()


class GeometryAPITest(TestCase):
    """ Test API for Geometry """

    def setUp(self):
        self.instance = InstanceF(name='instance')
        self.country_level = GeometryLevelNameF(name='country')
        self.district_level = GeometryLevelNameF(name='district')
        self.province_1 = GeometryF(
            geometry_level=self.country_level, instance=self.instance,
            active_date_from='2000-01-01')
        self.province_2 = GeometryF(
            geometry_level=self.country_level, instance=self.instance,
            active_date_from='2000-01-01')

        # create old data
        self.province_3 = GeometryF(
            geometry_level=self.country_level, instance=self.instance,
            active_date_from='1900-01-01', active_date_to='1900-12-31')
        self.province_4 = GeometryF(
            geometry_level=self.country_level, instance=self.instance,
            active_date_from='1900-01-01', active_date_to='1900-10-31')
        self.province_5 = GeometryF(
            geometry_level=self.country_level, instance=self.instance,
            active_date_from='1900-01-01', active_date_to='1900-10-31')
        self.province_6 = GeometryF(
            geometry_level=self.country_level, instance=self.instance,
            active_date_from='1900-01-01', active_date_to='1900-10-31')

        # create district
        self.district_1_1 = GeometryF(
            geometry_level=self.district_level, instance=self.instance,
            child_of=self.province_1)
        self.district_1_2 = GeometryF(
            geometry_level=self.district_level, instance=self.instance,
            child_of=self.province_1)
        self.district_2_1 = GeometryF(
            geometry_level=self.district_level, instance=self.instance,
            child_of=self.province_2)

    def test_instance_not_found(self):
        """
        Test if instance not found
        """
        client = Client()
        response = client.get(
            reverse('geometry-geojson-api', kwargs={
                'slug': 'test',
                'geometry_level': self.country_level.name,
                'date': date.today().strftime('%Y-%m-%d')
            })
        )
        self.assertEquals(response.status_code, 404)

    def test_get_country_geojson(self):
        """
        Test get geojson of country
        """
        client = Client()
        response = client.get(
            reverse('geometry-geojson-api', kwargs={
                'slug': self.instance.slug,
                'geometry_level': self.country_level.name,
                'date': date.today().strftime('%Y-%m-%d')
            })
        )
        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(response.data['features']), 2)

    def test_get_country_geojson_date_1(self):
        """
        Test get geojson of country on date 1900-10-01
        """
        client = Client()
        response = client.get(
            reverse('geometry-geojson-api', kwargs={
                'slug': self.instance.slug,
                'geometry_level': self.country_level.name,
                'date': '1900-10-01'
            })
        )
        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(response.data['features']), 4)

    def test_get_country_geojson_date_2(self):
        """
        Test get geojson of country on date 1900-12-01
        """
        client = Client()
        response = client.get(
            reverse('geometry-geojson-api', kwargs={
                'slug': self.instance.slug,
                'geometry_level': self.country_level.name,
                'date': '1900-12-01'
            })
        )
        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(response.data['features']), 1)

    def test_get_district_geojson(self):
        """
        Test get district of country
        """
        client = Client()
        response = client.get(
            reverse('geometry-geojson-api', kwargs={
                'slug': self.instance.slug,
                'geometry_level': self.district_level.name,
                'date': date.today().strftime('%Y-%m-%d')
            })
        )
        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(response.data['features']), 3)
