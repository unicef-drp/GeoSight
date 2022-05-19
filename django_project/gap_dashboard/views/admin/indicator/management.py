"""Indicator Management View."""
import json

from django.http import HttpResponseBadRequest
from django.shortcuts import redirect, reverse

from gap_dashboard.views.admin._base import AdminView
from gap_data.models.indicator import Indicator, IndicatorGroup
from gap_harvester.models.harvester import UsingExposedAPI


class IndicatorManagementView(AdminView):
    """Indicator Management View."""

    template_name = 'dashboard/admin/indicator/management.html'

    @property
    def content_title(self):
        """Return content title."""
        return 'Indicator Management'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        context.update(
            {
                'external_exposed_api': UsingExposedAPI[0]
            }
        )
        return context

    def post(self, request, **kwargs):
        """Save indicator orders."""
        orders = request.POST.get('orders', None)
        if not orders:
            return HttpResponseBadRequest('Orders is required')

        orders = json.loads(orders)
        indicators = Indicator.objects.all()
        groups = IndicatorGroup.objects.all()
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
                'indicator-management-view', args=[]
            )
        )
