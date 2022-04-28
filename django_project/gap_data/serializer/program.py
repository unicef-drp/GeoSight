from rest_framework import serializers

from gap_data.models.program import Program, ProgramIntervention


class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = '__all__'

    def to_representation(self, instance: Program):
        data = super(ProgramSerializer, self).to_representation(instance)
        for intervention in instance.programintervention_set.all():
            data[f'scenario_{intervention.scenario_level.level}'] = intervention.intervention_url
        return data


class ProgramInterventionSerializer(serializers.ModelSerializer):
    slug = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    intervention_url = serializers.SerializerMethodField()

    def get_slug(self, obj: ProgramIntervention):
        return obj.program_instance.program.slug

    def get_name(self, obj: ProgramIntervention):
        return obj.program_instance.program.name

    def get_intervention_url(self, obj: ProgramIntervention):
        return obj.intervention_url

    class Meta:
        model = ProgramIntervention
        fields = '__all__'
