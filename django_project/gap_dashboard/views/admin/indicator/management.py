"""Indicator Management View."""
import json

from django.http import HttpResponseBadRequest
from django.shortcuts import redirect, reverse

from gap_dashboard.views.admin._base import AdminView
from gap_data.models.indicator import Indicator, IndicatorGroup
from gap_harvester.models.harvester import UsingExposedAPI


class IndicatorManagementView(AdminView):
    """Indicator Management View."""

    template_name = 'admin/indicator/management.html'

    @property
    def content_title(self):
        """Return content title."""
        return 'Indicator Management'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        indicators_in_groups = {
            group.name: group.indicator_set.all()
            for group in IndicatorGroup.objects.all()
        }
        context.update(
            {
                'indicators_in_groups': indicators_in_groups,
                'external_exposed_api': UsingExposedAPI[0]
            }
        )
        return context