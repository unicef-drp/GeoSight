"""Test for Harvester : ExcelHarvester."""
from core.settings.utils import ABS_PATH
from geosight.harvester.models.harvester import ExcelHarvester
from geosight.harvester.tests.model_factories import HarvesterF
from geosight.harvester.tests.test_harvesters._base import BaseHarvesterTest


class ExcelHarvesterTest(BaseHarvesterTest):
    """Test for Harvester : ExcelHarvester."""

    def test_no_attr_error(self):
        """Test run with no attribute error."""
        harvester = HarvesterF(
            indicator=self.indicator,
            harvester_class=ExcelHarvester[0]
        )
        harvester.run()
        log = harvester.harvesterlog_set.last()
        self.assertEqual(log.status, 'Error')
        self.assertEqual(
            log.note, 'file is required and it is empty'
        )

    def test_run(self):
        """Test run."""
        filepath = ABS_PATH(
            'geosight', 'harvester', 'tests', 'test_harvesters',
            'fixtures', 'excel_test.xlsx'
        )
        harvester = HarvesterF(
            harvester_class=ExcelHarvester[0]
        )
        harvester.save_default_attributes()
        harvester.save_attributes(
            {
                'date': '2010-01-01',
                'sheet_name': 'Sheet 1',
                'row_number_for_header': 1,
                'column_name_administration_code': 'geom_code',
                'file': filepath,
                self.indicator.id: 'Indicator 1'

            }
        )
        harvester.run()
        log = harvester.harvesterlog_set.last()
        self.assertEqual(log.status, 'Done')
        self.assertEqual(
            self.indicator.indicatorvalue_set.get(
                geom_identifier='A'
            ).value, 3
        )
        self.assertEqual(
            self.indicator.indicatorvalue_set.get(
                geom_identifier='A'
            ).date.strftime("%Y-%m-%d"), '2010-01-01'
        )
        self.assertEqual(
            self.indicator.indicatorvalue_set.get(
                geom_identifier='B'
            ).value, 2
        )
        self.assertEqual(
            self.indicator.indicatorvalue_set.get(
                geom_identifier='B'
            ).date.strftime("%Y-%m-%d"), '2010-01-01'
        )
        self.assertEqual(
            self.indicator.indicatorvalue_set.get(
                geom_identifier='C'
            ).value, 1
        )
        self.assertEqual(
            self.indicator.indicatorvalue_set.get(
                geom_identifier='C'
            ).date.strftime("%Y-%m-%d"), '2010-01-01'
        )
