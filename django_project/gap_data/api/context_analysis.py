"""Context Analysis API.."""
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from gap_data.models.instance import Instance
from gap_data.models.program import ProgramIntervention
from gap_data.models.scenario import ScenarioLevel
from gap_data.serializer.program import ProgramInterventionSerializer
from gap_data.serializer.scenario import ScenarioLevelSerializer


class ContextAnalysisData(APIView):
    """Return all context analysis data."""

    def get(self, request, slug):
        """Return all context analysis data."""
        context = {}
        instance = get_object_or_404(
            Instance, slug=slug
        )
        indicators_in_groups, overall_scenario_level = \
            instance.get_indicators_and_overall_scenario(self.request.user)

        context['scenarios'] = ScenarioLevelSerializer(
            instance.scenario_levels, many=True
        ).data

        scenario_level = ScenarioLevel.objects.get(
            level=overall_scenario_level
        )

        # intervention
        interventions = []
        for program_instance in instance.programs_instance:
            intervention = program_instance.programintervention_set.filter(
                scenario_level__level=overall_scenario_level).first()
            if intervention:
                interventions.append(
                    ProgramInterventionSerializer(intervention).data
                )
            else:
                # temporary with no url
                interventions.append(
                    ProgramInterventionSerializer(
                        ProgramIntervention(
                            program_instance=program_instance,
                            scenario_level=scenario_level
                        )
                    ).data
                )
        try:
            context['overall_scenario'] = context[
                'scenarios'][overall_scenario_level - 1]
        except IndexError:
            context['overall_scenario'] = 1
        context['interventions'] = interventions
        context['indicators_in_groups'] = indicators_in_groups
        return Response(context)
