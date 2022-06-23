"""Core admin."""
from django.contrib import admin

from core.models import SitePreferences


class SitePreferencesAdmin(admin.ModelAdmin):
    """Site Preferences admin."""

    fieldsets = (
        (None, {
            'fields': ('site_title',)
        }),
        ('GeoRepo', {
            'fields': ('georepo_url', 'georepo_api_key'),
        }),
        ('Theme', {
            'fields': ('primary_color', 'icon', 'favicon'),
        }),
    )


admin.site.register(SitePreferences, SitePreferencesAdmin)
