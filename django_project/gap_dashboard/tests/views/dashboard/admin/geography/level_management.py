import json
from django.contrib.auth import get_user_model
from django.test import Client
from django.test.testcases import TestCase
from django.urls import reverse
from gap_data.tests.model_factories import (
    InstanceF, GeometryLevelNameF, UserF
)

User = get_user_model()


class LevelManagementTest(TestCase):
    """ Test Level management of geometry """

    def setUp(self):
        self.instance = InstanceF(name='instance')
        self.level_1 = GeometryLevelNameF(name='level_1')
        self.level_2 = GeometryLevelNameF(name='level_2')
        self.level_1_1 = GeometryLevelNameF(name='level_1_1')
        self.level_1_1_1 = GeometryLevelNameF(name='level_1_1_1')
        self.level_2_1 = GeometryLevelNameF(name='level_2_1')
        self.url = reverse(
            'geography-level-management-view', kwargs={
                'slug': self.instance.slug
            }
        )
        self.levels = {
            self.level_1.pk: {
                self.level_1_1.pk: {
                    self.level_1_1_1.pk: {}
                },
            },
            self.level_2.pk: {
                self.level_2_1.pk: {},
            }
        }

    def test_save_level_no_login(self):
        client = Client()
        response = client.post(self.url, data={
            'levels': json.dumps(self.levels)
        })
        self.assertEquals(response.status_code, 302)

    def test_save_level_not_staff(self):
        username = 'test'
        password = 'testpassword'
        UserF(username=username, password=password, is_superuser=False)
        client = Client()
        client.login(username=username, password=password)
        response = client.post(self.url, data={
            'levels': json.dumps(self.levels)
        })
        self.assertEquals(response.status_code, 302)

    def test_save_level_staff(self):
        username = 'admin'
        password = 'adminpassword'
        UserF(username=username, password=password, is_superuser=True)
        client = Client()
        client.login(username=username, password=password)
        response = client.post(self.url, data={
            'levels': json.dumps(self.levels)
        })
        self.assertEquals(response.status_code, 302)
        self.assertEqual(self.instance.geometry_levels_in_tree, self.levels)
