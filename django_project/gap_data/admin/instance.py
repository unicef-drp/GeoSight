from django.contrib import admin

from gap_data.models.instance import Instance, InstanceCategory


class InstanceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'order')
    list_editable = ('order',)


class InstanceAdmin(admin.ModelAdmin):
    list_display = ('slug', 'name', 'icon', 'category')
    list_filter = ('category',)
    prepopulated_fields = {'slug': ('name',)}


admin.site.register(InstanceCategory, InstanceCategoryAdmin)
admin.site.register(Instance, InstanceAdmin)
