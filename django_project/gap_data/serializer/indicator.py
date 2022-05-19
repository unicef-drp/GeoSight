"""Indicator Serializer."""
from rest_framework import serializers

from gap_data.models.indicator import Indicator, IndicatorValue, IndicatorRule


class IndicatorSerializer(serializers.ModelSerializer):
    """Serializer for Indicator."""

    group = serializers.SerializerMethodField()
    rules = serializers.SerializerMethodField()

    def get_group(self, obj: Indicator):
        """Return group."""
        return obj.group.name

    def get_rules(self, obj: Indicator):
        """Return rules."""
        output = []
        for indicator_rule in obj.indicatorrule_set.all():
            rules = indicator_rule.rule.replace(' ', '').split('and')
            try:
                rule = rules[1].replace(
                    'x', '').replace('=', '').replace('<', '')
            except IndexError:
                rule = rules[0].replace(
                    'x', '').replace('=', '').replace('<', '')

            try:
                rule = float(rule)
            except ValueError:
                rule = ''

            output.append({
                'name': indicator_rule.name,
                'threshold': rule
            })
        return output

    class Meta:  # noqa: D106
        model = Indicator
        fields = ('id', 'group', 'name', 'show_in_context_analysis', 'rules',
                  'dashboard_link', 'source', 'description')


class IndicatorValueSerializer(serializers.ModelSerializer):
    """Serializer for IndicatorValue."""

    class Meta:  # noqa: D106
        model = IndicatorValue
        fields = '__all__'

class IndicatorRuleSerializer(serializers.ModelSerializer):
    """Serializer for IndicatorRule."""

    class Meta:  # noqa: D106
        model = IndicatorRule
        fields = '__all__'

class IndicatorDetailValueSerializer(serializers.ModelSerializer):
    """Serializer for IndicatorDetailValue."""

    geometry_code = serializers.SerializerMethodField()
    geometry_name = serializers.SerializerMethodField()
    extra_data = serializers.SerializerMethodField()

    def get_geometry_code(self, obj: IndicatorValue):
        """Return geometry_code."""
        return obj.geometry.identifier

    def get_geometry_name(self, obj: IndicatorValue):
        """Return geometry_name."""
        return obj.geometry.name

    def get_extra_data(self, obj: IndicatorValue):
        """Return extra_data."""
        return {
            extra.name: extra.value for extra in
            obj.indicatorextravalue_set.all()
        }

    class Meta:  # noqa: D106
        model = IndicatorValue
        exclude = ('geometry', 'indicator')
