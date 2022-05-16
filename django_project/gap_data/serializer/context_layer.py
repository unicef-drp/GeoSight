"""Context Layer serializer."""
import urllib.parse

from rest_framework import serializers

from gap_data.models.context_layer import (
    ContextLayer, ContextLayerParameter, ContextLayerStyle
)


class ContextLayerSerializer(serializers.ModelSerializer):
    """Serializer for ContextLayer."""

    url = serializers.SerializerMethodField()
    parameters = serializers.SerializerMethodField()
    style = serializers.SerializerMethodField()
    group_name = serializers.SerializerMethodField()

    def get_url(self, obj: ContextLayer):
        """Url."""
        return urllib.parse.unquote(obj.url.split('?')[0])

    def get_parameters(self, obj: ContextLayer):
        """Return parameters."""
        urls = obj.url.split('?')
        parameters = {}
        if len(urls) == 1:
            for parameter in obj.contextlayerparameter_set.all():
                value = parameter.value
                parameters[parameter.name] = value
        else:
            for param in urls[1].split('&'):
                params = param.split('=')
                if params[1].lower() != 'bbox':
                    parameters[params[0]] = params[1]
        return parameters

    def get_style(self, obj: ContextLayer):
        """Style."""
        style = {}
        for contextlayerstyle in obj.contextlayerstyle_set.all():
            value = contextlayerstyle.value if \
                contextlayerstyle.value else None
            if not value:
                value = contextlayerstyle.icon.url \
                    if contextlayerstyle.icon else None
            style[contextlayerstyle.name] = value
        return style

    def get_group_name(self, obj: ContextLayer):
        """Group name."""
        return obj.group.name if obj.group else ''

    class Meta:  # noqa: D106
        model = ContextLayer
        fields = '__all__'


class ContextLayerParameterSerializer(serializers.ModelSerializer):
    """Serializer for ContextLayerParameter."""

    class Meta:  # noqa: D106
        model = ContextLayerParameter
        fields = '__all__'


class ContextLayerStyleSerializer(serializers.ModelSerializer):
    """Serializer for ContextLayerStyle."""

    class Meta:  # noqa: D106
        model = ContextLayerStyle
        fields = '__all__'
