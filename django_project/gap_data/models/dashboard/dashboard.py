"""Dashboard model."""
from django.contrib.auth import get_user_model
from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _

from core.models.general import SlugTerm, IconTerm
from gap_data.models.basemap_layer import BasemapLayer
from gap_data.models.context_layer import ContextLayer
from gap_data.models.indicator import Indicator
from gap_data.models.reference_layer import ReferenceLayer

User = get_user_model()


class Dashboard(SlugTerm, IconTerm):
    """Dashboard model.

    One dashboard just contains one indicator.
    The instance is based on the indicator's.
    The administrative is based on the indicator's.

    Basemap layers and context layers is based on the indicator's instance.
    """

    reference_layer = models.ForeignKey(
        ReferenceLayer,
        on_delete=models.CASCADE
    )
    basemap_layers = models.ManyToManyField(
        BasemapLayer
    )
    default_basemap_layer = models.ForeignKey(
        BasemapLayer,
        null=True, blank=True,
        on_delete=models.CASCADE,
        help_text=_(
            'If this is empty, the default will be latest basemap'
        ),
        related_name='dashboard_default_basemap_layer'
    )
    indicators = models.ManyToManyField(
        Indicator
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
    creator = models.ForeignKey(
        User,
        help_text=_('User who create the dashboard.'),
        on_delete=models.CASCADE
    )

    def can_edit(self, user: User):
        """Is dashboard can be edited by user."""
        return user.is_staff or self.creator == user
