"""Instance Management View."""
from braces.views import SuperuserRequiredMixin

from gap_dashboard.views._base import BaseView


class InstanceManagementView(BaseView, SuperuserRequiredMixin):
    """Instance Management View."""

    template_name = 'dashboard/admin/instance/management.html'

    @property
    def content_title(self):
        """Return content title."""
        return 'Instance Management'

    @property
    def page_title(self):
        """Return page title."""
        return 'Instance Management View'
