"""Harvester log model."""
import json

from django.contrib.gis.db import models
from django.template.loader import render_to_string
from django.utils.translation import ugettext_lazy as _

from core.models.preferences import SitePreferences
from gap_harvester.models.harvester import Harvester


class LogStatus(object):
    """Quick access for coupling variable with Log status string."""

    RUNNING = 'Running'
    ERROR = 'Error'
    DONE = 'Done'


class HarvesterLog(models.Model):
    """History of harvester."""

    harvester = models.ForeignKey(
        Harvester, on_delete=models.CASCADE
    )
    start_time = models.DateTimeField(
        auto_now_add=True,
        help_text=_(
            "This is when the harvester is started.")
    )
    end_time = models.DateTimeField(
        blank=True, null=True
    )
    status = models.CharField(
        max_length=100,
        choices=(
            (LogStatus.RUNNING, _(LogStatus.RUNNING)),
            (LogStatus.ERROR, _(LogStatus.ERROR)),
            (LogStatus.DONE, _(LogStatus.DONE)),
        ),
        default=LogStatus.RUNNING
    )
    note = models.TextField(
        blank=True, null=True
    )
    detail = models.TextField(
        blank=True, null=True,
        help_text=_(
            'The detail of the harvesters. '
            'Should be filled with array so can construct the data in array.'
        )
    )

    class Meta:  # noqa: D106
        ordering = ('-start_time',)

    def html_detail(self):
        """Return html string for the detail."""
        try:
            pref = SitePreferences.preferences()
            return render_to_string(
                'pages/harvester_log_detail.html', {
                    'table': json.loads(self.detail),
                    'color': pref.primary_color
                }
            )
        except (TypeError, ValueError):
            return ''
