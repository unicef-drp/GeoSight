"""Geometry admin.

TODO:
 This will be moved to georepo
"""
from django.contrib import admin

from gap_data.models.reference_layer import (
    Geometry, GeometryLevelName, ReferenceLayer, ReferenceLayerLevel
)


class GeometryAdmin(admin.ModelAdmin):
    """Geometry admin."""

    list_display = ('identifier', 'name', 'geometry_level', 'child_of')
    list_filter = ('geometry_level', 'child_of')


class ReferenceLayerLevelInline(admin.TabularInline):
    """ReferenceLayerLevel inline."""

    model = ReferenceLayerLevel
    extra = 0


class ReferenceLayerAdmin(admin.ModelAdmin):
    """ReferenceLayer admin."""

    list_display = ('identifier', 'name', 'source')
    filter_horizontal = ('geometries',)
    inlines = (ReferenceLayerLevelInline,)


admin.site.register(GeometryLevelName, admin.ModelAdmin)
admin.site.register(Geometry, GeometryAdmin)
admin.site.register(ReferenceLayer, ReferenceLayerAdmin)
