"""Basemap layer admin."""
from django.contrib import admin

from gap_data.models.dashboard import (
    Dashboard, Plugin
)


class PluginInline(admin.StackedInline):
    """Plugin inline."""

    model = Plugin
    extra = 0


class DashboardAdmin(admin.ModelAdmin):
    """Dashboard admin."""

    list_display = (
        'slug', 'name',
    )
    filter_horizontal = (
        'reference_layers', 'basemap_layers', 'context_layers'
    )
    inlines = (PluginInline,)
    prepopulated_fields = {'slug': ('name',)}


admin.site.register(Dashboard, DashboardAdmin)
