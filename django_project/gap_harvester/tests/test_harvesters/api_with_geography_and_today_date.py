import datetime

import responses

from gap_harvester.models.harvester import APIWithGeographyAndTodayDate
from gap_harvester.tests.model_factories import HarvesterF
from gap_harvester.tests.test_harvesters._base import BaseHarvesterTest


class APIWithGeograpyAndTodayDateTest(BaseHarvesterTest):
    """ Test for Harvester : APIWithGeograpyAndTodayDate """

    def test_no_attr_error(self):
        harvester = HarvesterF(
            indicator=self.indicator,
            harvester_class=APIWithGeographyAndTodayDate[0]
        )
        harvester.run()
        log = harvester.harvesterlog_set.last()
        self.assertEqual(log.status, 'Error')
        self.assertEqual(
            log.note, list(
                harvester.get_harvester_class.additional_attributes().keys()
            )[0] + ' is required and it is empty'
        )

    @responses.activate
    def test_run(self):
        today = datetime.datetime.today().date()
        harvester = HarvesterF(
            indicator=self.indicator,
            harvester_class=APIWithGeographyAndTodayDate[0]
        )
        harvester.save_attributes(
            {
                'api_url': 'http://test.com',
                'keys_for_list': "x['results']",
                'keys_for_geography_identifier': "x['geom_code']",
                'keys_for_value': "x['value']"
            }
        )
        harvester.save_mapping(
            {
                'A': 'A',
                'B': 'B',
                'C': 'C',
            }
        )
        responses.add(
            responses.GET,
            f'http://test.com',
            status=200,
            json={
                'results': [
                    {
                        'geom_code': 'A',
                        'value': 1
                    },
                    {
                        'geom_code': 'B',
                        'value': 2
                    },
                    {
                        'geom_code': 'C',
                        'value': 4
                    }
                ]
            }
        )
        harvester.run()
        log = harvester.harvesterlog_set.last()
        self.assertEqual(log.status, 'Done')
        self.assertEqual(
            harvester.indicator.indicatorvalue_set.get(
                geometry__identifier='A').value, 1
        )
        self.assertEqual(
            harvester.indicator.indicatorvalue_set.get(
                geometry__identifier='A').date, today
        )
        self.assertEqual(
            harvester.indicator.indicatorvalue_set.get(
                geometry__identifier='B').value, 2
        )
        self.assertEqual(
            harvester.indicator.indicatorvalue_set.get(
                geometry__identifier='B').date, today
        )
        self.assertEqual(
            harvester.indicator.indicatorvalue_set.get(
                geometry__identifier='C').value, 4
        )
        self.assertEqual(
            harvester.indicator.indicatorvalue_set.get(
                geometry__identifier='C').date, today
        )
