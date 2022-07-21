"""Harvester Log Serializer."""
from django.shortcuts import reverse
from rest_framework import serializers

from core.serializer.user import UserSerializer
from geosight.data.models.indicator import Indicator
from geosight.harvester.models.harvester import Harvester, UsingExposedAPI
from geosight.harvester.models.harvester_attribute import (
    HarvesterAttribute, HarvesterMappingValue
)
from geosight.harvester.models.harvester_log import HarvesterLog


class HarvesterSerializer(serializers.ModelSerializer):
    """Harvester Serializer."""

    name = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    def get_name(self, obj: Harvester):
        """Return name of html."""
        return obj.harvester_name

    def get_user(self, obj: Harvester):
        """Return user of html."""
        return UserSerializer(obj.user).data

    class Meta:  # noqa: D106
        model = Harvester
        fields = '__all__'


class HarvesterLogSerializer(serializers.ModelSerializer):
    """Harvester Log Serializer."""

    html_detail = serializers.SerializerMethodField()
    start_time = serializers.SerializerMethodField()
    api = serializers.SerializerMethodField()

    def get_html_detail(self, obj: HarvesterLog):
        """Return detail in html."""
        return obj.html_detail()

    def get_start_time(self, obj: HarvesterLog):
        """Return start_time in html."""
        return obj.start_time.strftime("%Y-%m-%d %H:%M:%S")

    def get_api(self, obj: HarvesterLog):
        """Return start_time in html."""
        return reverse('harvester-log-api', args=[obj.id])

    class Meta:  # noqa: D106
        model = HarvesterLog
        fields = '__all__'


class HarvesterAttributeSerializer(serializers.ModelSerializer):
    """HarvesterAttribute Serializer."""

    value = serializers.SerializerMethodField()

    def get_value(self, obj: HarvesterAttribute):
        """Return value of harvester."""
        try:
            if obj.name == 'API URL' and obj.harvester.harvester_class == \
                    UsingExposedAPI[0]:
                return reverse(
                    'indicator-upload-values-api',
                    args=[obj.harvester.indicator.id]
                )
        except Indicator.DoesNotExist:
            pass
        return obj.value

    class Meta:  # noqa: D106
        model = HarvesterAttribute
        exclude = ('harvester', 'id')


class HarvesterMappingValueSerializer(serializers.ModelSerializer):
    """HarvesterMappingValue Serializer."""

    class Meta:  # noqa: D106
        model = HarvesterMappingValue
        fields = '__all__'
