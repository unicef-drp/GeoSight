"""Serializer for geometry."""
from django.shortcuts import reverse
from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from geosight.data.models.reference_layer import (
    Geometry, ReferenceLayer, ReferenceLayerLevel
)


class ReferenceLayerLevelSerializer(serializers.ModelSerializer):
    """Serializer for ReferenceLayerLevel."""

    level_name = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    def get_level_name(self, obj: ReferenceLayerLevel):
        """Return level_name."""
        return obj.level_name.name

    def get_url(self, obj: ReferenceLayerLevel):
        """Return url."""
        return reverse(
            'reference-layer-api',
            args=[obj.reference_layer.identifier, obj.level_name.name]
        )

    class Meta:  # noqa: D106
        model = ReferenceLayerLevel
        exclude = ('id', 'reference_layer')


class ReferenceLayerSerializer(serializers.ModelSerializer):
    """Serializer for ReferenceLayer."""

    levels = serializers.SerializerMethodField()

    def get_levels(self, obj: ReferenceLayer):
        """Return levels."""
        return ReferenceLayerLevelSerializer(
            obj.referencelayerlevel_set.order_by('-level'), many=True
        ).data

    class Meta:  # noqa: D106
        model = ReferenceLayer
        exclude = ('geometries',)


class GeometrySerializer(GeoFeatureModelSerializer):
    """Serializer for GeometryContext."""

    child_of = serializers.SerializerMethodField()
    level_name = serializers.SerializerMethodField()

    def get_child_of(self, obj: Geometry):
        """Return child_of."""
        return obj.child_of.id if obj.child_of else 'null'

    def get_level_name(self, obj: Geometry):
        """Return geometry_level_name."""
        return obj.geometry_level.name

    class Meta:  # noqa: D106
        model = Geometry
        geo_field = 'geometry'
        exclude = ('geometry_level',)
