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

    class Meta:  # noqa: D106
        abstract = True


class DashboardRelationWithGroup(DashboardRelation):
    """Dashboard relation with group."""
    group = models.CharField(
        max_length=512,
        blank=True, null=True
    )

    class Meta:  # noqa: D106
        abstract = True


class DashboardIndicator(DashboardRelationWithGroup):
    """Indicator x Dashboard model."""

    indicator = models.ForeignKey(
        Indicator,
        on_delete=models.CASCADE
    )

    class Meta:  # noqa: D106
        ordering = ('order',)


class DashboardBasemap(DashboardRelationWithGroup):
    """Indicator x Basemap model."""

    basemap = models.ForeignKey(
        BasemapLayer,
        on_delete=models.CASCADE
    )

    class Meta:  # noqa: D106
        ordering = ('order',)


class DashboardContextLayer(DashboardRelationWithGroup):
    """Indicator x ContextLayer model."""

    context_layer = models.ForeignKey(
        ContextLayer,
        on_delete=models.CASCADE
    )

    class Meta:  # noqa: D106
        ordering = ('order',)
