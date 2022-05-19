"""Indicator value models."""
from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _

from gap_data.models.reference_layer import Geometry
from gap_data.models.indicator.indicator import Indicator


class IndicatorValue(models.Model):
    """The data of indicator that saved per date and geometry."""

    indicator = models.ForeignKey(
        Indicator, on_delete=models.CASCADE
    )
    date = models.DateField(
        _('Date'),
        help_text=_('The date of the value harvested.')
    )
    geometry = models.ForeignKey(
        Geometry, on_delete=models.SET_NULL,
        null=True, blank=True
    )
    value = models.FloatField()

    class Meta:  # noqa: D106
        unique_together = ('indicator', 'date', 'geometry')
        ordering = ('-date',)


class IndicatorExtraValue(models.Model):
    """Additional data for Indicator value data."""

    indicator_value = models.ForeignKey(
        IndicatorValue, on_delete=models.CASCADE
    )
    name = models.CharField(
        max_length=100,
        help_text=_(
            "The name of attribute"
        )
    )
    value = models.TextField(
        null=True, default=True,
        help_text=_(
            "The value of attribute"
        )
    )

    class Meta:  # noqa: D106
        unique_together = ('indicator_value', 'name')

    def __str__(self):
        return f'{self.name}'


class IndicatorValueExtraDetailRow(models.Model):
    """A group name of the extra indicator value.

    It contains extra value in dictionary that saved in
    IndicatorValueExtraDetailColumn.
    """

    indicator_value = models.ForeignKey(
        IndicatorValue, on_delete=models.CASCADE
    )


class IndicatorValueExtraDetailColumn(models.Model):
    """Additional data for Indicator value data in column index."""

    row = models.ForeignKey(
        IndicatorValueExtraDetailRow, on_delete=models.CASCADE
    )
    name = models.CharField(
        max_length=100,
        help_text=_(
            "The name of column"
        )
    )
    value = models.TextField(
        null=True, default=True,
        help_text=_(
            "The value of cell"
        )
    )

    class Meta:  # noqa: D106
        unique_together = ('row', 'name')
