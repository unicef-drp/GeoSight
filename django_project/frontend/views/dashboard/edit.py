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

    template_name = 'frontend/admin/dashboard/editor.html'

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Edit Project'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        dashboard = get_object_or_404(
            Dashboard, slug=self.kwargs.get('slug', '')
        )
        return (
            f'<span>Projects</span> <span>></span> '
            f'<span>{dashboard.__str__()}</span>'
        )

    def get_context_data(self, slug, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        dashboard = get_object_or_404(
            Dashboard, slug=slug
        )
        if not dashboard.can_edit(self.request.user):
            raise PermissionDenied()

        context['dashboard'] = {'id': dashboard.slug}
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
                dashboard.save_relations(data)
                return redirect(
                    reverse(
                        'dashboard-edit-view', args=[dashboard.slug]
                    )
                )
            else:
                errors = [
                    key + ' : ' + ''.join(value) for key, value in
                    form.errors.items()
                ]
                return HttpResponseBadRequest('<br>'.join(errors))
