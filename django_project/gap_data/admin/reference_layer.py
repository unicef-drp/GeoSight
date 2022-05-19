"""Geometry admin."""
from django.contrib import admin

from gap_data.models.reference_layer import (
    Geometry, GeometryLevelName
)


class GeometryAdmin(admin.ModelAdmin):
    """Geometry admin."""

    list_display = (
        'identifier', 'name',
        'geometry_level', 'child_of'
    )
    list_filter = ('geometry_level', 'child_of')


admin.site.register(GeometryLevelName, admin.ModelAdmin)
admin.site.register(Geometry, GeometryAdmin)
