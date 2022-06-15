"""Harvester admin."""
import uuid

from django.contrib import admin
from django.shortcuts import reverse
from django.utils.html import mark_safe

from geosight.harvester.models import (
    Harvester, HarvesterAttribute, HarvesterMappingValue, HarvesterLog
)


class HarvesterAttributeInline(admin.TabularInline):
    """HarvesterAttribute inline."""

    model = HarvesterAttribute
    fields = ('value', 'file')
    readonly_fields = ('name',)
    extra = 0

    def has_add_permission(self, request, obj=None):
        """Has add permission."""
        return False


class HarvesterMappingValueInline(admin.TabularInline):
    """HarvesterMappingValue inline."""

    model = HarvesterMappingValue
    fields = ('remote_value', 'platform_value')
    extra = 1


def harvest_data(modeladmin, request, queryset):
    """Run harvesters."""
    for harvester in queryset:
        harvester.run()


harvest_data.short_description = 'Run harvester'


def assign_uuid(modeladmin, request, queryset):
    """Assign uuid to harvester."""
    for harvester in queryset:
        harvester.unique_id = uuid.uuid4()
        harvester.save()


assign_uuid.short_description = 'Reassign UUID'


class HarvesterAdmin(admin.ModelAdmin):
    """Harvester Admin."""

    actions = (harvest_data, assign_uuid)
    inlines = [HarvesterAttributeInline, HarvesterMappingValueInline]
    list_display = (
        'id', 'unique_id', '_indicator', 'harvester_class', 'active',
        'is_finished', 'logs')
    list_filter = ('harvester_class',)
    list_editable = ('active',)
    search_fields = ('indicator__name',)

    def _indicator(self, object: Harvester):
        """Return harvester's indicator."""
        if object.indicator:
            url = reverse(
                "admin:geosight.data_indicator_change",
                args=[object.indicator.pk]
            )
            return mark_safe(
                f'<a href="{url}">{object.indicator.__str__()}</a>'
            )
        else:
            return '-'

    def is_finished(self, object: Harvester):
        """Is harvester finished."""
        if not object.is_run:
            return mark_safe(
                '<img src="/static/admin/img/icon-yes.svg" alt="True">')
        else:
            return mark_safe(
                '<img src="/static/admin/img/icon-no.svg" alt="True">')

    def logs(self, object: Harvester):
        """Return logs."""
        return mark_safe(
            (
                f'<a href="/admin/geosight.harvester/harvesterlog/'
                f'?harvester__id__exact={object.pk}">Logs</a>'
            )
        )


admin.site.register(Harvester, HarvesterAdmin)


class HarvesterLogAdmin(admin.ModelAdmin):
    """Harvester Log Admin."""

    list_display = ('harvester', 'start_time', 'end_time', 'status', 'note')
    readonly_fields = (
        'harvester', 'start_time', 'end_time', 'status', 'note', 'detail')

    def has_add_permission(self, request, obj=None):
        """Has add permission."""
        return False


admin.site.register(HarvesterLog, HarvesterLogAdmin)
