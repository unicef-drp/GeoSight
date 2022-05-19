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
        urls = obj.url.split('?')
        parameters = {}

        for parameter in obj.basemaplayerparameter_set.all():
            value = parameter.value
            parameters[parameter.name] = value

        for param in urls[1].split('&'):
            params = param.split('=')
            if params[1].lower() != 'bbox':
                parameters[params[0]] = params[1]
        return parameters

    class Meta:  # noqa: D106
        model = BasemapLayer
        fields = '__all__'


class BasemapLayerParameterSerializer(serializers.ModelSerializer):
    """Serializer for BasemapLayerParameter."""

    class Meta:  # noqa: D106
        model = BasemapLayerParameter
        fields = '__all__'
