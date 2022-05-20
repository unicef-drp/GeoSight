"""Basemap layer admin."""
from django.contrib import admin

from gap_data.models.dashboard import (
    Dashboard, Widget
)


class WidgetInline(admin.StackedInline):
    """Widget inline."""

    model = Widget
    extra = 0


class DashboardAdmin(admin.ModelAdmin):
    """Dashboard admin."""

    list_display = ('slug', 'name',)
    filter_horizontal = (
        'basemap_layers', 'context_layers', 'indicators'
    )
    inlines = (WidgetInline,)
    prepopulated_fields = {'slug': ('name',)}


admin.site.register(Dashboard, DashboardAdmin)
