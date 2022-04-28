"""Instance serializer."""
from rest_framework import serializers

from gap_data.models.instance import Instance


class InstanceSerializer(serializers.ModelSerializer):
    """Serializer for Instance."""

    class Meta:  # noqa: D106
        model = Instance
        fields = '__all__'
