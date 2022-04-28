from django.contrib import admin

from gap_data.models.context_layer import (
    ContextLayerGroup, ContextLayer, ContextLayerParameter, ContextLayerStyle
)


class ContextLayerParameterInline(admin.TabularInline):
    model = ContextLayerParameter
    extra = 0


class ContextLayerStyleInline(admin.TabularInline):
    model = ContextLayerStyle
    extra = 0


class ContextLayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'group', 'show_on_map', 'enable_by_default', 'order', 'instance', 'url')
    inlines = (ContextLayerParameterInline, ContextLayerStyleInline)
    list_filter = ('instance', 'group')
    list_editable = ('show_on_map', 'enable_by_default', 'order')


class ContextLayerGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'order')
    list_editable = ('order',)


admin.site.register(ContextLayerGroup, ContextLayerGroupAdmin)
admin.site.register(ContextLayer, ContextLayerAdmin)
