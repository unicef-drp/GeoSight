"""Dashboard Relation models."""
from django.contrib.auth import get_user_model
from django.contrib.gis.db import models

from geosight.data.models.basemap_layer import BasemapLayer
from geosight.data.models.context_layer import ContextLayer
from geosight.data.models.dashboard import Dashboard
from geosight.data.models.indicator import Indicator

User = get_user_model()


class DashboardRelation(models.Model):
    """Abstract Dashboard Relation.

    This has:
    - dashboard
    - order
    - visible_by_default
    """

    dashboard = models.ForeignKey(
        Dashboard,
        on_delete=models.CASCADE
    )
    order = models.IntegerField(
        default=0
    )
    visible_by_default = models.BooleanField(
        default=False
    )
    group = models.CharField(
        max_length=512,
        blank=True, null=True
    )

    class Meta:  # noqa: D106
        abstract = True


class DashboardIndicator(DashboardRelation):
    """Indicator x Dashboard model."""

    object = models.ForeignKey(
        Indicator,
        on_delete=models.CASCADE
    )

    class Meta:  # noqa: D106
        ordering = ('order',)


class DashboardBasemap(DashboardRelation):
    """Indicator x Basemap model."""

    object = models.ForeignKey(
        BasemapLayer,
        on_delete=models.CASCADE
    )

    class Meta:  # noqa: D106
        ordering = ('order',)


class DashboardContextLayer(DashboardRelation):
    """Indicator x ContextLayer model."""

    object = models.ForeignKey(
        ContextLayer,
        on_delete=models.CASCADE
    )

    class Meta:  # noqa: D106
        ordering = ('order',)
