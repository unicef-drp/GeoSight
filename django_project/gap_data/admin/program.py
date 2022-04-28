"""Program admin."""
from django.contrib import admin

from gap_data.models.program import (
    Program, ProgramInstance, ProgramIntervention
)


class ProgramInterventionInline(admin.TabularInline):
    """ProgramIntervention inline."""

    model = ProgramIntervention
    extra = 0


class ProgramAdmin(admin.ModelAdmin):
    """Program admin."""

    list_display = ('name', 'description', 'icon')


class ProgramInstanceAdmin(admin.ModelAdmin):
    """ProgramInstance admin."""

    list_display = ('instance', 'program')
    list_filter = ('instance',)
    inlines = (ProgramInterventionInline,)


admin.site.register(Program, ProgramAdmin)
admin.site.register(ProgramInstance, ProgramInstanceAdmin)
