"""Serializer for ScenarioLevel."""
from rest_framework import serializers

from gap_data.models.scenario import ScenarioLevel


class ScenarioLevelSerializer(serializers.ModelSerializer):
    """Serializer for ScenarioLevel."""

    class Meta:  # noqa: D106
        model = ScenarioLevel
        fields = '__all__'
