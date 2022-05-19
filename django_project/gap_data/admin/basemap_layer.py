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

    list_display = ('name', 'url', 'icon')
    inlines = (BasemapLayerParameterInline,)


admin.site.register(BasemapLayer, BasemapLayerAdmin)
