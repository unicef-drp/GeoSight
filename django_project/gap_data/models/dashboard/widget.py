"""Plugin model."""
from django.contrib.gis.db import models

from core.models.general import AbstractTerm
from gap_data.models.context_layer import ContextLayer
from gap_data.models.dashboard.dashboard import Dashboard
from gap_data.models.indicator import Indicator


class Type(object):
    """A quick couple variable for Plugin Type."""

    SUMMARY_WIDGET = 'SummaryWidget'
    SUMMARY_GROUP_WIDGET = 'SummaryGroupWidget'


class Operation(object):
    """A quick couple variable for Plugin Operation."""

    SUM = 'Sum'


class LayerUsed(object):
    """A quick couple variable for Layer That being used."""

    INDICATOR = 'Indicator'


class Widget(AbstractTerm):
    """Widget model."""

    @property
    def layer_id(self):
        """Return layer based on layer used."""
        if self.layer_used == LayerUsed.INDICATOR \
                and self.indicator:
            return self.indicator.id
        elif self.context_layer:
            return self.context_layer.id
        else:
            return 0

    dashboard = models.ForeignKey(
        Dashboard,
        help_text=(
            "Dashboard this plugin is used."
        ),
        on_delete=models.CASCADE
    )

    unit = models.CharField(
        max_length=64,
        null=True, blank=True,
        help_text=(
            "A unit e.g. 'cases', 'people', 'children', "
            "that will be shown alongside the number in reports."
        )
    )

    property = models.CharField(
        max_length=256,
        help_text=(
            "Property key that will be used to calculate to plugin."
        )
    )

    property_2 = models.CharField(
        max_length=256,
        null=True, blank=True,
        help_text=(
            "Second property that will be used for e.g: grouping."
        )
    )

    type = models.CharField(
        max_length=256,
        default=Type.SUMMARY_WIDGET,
        choices=(
            (Type.SUMMARY_WIDGET, Type.SUMMARY_WIDGET),
            (Type.SUMMARY_GROUP_WIDGET, Type.SUMMARY_GROUP_WIDGET),
        )
    )

    operation = models.CharField(
        max_length=256,
        default=Operation.SUM,
        choices=(
            (Operation.SUM, Operation.SUM),
        )
    )

    layer_used = models.CharField(
        max_length=256,
        default=LayerUsed.INDICATOR,
        choices=(
            (LayerUsed.INDICATOR, LayerUsed.INDICATOR),
        )
    )

    indicator = models.ForeignKey(
        Indicator,
        blank=True, null=True,
        on_delete=models.SET_NULL,
        help_text=(
            "Use this layer when layer used is reference layer."
        )
    )
    context_layer = models.ForeignKey(
        ContextLayer,
        blank=True, null=True,
        on_delete=models.SET_NULL,
        help_text=(
            "Use this layer when layer used is context layer."
        )
    )

    # order of indicator rendered on the list
    order = models.IntegerField(
        default=0
    )

    def __str__(self):
        return self.name

    class Meta:  # noqa: D106
        ordering = ('order',)
