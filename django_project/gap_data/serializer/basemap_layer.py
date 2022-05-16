"""Serializer for Basemap Layer."""

from rest_framework import serializers

from gap_data.models.basemap_layer import (
    BasemapLayerParameter, BasemapLayer
)


class BasemapLayerSerializer(serializers.ModelSerializer):
    """Serializer for BasemapLayer."""

    parameters = serializers.SerializerMethodField()

    def get_parameters(self, obj: BasemapLayer):
        """Return parameters."""
        parameters = {}
        for parameter in obj.basemaplayerparameter_set.all():
            value = parameter.value
            parameters[parameter.name] = value
        return parameters

    class Meta:  # noqa: D106
        model = BasemapLayer
        fields = '__all__'


class BasemapLayerParameterSerializer(serializers.ModelSerializer):
    """Serializer for BasemapLayerParameter."""

    class Meta:  # noqa: D106
        model = BasemapLayerParameter
        fields = '__all__'
