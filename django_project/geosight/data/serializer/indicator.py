"""Indicator Serializer."""
from django.shortcuts import reverse
from rest_framework import serializers

from geosight.data.models.indicator import Indicator, IndicatorRule


class IndicatorSerializer(serializers.ModelSerializer):
    """Serializer for Indicator."""

    group = serializers.SerializerMethodField()
    rules = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

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

    def get_url(self, obj: Indicator):
        """Return url."""
        return reverse(
            'indicator-values-api',
            args=[obj.id]
        )

    class Meta:  # noqa: D106
        model = Indicator
        fields = (
            'id', 'group', 'name', 'rules',
            'dashboard_link', 'source', 'description', 'url')


class BasicIndicatorSerializer(serializers.ModelSerializer):
    """Serializer for Indicator."""

    url = serializers.SerializerMethodField()

    def get_url(self, obj: Indicator):
        """Return url."""
        return reverse(
            'indicator-values-api',
            args=[obj.id]
        )

    class Meta:  # noqa: D106
        model = Indicator
        fields = (
            'id', 'name', 'source', 'description', 'url')


class IndicatorRuleSerializer(serializers.ModelSerializer):
    """Serializer for IndicatorRule."""

    class Meta:  # noqa: D106
        model = IndicatorRule
        fields = '__all__'
