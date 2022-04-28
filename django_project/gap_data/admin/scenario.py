from django.contrib import admin

from gap_data.models.scenario import ScenarioLevel


class ScenarioLevelAdmin(admin.ModelAdmin):
    list_display = ('level', 'name', 'instance', 'background_color')
    list_filter = ('instance',)


admin.site.register(ScenarioLevel, ScenarioLevelAdmin)
