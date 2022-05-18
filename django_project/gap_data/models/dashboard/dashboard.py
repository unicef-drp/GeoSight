"""Dashboard model."""
from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _

from core.models.general import SlugTerm
from gap_data.models.basemap_layer import BasemapLayer
from gap_data.models.context_layer import ContextLayer
from gap_data.models.geometry import Geometry
from gap_data.models.indicator import Indicator


class Dashboard(SlugTerm):
    """Dashboard model.

    One dashboard just contains one indicator.
    The instance is based on the indicator's.
    The administrative is based on the indicator's.

    Basemap layers and context layers is based on the indicator's instance.
    """

    reference_layers = models.ManyToManyField(
        Indicator
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
    point_of_interests = models.ManyToManyField(
        Geometry, blank=True,
        help_text=_(
            'Filters data by specific geometry. '
            'Geometries is from the instance. '
        )
    )
