"""Basemap layer admin."""
from django.contrib import admin

from gap_data.models.basemap_layer import (
    BasemapLayer, BasemapLayerParameter
)


class BasemapLayerParameterInline(admin.TabularInline):
    """BasemapLayerParameter inline."""

    model = BasemapLayerParameter
    extra = 0


class BasemapLayerAdmin(admin.ModelAdmin):
    """BasemapLayer admin."""

    list_display = (
        'name', 'url', 'icon', 'show_on_map', 'enable_by_default', 'instance'
    )
    inlines = (BasemapLayerParameterInline,)
    list_editable = ('show_on_map', 'enable_by_default')


admin.site.register(BasemapLayer, BasemapLayerAdmin)
