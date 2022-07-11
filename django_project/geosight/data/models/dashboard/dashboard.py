"""Dashboard model."""
from django.contrib.auth import get_user_model
from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _

from core.models.general import (
    SlugTerm, IconTerm, AbstractTerm, AbstractEditData
)
from geosight.data.models.basemap_layer import BasemapLayer
from geosight.data.models.context_layer import ContextLayer
from geosight.data.models.indicator import Indicator
from geosight.georepo.reference_layer import ReferenceLayer

User = get_user_model()


class DashboardGroup(AbstractTerm):
    """The group of dashboard."""

    pass



class Dashboard(SlugTerm, IconTerm, AbstractEditData):
    """Dashboard model.

    One dashboard just contains one indicator.
    The instance is based on the indicator's.
    The administrative is based on the indicator's.

    Basemap layers and context layers is based on the indicator's instance.
    """

    reference_layer_identifier = models.CharField(
        max_length=512, null=True, blank=True
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
    filters = models.TextField(
        blank=True, null=True
    )

    # group
    group = models.ForeignKey(
        DashboardGroup,
        on_delete=models.SET_NULL,
        blank=True, null=True
    )

    @property
    def reference_layer(self):
        """Return reference layer object."""
        return ReferenceLayer(self.reference_layer_identifier)

    def can_edit(self, user: User):
        """Is dashboard can be edited by user."""
        return user.is_staff or self.creator == user

    def save_widgets(self, widget_data):
        """Save widgets from data."""
        from .widget import Widget, LayerUsed
        ids = []

        # Remove all not found ids
        for data in widget_data:
            if 'id' in data:
                ids.append(data['id'])

        # Remove all not found ids
        self.widget_set.exclude(id__in=ids).delete()

        # Save data
        for data in widget_data:
            try:
                try:
                    widget = Widget.objects.get(
                        id=data['id']
                    )
                except (KeyError, Widget.DoesNotExist):
                    widget = Widget(dashboard=self)

                widget.name = data['name']
                widget.type = data['type']
                widget.description = data['description']
                widget.operation = data['operation']
                widget.unit = data['unit']
                widget.property = data['property']
                widget.layer_used = data['layer_used']

                if widget.layer_used == LayerUsed.INDICATOR:
                    try:
                        widget.indicator = Indicator.objects.get(
                            id=data['layer_id']
                        )
                    except Indicator.DoesNotExist:
                        pass

                # optional data
                try:
                    widget.property_2 = data['property_2']
                except KeyError:
                    pass
                widget.save()
            except KeyError:
                pass
