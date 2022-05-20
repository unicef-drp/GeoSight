"""Harvester Detail view."""
from django.http import Http404, HttpResponseBadRequest
from django.shortcuts import get_object_or_404, reverse, redirect

from gap_dashboard.views.admin._base import AdminView
from gap_data.models import Indicator
from gap_harvester.models import Harvester, ExcelHarvester, UsingExposedAPI
from gap_harvester.tasks import run_harvester


class HarvesterIndicatorDetail(AdminView):
    """Harvester Indicator View."""

    template_name = 'dashboard/admin/harvesters/detail/harvester_detail.html'
    indicator = None

    @property
    def content_title(self):
        """Return content title."""
        return f'Harvester for {self.indicator.full_name}'

    def get_context(self, harvester, edit_url):
        """Parse context."""
        context = {
            'edit_url': edit_url,
            'harvester': harvester,
            'harvester_attributes': harvester.get_attributes(),
            'current_log': harvester.harvesterlog_set.first(),
            'can_harvest_now': True
        }
        if harvester.harvester_class in [
            ExcelHarvester[0],
            UsingExposedAPI[0]

        ]:
            context['can_harvest_now'] = False
        return context

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        self.indicator = get_object_or_404(
            Indicator, id=self.kwargs.get('pk', '')
        )

        try:
            harvester = self.indicator.harvester
        except Harvester.DoesNotExist:
            raise Http404('Harvester does not exist')

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

    template_name = 'dashboard/admin/harvesters/detail/harvester_detail.html'
    indicator = None

    @property
    def content_title(self):
        """Return content title."""
        return 'Harvester detail'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        try:
            harvester = Harvester.objects.get(
                unique_id=self.kwargs.get('uuid', '')
            )
        except Indicator.DoesNotExist:
            raise Http404('Harvester does not exist')
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
            run_harvester(harvester.pk)
            return redirect(
                reverse(
                    'harvester-detail',
                    args=[str(harvester.unique_id)]
                )
            )
        except Harvester.DoesNotExist:
            raise Http404('harvester does not exist')
