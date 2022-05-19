"""Indicator admin."""
from django.contrib import admin

from gap_data.models.indicator import (
    Indicator, IndicatorGroup, IndicatorFrequency,
    IndicatorValue, IndicatorScenarioRule, IndicatorExtraValue
)


class IndicatorValueAdmin(admin.ModelAdmin):
    """IndicatorValue admin."""

    class IndicatorExtraValueRuleInline(admin.TabularInline):
        """IndicatorExtraValue inline."""

        model = IndicatorExtraValue
        extra = 0

    list_display = ('indicator', 'date', 'geometry', 'value')
    list_filter = ('indicator', 'date', 'geometry')
    search_fields = ('indicator',)
    inlines = (IndicatorExtraValueRuleInline,)


class IndicatorFrequencyAdmin(admin.ModelAdmin):
    """IndicatorFrequencyAdmin admin."""

    list_display = ('name', 'frequency')


class IndicatorAdmin(admin.ModelAdmin):
    """Indicator admin."""

    class IndicatorScenarioRuleInline(admin.TabularInline):
        """IndicatorScenarioRule inline."""

        model = IndicatorScenarioRule
        extra = 0

    list_display = (
        'name', 'group', 'frequency', 'show_in_context_analysis',
        'geometry_reporting_level', 'access_level', 'order')
    filter_horizontal = ('geometry_reporting_units',)
    list_editable = ('show_in_context_analysis', 'access_level', 'order')
    list_filter = ('group', 'show_in_context_analysis', 'access_level')
    inlines = (IndicatorScenarioRuleInline,)


class IndicatorGroupAdmin(admin.ModelAdmin):
    """IndicatorGroup admin."""

    list_display = ('name',)


admin.site.register(IndicatorGroup, IndicatorGroupAdmin)
admin.site.register(IndicatorFrequency, IndicatorFrequencyAdmin)
admin.site.register(IndicatorValue, IndicatorValueAdmin)
admin.site.register(Indicator, IndicatorAdmin)
