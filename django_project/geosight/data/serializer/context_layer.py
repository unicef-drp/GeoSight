"""Context Layer serializer."""
import urllib.parse

from rest_framework import serializers

from geosight.data.models.context_layer import ContextLayer, ContextLayerStyle


class ContextLayerSerializer(serializers.ModelSerializer):
    """Serializer for ContextLayer."""

    url = serializers.SerializerMethodField()
    parameters = serializers.SerializerMethodField()
    style = serializers.SerializerMethodField()
    group = serializers.SerializerMethodField()

    def get_url(self, obj: ContextLayer):
        """Url."""
        return urllib.parse.unquote(obj.url.split('?')[0])

    def get_parameters(self, obj: ContextLayer):
        """Return parameters."""
        urls = obj.url.split('?')
        parameters = {}
        if len(urls) > 1:
            for param in urls[1].split('&'):
                params = param.split('=')
                if params[0].lower() != 'bbox':
                    parameters[params[0]] = '='.join(params[1:])
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

    def get_group(self, obj: ContextLayer):
        """Group name."""
        if obj.group:
            groups = obj.group.group_tree_in_list
            groups.reverse()
            return '/'.join([group.name for group in groups])
        else:
            return ''

    class Meta:  # noqa: D106
        model = ContextLayer
        fields = '__all__'


class ContextLayerStyleSerializer(serializers.ModelSerializer):
    """Serializer for ContextLayerStyle."""

    class Meta:  # noqa: D106
        model = ContextLayerStyle
        fields = '__all__'
