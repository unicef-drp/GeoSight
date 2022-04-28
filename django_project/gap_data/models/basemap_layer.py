"""Basemap Layer model."""
from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _

from core.models import AbstractTerm, IconTerm
from gap_data.models.instance import Instance


class BasemapLayerType(object):
    """A quick couple of variable and Basemap Layer type."""

    XYZ_TILE = 'XYZ Tile'
    WMS = 'WMS'


class BasemapLayer(AbstractTerm, IconTerm):
    """Model of BasemapLayer."""

    instance = models.ForeignKey(
        Instance,
        null=True, blank=True,
        on_delete=models.CASCADE,
        help_text="Make this empty to be used by every instance."
    )
    url = models.CharField(
        max_length=256
    )
    type = models.CharField(
        max_length=256,
        default=BasemapLayerType.XYZ_TILE,
        choices=(
            (BasemapLayerType.XYZ_TILE, BasemapLayerType.XYZ_TILE),
            (BasemapLayerType.WMS, BasemapLayerType.WMS),
        )
    )
    show_on_map = models.BooleanField(
        default=True
    )
    enable_by_default = models.BooleanField(
        default=False
    )

    class Meta:  # noqa: D106
        ordering = ('name',)


class BasemapLayerParameter(models.Model):
    """Additional parameter for basemap layer."""

    basemap_layer = models.ForeignKey(
        BasemapLayer, on_delete=models.CASCADE
    )
    name = models.CharField(
        max_length=128,
        help_text=_(
            "The name of parameter"
        )
    )
    value = models.CharField(
        max_length=128,
        null=True, blank=True,
        help_text=_(
            "The value of parameter"
        )
    )

    class Meta:  # noqa: D106
        unique_together = ('basemap_layer', 'name')

    def __str__(self):
        return f'{self.name}'
