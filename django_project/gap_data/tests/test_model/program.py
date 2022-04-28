"""Test for Program model."""
from django.test.testcases import TestCase

from gap_data.tests.model_factories import (
    InstanceF, ProgramF, ProgramInstanceF, ProgramInterventionF
)


class ProgramTest(TestCase):
    """Test for Program model."""

    def setUp(self):
        """To setup test."""
        self.name = 'Link1'
        self.instance = InstanceF()

    def test_create(self):
        """Test create."""
        program = ProgramF(
            name=self.name
        )
        self.assertEquals(program.name, self.name)

        program_instance = ProgramInstanceF(
            instance=self.instance,
            program=program
        )
        self.assertEquals(program_instance.instance, self.instance)
        self.assertEquals(program_instance.program, program)

        intervention = ProgramInterventionF(
            program_instance=program_instance
        )
        self.assertEquals(intervention.program_instance, program_instance)
