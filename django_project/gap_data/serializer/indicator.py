from rest_framework import serializers

from gap_data.models.indicator import Indicator, IndicatorValue


class IndicatorSerializer(serializers.ModelSerializer):
    group = serializers.SerializerMethodField()
    rules = serializers.SerializerMethodField()

    def get_group(self, obj: Indicator):
        return obj.group.name

    def get_rules(self, obj: Indicator):
        output = {}
        for indicator_rule in obj.indicatorscenariorule_set.all():
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

            output[str(indicator_rule.scenario_level.level)] = {
                'name': indicator_rule.name,
                'threshold': rule
            }
        return output

    class Meta:
        model = Indicator
        fields = ('id', 'group', 'name', 'show_in_context_analysis', 'rules',
                  'dashboard_link')

    def to_representation(self, instance: Indicator):
        data = super(IndicatorSerializer, self).to_representation(instance)
        for indicator_rule in instance.indicatorscenariorule_set.all():
            data[
                f'scenario_{indicator_rule.scenario_level.level}'
            ] = indicator_rule.name
        return data


class IndicatorValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndicatorValue
        fields = '__all__'


class IndicatorDetailValueSerializer(serializers.ModelSerializer):
    geometry_code = serializers.SerializerMethodField()
    geometry_name = serializers.SerializerMethodField()
    extra_data = serializers.SerializerMethodField()

    def get_geometry_code(self, obj: IndicatorValue):
        return obj.geometry.identifier

    def get_geometry_name(self, obj: IndicatorValue):
        return obj.geometry.name

    def get_extra_data(self, obj: IndicatorValue):
        return {
            extra.name: extra.value for extra in
            obj.indicatorextravalue_set.all()
        }

    class Meta:
        model = IndicatorValue
        exclude = ('geometry', 'indicator')
