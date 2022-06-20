"""Context layer models."""
from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _

from core.models import AbstractTerm


class LayerType(object):
    """A quick couple of variable and Layer Type string."""

    ARCGIS = 'ARCGIS'
    GEOJSON = 'Geojson'
    RASTER_TILE = 'Raster Tile'


class ContextLayerGroup(AbstractTerm):
    """A model for the group of context layer."""

    group = models.ForeignKey(
        "self",
        null=True, blank=True,
        on_delete=models.SET_NULL
    )

    def __str__(self):
        if self.group:
            return self.name + '/' + self.group.__str__()
        else:
            return self.name


class ContextLayer(AbstractTerm):
    """A model for the context layer."""

    group = models.ForeignKey(
        ContextLayerGroup,
        null=True, blank=True,
        on_delete=models.SET_NULL
    )
    url = models.CharField(
        max_length=512,
        help_text=(
            "Can put full url with parameters and system will use that. "
            "Or system will use 'CONTEXT LAYER PARAMETERS' "
            "if there is no parameters on the url."
        )
    )
    url_legend = models.CharField(
        max_length=256,
        null=True, blank=True
    )
    layer_type = models.CharField(
        max_length=256,
        default=LayerType.ARCGIS,
        choices=(
            (LayerType.ARCGIS, LayerType.ARCGIS),
            (LayerType.GEOJSON, LayerType.GEOJSON),
            (LayerType.RASTER_TILE, LayerType.RASTER_TILE),
        )
    )
    token = models.CharField(
        max_length=512,
        null=True, blank=True,
        help_text=_(
            "Token to access the layer"
        )
    )
    username = models.CharField(
        max_length=512,
        null=True, blank=True,
        help_text=_(
            "Username to access the layer"
        )
    )
    password = models.CharField(
        max_length=512,
        null=True, blank=True,
        help_text=_(
            "Password to access the layer"
        )
    )


class ContextLayerStyle(models.Model):
    """Overridden style of leaflet."""

    context_layer = models.ForeignKey(
        ContextLayer, on_delete=models.CASCADE
    )
    name = models.CharField(
        max_length=128,
        help_text=_(
            "The name of style"
        )
    )
    value = models.CharField(
        max_length=1024,
        null=True, blank=True,
        help_text=_(
            "The value of style"
        )
    )
    icon = models.FileField(
        null=True, blank=True,
        help_text=_(
            "The icon of the style"
        )
    )

    class Meta:  # noqa: D106
        unique_together = ('context_layer', 'name')

    def __str__(self):
        return f'{self.name}'
