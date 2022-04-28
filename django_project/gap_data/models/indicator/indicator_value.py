from django.contrib.gis.db import models
from django.utils.translation import ugettext_lazy as _

from gap_data.models.geometry import Geometry
from gap_data.models.indicator.indicator import Indicator


class IndicatorValue(models.Model):
    """
    The data of indicator
    It is saved per date
    """
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

    class Meta:
        unique_together = ('indicator', 'date', 'geometry')
        ordering = ('-date',)


class IndicatorExtraValue(models.Model):
    """
    Additional data for Indicator value data
    """
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

    class Meta:
        unique_together = ('indicator_value', 'name')

    def __str__(self):
        return f'{self.name}'


# Presented as table
# This is for the list and grouping
class IndicatorValueExtraDetailRow(models.Model):
    """
    Additional data for Indicator value data
    """
    indicator_value = models.ForeignKey(
        IndicatorValue, on_delete=models.CASCADE
    )


# This is the data for the group
class IndicatorValueExtraDetailColumn(models.Model):
    """
    Additional data for Indicator value data
    """
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

    class Meta:
        unique_together = ('row', 'name')
