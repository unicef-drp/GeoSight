from abc import ABC

from braces.views import SuperuserRequiredMixin

from gap_dashboard.views.dashboard._base import BaseDashboardView


class AdminView(BaseDashboardView, ABC, SuperuserRequiredMixin):
    """Admin view that has base dashboard functions."""

    pass
