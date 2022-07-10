"""Admin Basemaps List View."""

from braces.views import SuperuserRequiredMixin

from frontend.views._base import BaseView


class BasemapListView(SuperuserRequiredMixin, BaseView):
    """Basemap Detail View."""

    template_name = 'frontend/admin/basemap/list.html'

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Basemaps'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        return 'Basemaps'
