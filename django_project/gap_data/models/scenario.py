"""Scenario model."""
from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _

from core.models import AbstractTerm
from gap_data.models.instance import Instance


class ScenarioLevel(AbstractTerm):
    """The level of scenario."""

    instance = models.ForeignKey(
        Instance,
        on_delete=models.CASCADE
    )
    level = models.IntegerField(
        unique=True,
    )
    text_color = models.CharField(
        max_length=16,
        null=True, blank=True,
        help_text=_(
            'Put the hex color with # (e.g. #ffffff) '
            'or put the text of color. (e.g. blue)')
    )
    background_color = models.CharField(
        max_length=16,
        null=True, blank=True,
        help_text=_(
            'Put the hex color with # (e.g. #ffffff) '
            'or put the text of color. (e.g. blue)')
    )

    def __str__(self):
        return f'{self.instance} - {self.name} - {self.level}'

    class Meta:  # noqa: D106
        ordering = ('level',)

    @property
    def element(self):
        """Return element of the scenario."""
        return (
            f'<span class="scenario-level" style="color:{self.text_color}; '
            f'background-color: {self.background_color}">'
            f'Scenario {self.level} - {self.name}'
            f'</span>'
        )
