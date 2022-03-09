from django.http import Http404
from django.shortcuts import get_object_or_404, reverse, redirect
from rir_dashboard.views.dashboard.admin._base import AdminView
from rir_data.models import Indicator, Instance
from rir_harvester.models import Harvester, HarvesterAttribute
from rir_harvester.tasks import run_harvester


class HarvesterIndicatorDetail(AdminView):
    template_name = 'dashboard/admin/harvesters/detail/indicator_detail.html'
    indicator = None

    @property
    def dashboard_title(self):
        return f'Harvester for {self.indicator.__str__()}'

    @property
    def context_view(self) -> dict:
        """
        Return context for specific view by instance
        """
        try:
            self.indicator = self.instance.indicators.get(
                id=self.kwargs.get('pk', '')
            )
        except Indicator.DoesNotExist:
            raise Http404('Indicator does not exist')

        try:
            harvester = self.indicator.harvester
        except Harvester.DoesNotExist:
            raise Http404('Harvester does not exist')

        ids = []
        attributes = []
        for attribute in harvester.get_attributes():
            try:
                attr = harvester.harvesterattribute_set.get(name=attribute)
                attributes.append(attr)
                ids.append(attr.id)
            except HarvesterAttribute.DoesNotExist:
                pass
        for attribute in harvester.harvesterattribute_set.exclude(id__in=ids):
            attributes.append(attribute)

        context = {
            'edit_url': reverse(
                self.indicator.harvester.harvester_class, args=[self.instance.slug, self.indicator.id]
            ),
            'harvester': harvester,
            'harvester_attributes': attributes,
        }
        return context

    def post(self, request, slug, pk):
        instance = get_object_or_404(
            Instance, slug=slug
        )

        try:
            self.indicator = instance.indicators.get(
                id=self.kwargs.get('pk', '')
            )
        except Indicator.DoesNotExist:
            raise Http404('Indicator does not exist')
        try:
            harvester = self.indicator.harvester
            run_harvester.delay(harvester.pk)

            return redirect(
                reverse(
                    'harvester-indicator-detail', args=[instance.slug, self.indicator.pk]
                )
            )
        except Harvester.DoesNotExist:
            raise Http404('harvester does not exist')


class HarvesterDetail(AdminView):
    template_name = 'dashboard/admin/harvesters/detail/harvester_detail.html'
    indicator = None

    @property
    def dashboard_title(self):
        return f'Harvester detail'

    @property
    def context_view(self) -> dict:
        """
        Return context for specific view by instance
        """

        try:
            harvester = Harvester.objects.get(unique_id=self.kwargs.get('uuid', ''))
        except Indicator.DoesNotExist:
            raise Http404('Harvester does not exist')

        ids = []
        attributes = []
        for attribute in harvester.get_attributes():
            try:
                attr = harvester.harvesterattribute_set.get(name=attribute)
                if attr.value:
                    attributes.append(attr)
                    ids.append(attr.id)
            except HarvesterAttribute.DoesNotExist:
                pass
        for attr in harvester.harvesterattribute_set.exclude(id__in=ids):
            if attr.value:
                attributes.append(attr)

        context = {
            'edit_url': reverse(
                'meta-harvester-uuid-view', args=[self.instance.slug, self.kwargs.get('uuid', '')]
            ),
            'instance': self.instance,
            'harvester': harvester,
            'harvester_attributes': attributes,
            'current_log': harvester.harvesterlog_set.first()
        }
        return context
