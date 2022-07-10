"""Home View."""

from django.conf import settings
from django.shortcuts import reverse

from frontend.views._base import BaseView
from geosight.data.models.dashboard import Dashboard


class HomePageView(BaseView):
    """Home Create View."""

    template_name = 'frontend/home.html'

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Home'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        return 'Home'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        context['dashboards'] = []
        if self.request.user.is_superuser:
            context['dashboards'] = [
                {
                    'slug': dashboard.slug,
                    'name': dashboard.name,
                    'description': dashboard.description,
                    'icon': dashboard.icon.url if dashboard.icon else (
                            settings.STATIC_URL + "img/no-image.jpeg"
                    ),
                    'url': reverse(
                        'dashboard-detail-view',
                        args=[dashboard.slug]
                    ),
                    'edit_url': reverse(
                        'dashboard-edit-view',
                        args=[dashboard.slug]
                    ) if dashboard.can_edit(self.request.user) else ''
                }
                for dashboard in Dashboard.objects.all().order_by('slug')
            ]
        return context
