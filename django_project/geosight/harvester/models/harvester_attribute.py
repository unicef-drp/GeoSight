"""Harvester Attributes model."""
from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _

from geosight.harvester.models.harvester import Harvester


class HarvesterAttribute(models.Model):
    """Additional attribute for harvester."""

    harvester = models.ForeignKey(
        Harvester, on_delete=models.CASCADE
    )
    name = models.CharField(
        max_length=256,
        help_text=_(
            "The name of attribute"
        )
    )
    value = models.CharField(
        max_length=512,
        blank=True, null=True,
        help_text=_(
            "The value of attribute"
        )
    )
    file = models.FileField(
        upload_to='harvester/attributes',
        null=True, blank=True
    )

    class Meta:  # noqa: D106
        unique_together = ('harvester', 'name')

    def __str__(self):
        """Return str."""
        return f'{self.name}'

    @property
    def human_name(self):
        """Return humann name."""
        return self.name.replace('_', ' ').capitalize()


class HarvesterMappingValue(models.Model):
    """Mapping value for the value from the remote to platform side."""

    harvester = models.ForeignKey(
        Harvester, on_delete=models.CASCADE
    )
    remote_value = models.CharField(
        max_length=512,
        help_text=_(
            "The original value from remote"
        )
    )
    platform_value = models.CharField(
        max_length=512,
        help_text=_(
            "The platform value"
        )
    )

    class Meta:  # noqa: D106
        unique_together = ('harvester', 'remote_value')

    def __str__(self):
        return f'{self.remote_value} to {self.platform_value}'
