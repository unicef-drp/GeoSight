"""Dashboard Edit View."""

from braces.views import LoginRequiredMixin
from django.core.exceptions import PermissionDenied
from django.http import HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.shortcuts import redirect, reverse

from frontend.views.dashboard._base import BaseDashboardView
from geosight.data.forms.dashboard import DashboardForm
from geosight.data.models.dashboard import Dashboard


class DashboardEditView(LoginRequiredMixin, BaseDashboardView):
    """Dashboard Edit View."""

    template_name = 'frontend/dashboard/view.html'

    @property
    def content_title(self):
        """Return content title."""
        return 'Dashboard crate'

    def get_context_data(self, slug, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        dashboard = get_object_or_404(
            Dashboard, slug=slug
        )
        if not dashboard.can_edit(self.request.user):
            raise PermissionDenied()

        context['dashboard'] = {'id': dashboard.slug}
        context['edit_mode'] = True
        return context

    def post(self, request, slug, **kwargs):
        """Create dashboard."""
        data = DashboardForm.update_data(request.POST.copy().dict())
        dashboard = get_object_or_404(
            Dashboard, slug=slug
        )
        data['creator'] = dashboard.creator
        try:
            Dashboard.objects.exclude(id=dashboard.id).get(slug=data['slug'])
            return HttpResponseBadRequest(
                f'Dashboard with name {data["name"]} is exist. '
                f'Please choose other name.'
            )
        except Dashboard.DoesNotExist:
            form = DashboardForm(
                data, request.FILES, instance=dashboard
            )
            if form.is_valid():
                dashboard = form.save()
                dashboard.save_widgets(data['widgets'])
                return redirect(
                    reverse(
                        'dashboard-detail-view', args=[dashboard.slug]
                    )
                )
            else:
                return HttpResponseBadRequest("There is error on form.")
