"""Attributes of indicator."""
from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _

from core.models import AbstractTerm

frequency_help_text = _(
    'Frequency in days. '
    'This is used by harvester as a frequency to get new indicator data.'
)


class IndicatorFrequency(AbstractTerm):
    """The frequency of data for the indicator.

    It is used to check if the data is expired from last data
    And it will auto fetch the data.
    """

    frequency = models.IntegerField(
        help_text=frequency_help_text
    )

    class Meta:  # noqa: D106
        verbose_name_plural = 'indicator frequencies'


class IndicatorGroup(AbstractTerm):
    """The group of indicator. """

    dashboard_link = models.CharField(
        max_length=1024,
        null=True, blank=True,
        help_text='Dashboard link of the indicator group.'
    )
