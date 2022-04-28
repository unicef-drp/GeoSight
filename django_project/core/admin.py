from django.contrib import admin

from core.models import SitePreferences

admin.site.register(SitePreferences, admin.ModelAdmin)
