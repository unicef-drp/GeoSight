import uuid

from django.contrib import admin
from django.shortcuts import reverse
from django.utils.html import mark_safe

from gap_harvester.models import (
    Harvester, HarvesterAttribute, HarvesterMappingValue, HarvesterLog
)


class HarvesterAttributeInline(admin.TabularInline):
    model = HarvesterAttribute
    fields = ('value', 'file')
    readonly_fields = ('name',)
    extra = 0

    def has_add_permission(self, request, obj=None):
        return False


class HarvesterMappingValueInline(admin.TabularInline):
    model = HarvesterMappingValue
    fields = ('remote_value', 'platform_value')
    extra = 1


def harvest_data(modeladmin, request, queryset):
    for harvester in queryset:
        harvester.run()


harvest_data.short_description = 'Run harvester'


def assign_uuid(modeladmin, request, queryset):
    for harvester in queryset:
        harvester.unique_id = uuid.uuid4()
        harvester.save()


assign_uuid.short_description = 'Reassign UUID'


class HarvesterAdmin(admin.ModelAdmin):
    actions = (harvest_data, assign_uuid)
    inlines = [HarvesterAttributeInline, HarvesterMappingValueInline]
    list_display = ('id', 'unique_id', '_indicator', 'harvester_class', 'active', 'is_finished', 'logs')
    list_filter = ('harvester_class',)
    list_editable = ('active',)
    search_fields = ('indicator__name',)

    def _indicator(self, object: Harvester):
        if object.indicator:
            return mark_safe(
                f'<a href="{reverse("admin:gap_data_indicator_change", args=[object.indicator.pk])}">{object.indicator.__str__()}</a>'
            )
        else:
            return '-'

    def is_finished(self, object: Harvester):
        if not object.is_run:
            return mark_safe('<img src="/static/admin/img/icon-yes.svg" alt="True">')
        else:
            return mark_safe('<img src="/static/admin/img/icon-no.svg" alt="True">')

    def logs(self, object: Harvester):
        return mark_safe(
            f'<a href="/admin/gap_harvester/harvesterlog/?harvester__id__exact={object.pk}">Logs</a>'
        )


admin.site.register(Harvester, HarvesterAdmin)


class HarvesterLogAdmin(admin.ModelAdmin):
    list_display = ('harvester', 'start_time', 'end_time', 'status', 'note')
    readonly_fields = ('harvester', 'start_time', 'end_time', 'status', 'note', 'detail')

    def has_add_permission(self, request, obj=None):
        return False


admin.site.register(HarvesterLog, HarvesterLogAdmin)
