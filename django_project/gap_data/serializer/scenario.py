from rest_framework import serializers

from gap_data.models.scenario import ScenarioLevel


class ScenarioLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScenarioLevel
        fields = '__all__'
