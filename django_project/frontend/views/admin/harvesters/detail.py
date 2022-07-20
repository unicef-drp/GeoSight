"""Harvester Detail view."""
import json

from django.http import Http404, HttpResponseBadRequest
from django.shortcuts import get_object_or_404, reverse, redirect

from frontend.views._base import BaseView
from geosight.data.models import Indicator
from geosight.harvester.models import (
    Harvester, ExcelHarvester, UsingExposedAPI
)
from geosight.harvester.serializer.harvester import (
    HarvesterSerializer, HarvesterLogSerializer, HarvesterAttributeSerializer
)
from geosight.harvester.tasks import run_harvester


class HarvesterIndicatorDetail(BaseView):
    """Harvester Indicator View."""

    template_name = 'frontend/admin/harvesters/detail.html'
    indicator = None

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Harvester Detail'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        self.indicator = get_object_or_404(
            Indicator, id=self.kwargs.get('pk', '')
        )
        return f'Harvester for {self.indicator.__str__()}'

    def get_context(self, harvester, edit_url):
        """Parse context."""
        current_log = HarvesterLogSerializer(
            harvester.harvesterlog_set.first()
        ).data if harvester.harvesterlog_set.first() else None
        current_log_detail = ''
        if current_log:
            current_log_detail = current_log['html_detail']
            del current_log['html_detail']
            del current_log['detail']
        context = {
            'edit_url': edit_url,
            'harvester': HarvesterSerializer(harvester).data,
            'attributes': json.loads(
                json.dumps(
                    HarvesterAttributeSerializer(
                        harvester.get_attributes(), many=True).data
                )
            ),
            'current_log': current_log,
            'current_log_detail': current_log_detail,
            'can_harvest_now': True
        }
        if harvester.harvester_class in [
            ExcelHarvester[0],
            UsingExposedAPI[0]

        ]:
            context['can_harvest_now'] = False
        return context

    @property
    def harvester(self):
        """Return harvester data."""
        try:
            return self.indicator.harvester
        except Harvester.DoesNotExist:
            raise Http404('Harvester does not exist')

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        harvester = self.harvester

        context.update(
            self.get_context(
                harvester, reverse(
                    self.indicator.harvester.harvester_class,
                    args=[self.indicator.id]
                )
            )
        )
        return context

    def post(self, request, pk):
        """POST to force harvester to harvest."""
        self.indicator = get_object_or_404(
            Indicator, id=self.kwargs.get('pk', '')
        )
        try:
            harvester = self.indicator.harvester
            run_harvester.delay(harvester.pk)

            return redirect(
                reverse(
                    'harvester-indicator-detail',
                    args=[self.indicator.pk]
                )
            )
        except Harvester.DoesNotExist:
            raise Http404('harvester does not exist')


class HarvesterDetail(HarvesterIndicatorDetail):
    """Harvester Detail View."""

    indicator = None

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Harvester Detail'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        return (
            '<span>Indicators</span> <span>></span> <span>Meta Ingestor</span>'
        )

    @property
    def harvester(self):
        """Return harvester data."""
        try:
            return Harvester.objects.get(
                unique_id=self.kwargs.get('uuid', '')
            )
        except Indicator.DoesNotExist:
            raise Http404('Harvester does not exist')

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super(
            HarvesterIndicatorDetail, self).get_context_data(
            **kwargs)
        harvester = self.harvester
        context.update(
            self.get_context(
                harvester, reverse(
                    'meta-ingestor-uuid-view', args=[
                        self.kwargs.get('uuid', '')
                    ]
                )
            )
        )
        return context

    def post(self, request, uuid):
        """POST to force harvester to harvest."""
        try:
            harvester = Harvester.objects.get(
                unique_id=self.kwargs.get('uuid', '')
            )
        except Indicator.DoesNotExist:
            raise Http404('Harvester does not exist')
        if harvester.harvester_class in [
            ExcelHarvester[0],
            UsingExposedAPI[0]

        ]:
            return HttpResponseBadRequest('Harvester can not be harvested')
        try:
            run_harvester.delay(harvester.pk)
            return redirect(
                reverse(
                    'harvester-detail',
                    args=[str(harvester.unique_id)]
                )
            )
        except Harvester.DoesNotExist:
            raise Http404('harvester does not exist')
