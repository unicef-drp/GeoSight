"""Basemap layer admin."""
from django.contrib import admin

from geosight.data.models.dashboard import (
    Dashboard, Widget,
    DashboardBasemap, DashboardIndicator, DashboardContextLayer
)


class WidgetInline(admin.StackedInline):
    """Widget inline."""

    model = Widget
    extra = 0


class DashboardBasemapInline(admin.TabularInline):
    """DashboardBasemap inline."""

    model = DashboardBasemap
    extra = 0


class DashboardIndicatorInline(admin.TabularInline):
    """DashboardIndicator inline."""

    model = DashboardIndicator
    extra = 0


class DashboardContextLayerInline(admin.TabularInline):
    """DashboardContextLayer inline."""

    model = DashboardContextLayer
    extra = 0


class DashboardAdmin(admin.ModelAdmin):
    """Dashboard admin."""

    list_display = ('slug', 'name', 'creator')
    filter_horizontal = (
        'basemap_layers', 'context_layers', 'indicators'
    )
    inlines = (
        DashboardBasemapInline, DashboardIndicatorInline,
        DashboardContextLayerInline, WidgetInline
    )
    prepopulated_fields = {'slug': ('name',)}


admin.site.register(Dashboard, DashboardAdmin)
