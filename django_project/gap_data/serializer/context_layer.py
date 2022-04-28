import urllib.parse

from rest_framework import serializers

from gap_data.models.context_layer import (
    ContextLayer, ContextLayerParameter, ContextLayerStyle
)


class ContextLayerSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    parameters = serializers.SerializerMethodField()
    style = serializers.SerializerMethodField()
    group_name = serializers.SerializerMethodField()

    def get_url(self, obj: ContextLayer):
        return urllib.parse.unquote(obj.url)

    def get_parameters(self, obj: ContextLayer):
        parameters = {}
        for parameter in obj.contextlayerparameter_set.all():
            value = parameter.value
            try:
                if value is None:
                    value = ''
                value = int(parameter.value)
            except (ValueError, TypeError):
                value = urllib.parse.quote(value)
            parameters[parameter.name] = value
        return parameters

    def get_style(self, obj: ContextLayer):
        style = {}
        for contextlayerstyle in obj.contextlayerstyle_set.all():
            value = contextlayerstyle.value if contextlayerstyle.value else None
            if not value:
                value = contextlayerstyle.icon.url if contextlayerstyle.icon else None
            style[contextlayerstyle.name] = value
        return style

    def get_group_name(self, obj: ContextLayer):
        return obj.group.name if obj.group else ''

    class Meta:
        model = ContextLayer
        fields = '__all__'


class ContextLayerParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContextLayerParameter
        fields = '__all__'


class ContextLayerStyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContextLayerStyle
        fields = '__all__'
