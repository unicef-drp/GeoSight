"""Dashboard model."""
from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _

from core.models.general import SlugTerm
from gap_data.models.basemap_layer import BasemapLayer
from gap_data.models.context_layer import ContextLayer
from gap_data.models.reference_layer import ReferenceLayer


class Dashboard(SlugTerm):
    """Dashboard model.

    One dashboard just contains one indicator.
    The instance is based on the indicator's.
    The administrative is based on the indicator's.

    Basemap layers and context layers is based on the indicator's instance.
    """

    # TODO:
    #  When recreate all migrations from zero
    #  Default it removed
    reference_layer = models.ForeignKey(
        ReferenceLayer,
        on_delete=models.CASCADE,
        blank=True, null=True
    )
    basemap_layers = models.ManyToManyField(
        BasemapLayer
    )
    context_layers = models.ManyToManyField(
        ContextLayer, blank=True
    )
    extent = models.PolygonField(
        blank=True, null=True,
        help_text=_(
            'Extent of the dashboard. If empty, it is the whole map'
        )
    )
