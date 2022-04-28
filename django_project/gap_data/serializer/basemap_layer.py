import urllib.parse

from rest_framework import serializers

from gap_data.models.basemap_layer import (
    BasemapLayerParameter, BasemapLayer
)


class BasemapLayerSerializer(serializers.ModelSerializer):
    parameters = serializers.SerializerMethodField()

    def get_parameters(self, obj: BasemapLayer):
        parameters = {}
        for parameter in obj.basemaplayerparameter_set.all():
            value = parameter.value
            try:
                if value is None:
                    value = ''
                value = int(parameter.value)
            except (ValueError, TypeError):
                if parameter.name.lower() != 'layers'.lower():
                    value = urllib.parse.quote(value)
            parameters[parameter.name] = value
        return parameters

    class Meta:
        model = BasemapLayer
        fields = '__all__'


class BasemapLayerParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = BasemapLayerParameter
        fields = '__all__'
