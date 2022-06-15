"""Link admin."""
from django.contrib import admin

from geosight.data.models.link import Link


class LinkAdmin(admin.ModelAdmin):
    """Link admin."""

    list_display = ('url', 'name', 'is_public', 'order')
    list_editable = ('order', 'is_public')


admin.site.register(Link, LinkAdmin)
