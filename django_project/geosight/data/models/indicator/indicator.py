"""Indicator model."""
from datetime import date

from django.contrib.gis.db import models
from django.shortcuts import reverse

from core.models.general import AbstractTerm, AbstractSource
from geosight.data.models.indicator.indicator_attributes import (
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
    reporting_level = models.CharField(
        max_length=64,
        help_text=(
            "Indicate what level of the data for this indicator. "
            "It can use level name or level number."
        )
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

    class Meta:  # noqa: D106
        ordering = ('group__name', 'name')

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
        from geosight.harvester.models.harvester import HARVESTERS
        return reverse(HARVESTERS[0][0], args=[self.id])

    def rules_dict(self):
        """Return rules in list of dict."""
        from geosight.data.serializer.indicator import IndicatorRuleSerializer
        return [
            dict(rule) for rule in IndicatorRuleSerializer(
                self.indicatorrule_set.all(), many=True
            ).data
        ]

    def save_value(
            self,
            date: date, geom_identifier: str,
            value: float, extras: dict = None):
        """Save new value for the indicator."""
        from geosight.data.models.indicator import (
            IndicatorValue, IndicatorExtraValue
        )
        if value < self.min_value or value > self.max_value:
            raise IndicatorValueRejectedError(
                f'Value needs between {self.min_value} - {self.max_value}'
            )
        indicator_value, created = IndicatorValue.objects.get_or_create(
            indicator=self,
            date=date,
            geom_identifier=geom_identifier,
            defaults={
                'value': value
            }
        )
        indicator_value.value = value
        indicator_value.save()

        if extras:
            for extra_key, extra_value in extras.items():
                indicator_extra_value, created = \
                    IndicatorExtraValue.objects.get_or_create(
                        indicator_value=indicator_value,
                        name=extra_key
                    )
                indicator_extra_value.value = extra_value
                indicator_extra_value.save()
        return indicator_value

    def query_value(self, date_data: date):
        """Return query of value."""
        query = self.indicatorvalue_set.filter(date__lte=date_data)
        # update query by behaviour
        if self.aggregation_behaviour == AggregationBehaviour.USE_AVAILABLE:
            if query.first():
                last_date = query.first().date
                query = query.filter(date=last_date)
        return query

    def rule_by_value(self, value):
        """Return scenario level of the value."""
        if value is not None:
            # check the rule
            for indicator_rule in self.indicatorrule_set.all():
                try:
                    if indicator_rule.rule and eval(
                            indicator_rule.rule.replace('x',
                                                        f'{value}').lower()):
                        return indicator_rule
                except NameError:
                    pass
        return None

    def serialize(self, geometry_code, value, attributes=None):
        """Return data."""
        rule = self.rule_by_value(value)
        background_color = rule.color if rule else ''
        outline_color = rule.outline_color if rule else '#000000'

        values = {
            'indicator_id': self.id,
            'geometry_code': geometry_code,
            'value': value,
            'text': rule.name,
            'color': background_color,
            'outline_color': outline_color
        }
        values.update(attributes if attributes else {})
        return values

    def values(self, date_data: date):
        """Return list data based on date.

        If it is upper than the reporting geometry level,
        it will be aggregate to upper level
        """
        # get the geometries of data
        values = []
        query = self.query_value(date_data)
        query_report = query.order_by(
            'geom_identifier', '-date').distinct(
            'geom_identifier')
        for indicator_value in query_report:
            attributes = {
                'date': indicator_value.date
            }
            attributes.update({
                extra.key: extra.value for extra in
                indicator_value.indicatorextravalue_set.all()
            })
            if indicator_value.indicatorvalueextradetailrow_set.count():
                attributes[
                    'detail_url'] = reverse(
                    'indicator-value-detail',
                    args=[indicator_value.indicator.pk, indicator_value.pk])
            value = self.serialize(
                indicator_value.geom_identifier,
                indicator_value.value,
                attributes
            )
            values.append(value)
        return values
