"""Factory for Program."""
import factory

from gap_data.models.program import (
    Program, ProgramInstance, ProgramIntervention
)
from gap_data.tests.model_factories import InstanceF
from gap_data.tests.model_factories.scenario import ScenarioLevelF


class ProgramF(factory.django.DjangoModelFactory):
    """Factory for Program."""

    name = factory.Sequence(lambda n: 'Program {}'.format(n))

    class Meta:  # noqa: D106
        model = Program


class ProgramInstanceF(factory.django.DjangoModelFactory):
    """Factory for ProgramInstance."""

    instance = factory.SubFactory(InstanceF)
    program = factory.SubFactory(ProgramF)

    class Meta:  # noqa: D106
        model = ProgramInstance


class ProgramInterventionF(factory.django.DjangoModelFactory):
    """Factory for ProgramIntervention."""

    program_instance = factory.SubFactory(ProgramInstanceF)
    scenario_level = factory.SubFactory(ScenarioLevelF)

    class Meta:  # noqa: D106
        model = ProgramIntervention
