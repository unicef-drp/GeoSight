"""COntext layer Admin."""
from django.contrib import admin

from gap_data.models.context_layer import (
    ContextLayerGroup, ContextLayer, ContextLayerStyle
)


class ContextLayerStyleInline(admin.TabularInline):
    """ContextLayerStyle inline."""

    model = ContextLayerStyle
    extra = 0


class ContextLayerAdmin(admin.ModelAdmin):
    """ContextLayer admin."""

    list_display = (
        'name', 'layer_type', 'group', 'url'
    )
    inlines = (ContextLayerStyleInline,)
    list_filter = ('group',)


class ContextLayerGroupAdmin(admin.ModelAdmin):
    """ContextLayerGroup admin."""

    list_display = ('name',)


admin.site.register(ContextLayerGroup, ContextLayerGroupAdmin)
admin.site.register(ContextLayer, ContextLayerAdmin)
