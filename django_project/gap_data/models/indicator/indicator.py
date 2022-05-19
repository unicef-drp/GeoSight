"""Indicator model."""
from datetime import date

from django.contrib.gis.db import models
from django.shortcuts import reverse

from core.models.general import AbstractTerm, AbstractSource
from gap_data.models.indicator.indicator_attributes import (
    IndicatorFrequency, IndicatorGroup
)


# AGGREGATION BEHAVIOURS
class AggregationBehaviour(object):
    """A quick couple variable for AggregationBehaviour."""

    ALL_REQUIRED = 'All geography required in current time window'
    USE_AVAILABLE = (
        'Use all available populated geography in current time window'
    )
    USE_MOST_RECENT = 'Most recent for each geography'


# AGGREGATION METHOD
class AggregationMethod(object):
    """A quick couple variable for AggregationMethod."""

    SUM = 'Aggregate data by sum all data.'
    AVERAGE = 'Aggregate data by average data in the levels.'
    MAJORITY = 'Aggregate data by majority data in the levels.'


class IndicatorValueRejectedError(Exception):
    """Exceptions for value rejected."""

    pass


class Indicator(AbstractTerm, AbstractSource):
    """The indicator model."""

    shortcode = models.CharField(
        max_length=512,
        null=True, blank=True,
        help_text=(
            'A computer-to-computer shortcode for this indicator. '
            'For example, an abbreviated '
            'name that you might use to refer to it in a spreadsheet column.'
        )
    )
    group = models.ForeignKey(
        IndicatorGroup, on_delete=models.SET_NULL,
        blank=True, null=True
    )
    frequency = models.ForeignKey(
        IndicatorFrequency, on_delete=models.SET_NULL,
        blank=True, null=True
    )

    # TODO:
    #  When recreate all migrations from zero
    #  Default it removed
    reporting_level = models.CharField(
        max_length=64, default='District'
    )
    unit = models.CharField(
        max_length=64,
        null=True, blank=True,
        help_text=(
            "A unit e.g. 'cases', 'people', 'children', "
            "that will be shown alongside the number in reports."
        )
    )

    aggregation_behaviour = models.CharField(
        max_length=256,
        default=AggregationBehaviour.USE_MOST_RECENT,
        choices=(
            (
                AggregationBehaviour.USE_AVAILABLE,
                'Current time window only'
            ),
            (AggregationBehaviour.USE_MOST_RECENT,
             AggregationBehaviour.USE_MOST_RECENT)
        )
    )

    aggregation_method = models.CharField(
        max_length=256,
        default=AggregationMethod.AVERAGE,
        choices=(
            (AggregationMethod.AVERAGE,
             'Aggregate data by average data in the levels'),
            (AggregationMethod.MAJORITY,
             'Aggregate data by majority data in the levels'),
            (AggregationMethod.SUM,
             'Aggregate data by sum of all data in the levels'),
        )
    )

    # threshold
    min_value = models.FloatField(
        default=0,
        help_text="Minimum value for the indicator that can received",
        verbose_name="Minimum Value"
    )
    max_value = models.FloatField(
        default=100,
        help_text="Maximum value for the indicator that can received",
        verbose_name="Maximum Value"
    )

    # dashboard link
    dashboard_link = models.CharField(
        max_length=1024,
        null=True, blank=True,
        help_text=(
            'A dashboard link can be any URL to e.g. '
            'a BI platform or another web site. '
            'This is optional, and when populated, '
            'a special icon will be shown next to the indicator which, '
            'when clicked, will open up this URL in '
            'a frame over the main map area.'
        )
    )

    def __str__(self):
        return f'{self.group}/{self.name}'

    @property
    def allow_to_harvest_new_data(self):
        """For checking if the new data can be harvested.

        It will check based on the frequency.
        """
        last_data = self.indicatorvalue_set.all().order_by('-date').first()
        if not last_data:
            return True

        difference = date.today() - last_data.date
        return difference.days >= self.frequency.frequency

    @property
    def create_harvester_url(self):
        """Create the first harvester url for this indicator."""
        from gap_harvester.models.harvester import HARVESTERS
        return reverse(HARVESTERS[0][0], args=[self.id])

    def rules_dict(self):
        """Return rules in list of dict"""
        from gap_data.serializer.indicator import IndicatorRuleSerializer
        return IndicatorRuleSerializer(
            self.indicatorrule_set.all(), many=True
        ).data
