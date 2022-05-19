"""Indicator model."""
from datetime import date

from django.contrib.gis.db import models
from django.db.models import Count, Sum, Avg
from django.shortcuts import reverse

from core.models.general import AbstractTerm, AbstractSource
from gap_data.models.indicator.indicator_attributes import (
    IndicatorFrequency, IndicatorGroup
)
from gap_data.models.reference_layer import Geometry, GeometryLevelName


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
    geometry_reporting_level = models.ForeignKey(
        GeometryLevelName, on_delete=models.SET_NULL,
        null=True, blank=True
    )
    geometry_reporting_units = models.ManyToManyField(
        Geometry, blank=True
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
            # (AggregationBehaviour.ALL_REQUIRED,
            # AggregationBehaviour.ALL_REQUIRED),
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
        return self.full_name

    @property
    def full_name(self):
        """Return full name of indicator with the group."""
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

    @staticmethod
    def list():
        """Return list of indicators."""
        return Indicator.objects.all()

    @property
    def legends(self):
        """Return legend of indicator."""
        output = {}
        for indicator_rule in self.indicatorrule_set.all():
            output[indicator_rule.name] = {
                'color': indicator_rule.color,
                'rule_str': indicator_rule.rule_str

            }
        return output

    def rules_dict(self):
        """
        Return rules in list of dict
        """
        rules = []
        for rule in self.indicatorrule_set.all():
            rules.append({
                'id': rule.id,
                'name': rule.name,
                'value': rule.rule,
                'color': rule.color,
            })
        return rules

    def rule_by_value(self, value):
        """Return rules level of the value."""
        if value is not None:
            # check the rule
            for indicator_rule in self.indicatorrule_set.all():
                try:
                    if eval(indicator_rule.rule.replace(
                            'x', f'{value}').lower()):
                        return indicator_rule
                except NameError:
                    pass
        else:
            return None

    def query_value(self, date_data: date):
        """Return query of value."""
        query = self.indicatorvalue_set.filter(date__lte=date_data).filter(
            geometry__geometry_level=self.geometry_reporting_level
        )

        # update query by behaviour
        if self.aggregation_behaviour == AggregationBehaviour.USE_AVAILABLE:
            if query.first():
                last_date = query.first().date
                query = query.filter(date=last_date)
        return query

    def serialize(self, geometry, value, attributes=None):
        """Serialize the data."""
        rule = self.rule_by_value(value)
        values = {
            'indicator_id': self.id,
            'geometry_id': geometry.id,
            'geometry_code': geometry.identifier,
            'geometry_name': geometry.name,
            'value': value,
        }
        if rule:
            values.update({
                'rule_text': rule.name,
                'background_color': rule.color,
            })
        values.update(attributes if attributes else {})
        return values

    def values(
            self, geometry: Geometry, geometry_level: GeometryLevelName,
            date_data: date,
            use_exact_date=False, more_information=False, serializer=None
    ):
        """Return list data based on the geometry and geometry level with date.

        If it is upper than the reporting geometry level,
        it will be aggregate to upper level.
        """
        from gap_data.models.indicator import IndicatorExtraValue

        # get the geometries of data
        values = []
        query = self.query_value(date_data)
        if use_exact_date:
            query = query.filter(date=date_data)

        reporting_units = list(
            self.reporting_units.values_list('id', flat=True))
        if not query.first():
            return values

        if geometry_level == self.geometry_reporting_level:
            # this is for returning real data
            geometries_target = geometry.geometries_by_level(geometry_level)
            query_report = query.filter(
                geometry__in=geometries_target
            ).filter(
                geometry__id__in=reporting_units
            ).order_by('geometry_id', '-date').distinct('geometry_id')
            for indicator_value in query_report:
                attributes = {}

                if more_information:
                    attributes['date'] = indicator_value.date
                    attributes.update({
                        extra.name: extra.value for extra in
                        indicator_value.indicatorextravalue_set.all()
                    })
                    # for details
                    details = []
                    for row in indicator_value. \
                            indicatorvalueextradetailrow_set.all():
                        columns = {}
                        for column in row. \
                                indicatorvalueextradetailcolumn_set.all():
                            columns[column.name] = column.value
                        details.append(columns)
                    attributes['details'] = details

                if serializer:
                    attributes.update(
                        serializer(indicator_value).data)
                    value = attributes
                else:
                    value = self.serialize(
                        indicator_value.geometry,
                        indicator_value.value,
                        attributes
                    )
                values.append(value)

        else:
            # this is for returning non real data
            # get the geometries target by the level
            geometries_target = geometry.geometries_by_level(geometry_level)

            # get the data for every geometry target
            for geometry_target in geometries_target:
                geometries_report = list(
                    geometry_target.geometries_by_level(
                        self.geometry_reporting_level
                    ).values_list(
                        'id', flat=True)
                )
                # filter data just by geometry target
                query_report = query.filter(
                    geometry__in=geometries_report
                ).filter(
                    geometry__id__in=reporting_units
                )

                try:
                    value = None
                    # aggregate the data by method
                    if self.aggregation_method == AggregationMethod.MAJORITY:
                        output = query_report.values('value').annotate(
                            dcount=Count('value')
                        ).order_by('-dcount')
                        value = output[0]['value']
                    elif self.aggregation_method == AggregationMethod.SUM:
                        output = query_report.values('indicator').annotate(
                            sum=Sum('value')
                        )
                        value = output[0]['sum']
                    elif self.aggregation_method == AggregationMethod.AVERAGE:
                        output = query_report.values('indicator').annotate(
                            avg=Avg('value')
                        )
                        value = output[0]['avg']

                    # aggregate other value
                    attributes = {}
                    if more_information:
                        for extra_value in IndicatorExtraValue.objects.filter(
                                indicator_value__in=query_report.values_list(
                                    'id', flat=True)):
                            try:
                                aggregated_value = int(extra_value.value)
                                if extra_value.name not in attributes:
                                    attributes[extra_value.name] = 0
                                attributes[
                                    extra_value.name] += aggregated_value
                            except ValueError:
                                pass

                        # for details
                        details = []
                        for indicator_value in query_report:
                            for row in indicator_value. \
                                    indicatorvalueextradetailrow_set.all():
                                columns = {}
                                for column in row. \
                                        indicatorvalueextradetailcolumn_set. \
                                        all():
                                    columns[column.name] = column.value
                                details.append(columns)
                        attributes['details'] = details

                    data = self.serialize(geometry_target, value, attributes)
                    if use_exact_date:
                        data['date'] = date_data
                    values.append(data)
                except IndexError:
                    pass

        return values

    @property
    def reporting_units(self):
        """To return geometry of instance.

        It will return all unit if
        it does not have geometry_reporting_units.
        """
        if self.geometry_reporting_units.count() == 0:
            return Geometry.objects.filter(
                geometry_level=self.geometry_reporting_level)
        else:
            return self.geometry_reporting_units.all()

    @property
    def create_harvester_url(self):
        """Create the first harvester url for this indicator."""
        from gap_harvester.models.harvester import HARVESTERS
        return reverse(
            HARVESTERS[0][0], args=[self.id]
        )

    def save_value(
            self,
            date: date, geometry: Geometry, value: float,
            extras: dict = None, details: list = None
    ):
        """Save new value for the indicator."""
        from gap_data.models.indicator import (
            IndicatorValue, IndicatorExtraValue,
            IndicatorValueExtraDetailRow, IndicatorValueExtraDetailColumn
        )
        if value < self.min_value or value > self.max_value:
            raise IndicatorValueRejectedError(
                f'Value needs between {self.min_value} - {self.max_value}')
        indicator_value, created = IndicatorValue.objects.get_or_create(
            indicator=self,
            date=date,
            geometry=geometry,
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

        if details:
            for detail in details:
                try:
                    items = detail.items()
                    row = IndicatorValueExtraDetailRow.objects.create(
                        indicator_value=indicator_value
                    )
                    for extra_key, extra_value in items:
                        IndicatorValueExtraDetailColumn.objects.create(
                            row=row,
                            name=extra_key,
                            value=extra_value
                        )
                except AttributeError:
                    pass
        return indicator_value
