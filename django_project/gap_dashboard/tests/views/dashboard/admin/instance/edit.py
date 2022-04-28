from django.contrib.auth import get_user_model
from django.test import Client
from django.test.testcases import TestCase
from django.urls import reverse

from gap_data.models.instance import Instance
from gap_data.tests.model_factories import InstanceF, UserF

User = get_user_model()


class InstanceEditTest(TestCase):
    """ Test create instance"""

    def setUp(self):
        # TODO:
        #  We need to fix this to have it's own page
        instance = InstanceF()
        self.url = reverse(
            'instance-management-edit', kwargs={
                'slug': instance.slug
            }
        )
        self.data = {
            'name': 'Instance 1'
        }

    def test_save_level_no_login(self):
        client = Client()
        response = client.post(self.url, data=self.data)
        self.assertEquals(response.status_code, 302)

    def test_save_level_not_staff(self):
        username = 'test'
        password = 'testpassword'
        UserF(username=username, password=password, is_superuser=False)
        client = Client()
        client.login(username=username, password=password)
        response = client.post(self.url, data=self.data)
        self.assertEquals(response.status_code, 302)

    def test_save_level_staff(self):
        username = 'admin'
        password = 'adminpassword'
        UserF(username=username, password=password, is_superuser=True)
        client = Client()
        client.login(username=username, password=password)
        response = client.post(self.url, data=self.data)
        self.assertEquals(response.status_code, 302)
        self.assertTrue(
            Instance.objects.filter(name=self.data['name']).first()
        )
