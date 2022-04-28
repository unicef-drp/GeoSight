from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from gap_data.models.geometry import Geometry


class GeometrySerializer(GeoFeatureModelSerializer):
    geometry_level_name = serializers.SerializerMethodField()

    def get_geometry_level_name(self, obj: Geometry):
        return obj.geometry_level.name

    class Meta:
        model = Geometry
        geo_field = 'geometry'
        fields = '__all__'


class GeometryContextSerializer(GeoFeatureModelSerializer):
    child_of = serializers.SerializerMethodField()
    active_date_to = serializers.SerializerMethodField()

    def get_child_of(self, obj: Geometry):
        return obj.child_of.id if obj.child_of else 'null'

    def get_active_date_to(self, obj: Geometry):
        return obj.active_date_to if obj.active_date_to else 'null'

    class Meta:
        model = Geometry
        geo_field = 'geometry'
        fields = '__all__'
