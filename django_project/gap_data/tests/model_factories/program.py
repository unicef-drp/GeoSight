import factory

from gap_data.models.program import (
    Program, ProgramInstance, ProgramIntervention
)
from gap_data.tests.model_factories import InstanceF
from gap_data.tests.model_factories.scenario import ScenarioLevelF


class ProgramF(factory.django.DjangoModelFactory):
    name = factory.Sequence(lambda n: 'Program {}'.format(n))

    class Meta:
        model = Program


class ProgramInstanceF(factory.django.DjangoModelFactory):
    instance = factory.SubFactory(InstanceF)
    program = factory.SubFactory(ProgramF)

    class Meta:
        model = ProgramInstance


class ProgramInterventionF(factory.django.DjangoModelFactory):
    program_instance = factory.SubFactory(ProgramInstanceF)
    scenario_level = factory.SubFactory(ScenarioLevelF)

    class Meta:
        model = ProgramIntervention
