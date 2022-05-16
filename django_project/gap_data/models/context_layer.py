"""Context layer models."""
from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _
from core.models import AbstractTerm
from gap_data.models.instance import Instance


class LayerType(object):
    """A quick couple of variable and Layer Type string."""

    ARCGIS = 'ARCGIS'
    GEOJSON = 'Geojson'
    RASTER_TILE = 'Raster Tile'


class ContextLayerGroup(AbstractTerm):
    """A model for the group of context layer."""

    order = models.IntegerField(
        default=0
    )

    class Meta:  # noqa: D106
        ordering = ('name',)


class ContextLayer(AbstractTerm):
    """A model for the context layer."""

    instance = models.ForeignKey(
        Instance,
        null=True, blank=True,
        on_delete=models.CASCADE,
        help_text="Make this empty to be used by every instance."
    )
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
    show_on_map = models.BooleanField(
        default=True
    )
    enable_by_default = models.BooleanField(
        default=False
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
    order = models.IntegerField(
        default=0
    )

    class Meta:  # noqa: D106
        ordering = ('order',)

    def save(self, *args, **kwargs):
        """Save model."""
        if not self.order:
            self.order = ContextLayer.objects.count()
        super(ContextLayer, self).save(*args, **kwargs)


class ContextLayerParameter(models.Model):
    """Additional parameter for context layer."""

    context_layer = models.ForeignKey(
        ContextLayer, on_delete=models.CASCADE
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
        unique_together = ('context_layer', 'name')

    def __str__(self):
        return f'{self.name}'


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
