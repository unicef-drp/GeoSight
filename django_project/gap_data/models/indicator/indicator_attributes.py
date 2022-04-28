from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _

from core.models import AbstractTerm
from gap_data.models.instance import Instance

frequency_help_text = _(
    'Frequency in days. '
    'This is used by harvester as a frequency to get new indicator data.'
)


class IndicatorFrequency(AbstractTerm):
    """
    The frequency of data for the indicator
    """
    frequency = models.IntegerField(
        help_text=frequency_help_text
    )

    class Meta:
        verbose_name_plural = 'indicator frequencies'


class IndicatorGroup(AbstractTerm):
    """
    The group of indicator
    It is linked with the instance
    """
    instance = models.ForeignKey(
        Instance,
        on_delete=models.CASCADE
    )

    # dashboard link
    dashboard_link = models.CharField(
        max_length=1024,
        null=True, blank=True,
        help_text='Dashboard link of the indicator group.'
    )
