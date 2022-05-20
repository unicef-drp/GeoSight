"""Indicator admin."""
from django.contrib import admin

from gap_data.models.indicator import (
    Indicator, IndicatorGroup, IndicatorFrequency,
    IndicatorValue, IndicatorRule, IndicatorExtraValue
)


class IndicatorExtraValueRuleInline(admin.TabularInline):
    """IndicatorExtraValue inline."""

    model = IndicatorExtraValue
    extra = 0


class IndicatorValueAdmin(admin.ModelAdmin):
    """IndicatorValue admin."""

    list_display = ('indicator', 'date', 'geom_identifier', 'value')
    list_filter = ('indicator', 'date', 'geom_identifier')
    search_fields = ('indicator',)
    inlines = (IndicatorExtraValueRuleInline,)


class IndicatorFrequencyAdmin(admin.ModelAdmin):
    """IndicatorFrequencyAdmin admin."""

    list_display = ('name', 'frequency')


class IndicatorRuleInline(admin.TabularInline):
    """IndicatorRule inline."""

    model = IndicatorRule
    extra = 0


class IndicatorAdmin(admin.ModelAdmin):
    """Indicator admin."""

    list_display = ('name', 'group', 'frequency', 'reporting_level')
    list_filter = ('group',)
    inlines = (IndicatorRuleInline,)


class IndicatorGroupAdmin(admin.ModelAdmin):
    """IndicatorGroup admin."""

    list_display = ('name',)


admin.site.register(IndicatorGroup, IndicatorGroupAdmin)
admin.site.register(IndicatorFrequency, IndicatorFrequencyAdmin)
admin.site.register(IndicatorValue, IndicatorValueAdmin)
admin.site.register(Indicator, IndicatorAdmin)
