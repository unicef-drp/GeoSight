from braces.views import SuperuserRequiredMixin

from gap_dashboard.views._base import BaseView


class InstanceManagementView(BaseView, SuperuserRequiredMixin):
    template_name = 'dashboard/admin/instance/management.html'

    @property
    def content_title(self):
        return 'Instance Management'

    @property
    def page_title(self):
        return 'Instance Management View'
