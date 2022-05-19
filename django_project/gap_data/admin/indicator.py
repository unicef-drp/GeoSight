"""Indicator admin."""
from django.contrib import admin

from gap_data.models.indicator import (
    Indicator, IndicatorGroup, IndicatorFrequency,
    IndicatorValue, IndicatorRule, IndicatorExtraValue
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

    class IndicatorRuleInline(admin.TabularInline):
        """IndicatorRule inline."""

        model = IndicatorRule
        extra = 0

    list_display = (
        'name', 'group', 'frequency',
        'geometry_reporting_level')
    filter_horizontal = ('geometry_reporting_units',)
    list_filter = ('group',)
    inlines = (IndicatorRuleInline,)


class IndicatorGroupAdmin(admin.ModelAdmin):
    """IndicatorGroup admin."""

    list_display = ('name',)


admin.site.register(IndicatorGroup, IndicatorGroupAdmin)
admin.site.register(IndicatorFrequency, IndicatorFrequencyAdmin)
admin.site.register(IndicatorValue, IndicatorValueAdmin)
admin.site.register(Indicator, IndicatorAdmin)
