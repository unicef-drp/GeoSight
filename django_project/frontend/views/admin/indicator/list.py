"""Admin Indicators List View."""

from braces.views import SuperuserRequiredMixin

from frontend.views._base import BaseView


class IndicatorListView(SuperuserRequiredMixin, BaseView):
    """Indicator Detail View."""

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Indicators'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        return 'Indicators'
