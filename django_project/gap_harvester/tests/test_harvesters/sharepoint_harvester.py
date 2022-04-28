from core.settings.utils import ABS_PATH
from gap_harvester.models.harvester import SharepointHarvester
from gap_harvester.tests.model_factories import HarvesterF
from gap_harvester.tests.test_harvesters._base import BaseHarvesterTest


class SharepointTest(BaseHarvesterTest):
    """ Test for Harvester : Sharepoint """

    def test_no_attr_error(self):
        harvester = HarvesterF(
            indicator=self.indicator,
            harvester_class=SharepointHarvester[0]
        )
        harvester.run()
        log = harvester.harvesterlog_set.last()
        self.assertEqual(log.status, 'Error')
        self.assertEqual(
            log.note, 'file is required and it is empty'
        )

    def test_run(self):
        filepath = ABS_PATH('gap_harvester', 'tests', 'test_harvesters', 'fixtures', 'excel_test.xlsx')
        harvester = HarvesterF(
            indicator=self.indicator,
            harvester_class=SharepointHarvester[0]
        )
        harvester.save_default_attributes(instance=self.instance)
        harvester.save_attributes(
            {
                'file': filepath,
                'sheet_name': 'Sheet 1',
                'row_number_for_header': 1,
                'column_name_administration_code': 'geom_code',
                'column_name_month': 'column_name_month',
                'column_name_year': 'column_name_year',
                'column_name_value': 'Indicator 1'

            }
        )
        harvester.run()
        log = harvester.harvesterlog_set.last()
        self.assertEqual(log.status, 'Done')
        self.assertEqual(
            self.indicator.indicatorvalue_set.get(
                geometry__identifier='A').value, 3
        )
        self.assertEqual(
            self.indicator.indicatorvalue_set.get(
                geometry__identifier='A').date.strftime("%Y-%m-%d"), '2020-12-01'
        )
        self.assertEqual(
            self.indicator.indicatorvalue_set.get(
                geometry__identifier='B').value, 2
        )
        self.assertEqual(
            self.indicator.indicatorvalue_set.get(
                geometry__identifier='B').date.strftime("%Y-%m-%d"), '2020-12-01'
        )
        self.assertEqual(
            self.indicator.indicatorvalue_set.get(
                geometry__identifier='C').value, 1
        )
        self.assertEqual(
            self.indicator.indicatorvalue_set.get(
                geometry__identifier='C').date.strftime("%Y-%m-%d"), '2020-12-01'
        )
