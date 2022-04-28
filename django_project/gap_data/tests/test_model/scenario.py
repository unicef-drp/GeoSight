from django.test.testcases import TestCase

from gap_data.tests.model_factories import ScenarioLevelF, InstanceF


class ScenarioTest(TestCase):
    """ Test for ScenarioLevel model """

    def setUp(self):
        self.name = 'Scenario Level 1'
        self.instance = InstanceF()

    def test_create(self):
        scenario_level = ScenarioLevelF(
            instance=self.instance,
            name=self.name
        )
        self.assertEquals(scenario_level.name, self.name)
        self.assertEquals(scenario_level.instance.slug, self.instance.slug)
