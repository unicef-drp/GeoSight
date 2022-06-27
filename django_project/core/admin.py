"""Core admin."""
from django.contrib import admin

from core.models import SitePreferences, SitePreferencesImage


class SitePreferencesImageInline(admin.TabularInline):
    """SitePreferencesImageTheme inline."""

    model = SitePreferencesImage
    extra = 0


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
    inlines = (SitePreferencesImageInline,)


admin.site.register(SitePreferences, SitePreferencesAdmin)
