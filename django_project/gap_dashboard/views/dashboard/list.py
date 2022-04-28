from gap_dashboard.views.dashboard._base import BaseDashboardView


class DashboardListView(BaseDashboardView):
    template_name = 'dashboard/list.html'

    @property
    def content_title(self):
        return 'Dashboard list'
