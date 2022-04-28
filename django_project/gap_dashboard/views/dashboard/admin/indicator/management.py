import json

from django.http import HttpResponseBadRequest
from django.shortcuts import get_object_or_404, redirect, reverse

from gap_dashboard.views.dashboard.admin._base import AdminView
from gap_data.models.indicator import Indicator, IndicatorGroup
from gap_data.models.instance import Instance
from gap_harvester.models.harvester import UsingExposedAPI


class IndicatorManagementView(AdminView):
    template_name = 'dashboard/admin/indicator/management.html'

    @property
    def content_title(self):
        return 'Indicator Management'

    def get_context_data(self, **kwargs) -> dict:
        context = super().get_context_data(**kwargs)
        indicators_in_groups = self.instance.get_indicators(self.request.user)
        for excluded_group in self.instance.indicatorgroup_set.exclude(
                name__in=indicators_in_groups.keys()):
            indicators_in_groups[excluded_group.name] = {
                'indicators': []
            }

        context.update(
            {
                'indicators_in_groups': indicators_in_groups,
                'external_exposed_api': UsingExposedAPI[0]
            }
        )
        return context

    def post(self, request, **kwargs):
        self.instance = get_object_or_404(
            Instance, slug=kwargs.get('slug', '')
        )
        orders = request.POST.get('orders', None)
        if not orders:
            return HttpResponseBadRequest(f'Orders is required')

        orders = json.loads(orders)
        indicators = self.instance.indicators
        groups = self.instance.indicatorgroup_set.all()
        idx = 1
        for group_name, ids in orders.items():
            try:
                group = groups.get(name=group_name)
                for id in ids:
                    try:
                        indicator = indicators.get(id=id)
                        indicator.group = group
                        indicator.order = idx
                        idx += 1
                        indicator.save()
                    except Indicator.DoesNotExist:
                        pass
            except IndicatorGroup.DoesNotExist:
                pass
        return redirect(
            reverse(
                'indicator-management-view', args=[self.instance.slug]
            )
        )
