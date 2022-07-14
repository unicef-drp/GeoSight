"""Dashboard Create View."""
from braces.views import LoginRequiredMixin
from django.db import transaction
from django.http import HttpResponseBadRequest
from django.shortcuts import redirect, reverse

from frontend.views.dashboard._base import BaseDashboardView
from geosight.data.api.dashboard import CREATE_SLUG
from geosight.data.forms.dashboard import DashboardForm
from geosight.data.models.dashboard import Dashboard


class DashboardCreateView(LoginRequiredMixin, BaseDashboardView):
    """Dashboard Detail View."""

    template_name = 'frontend/admin/dashboard/editor.html'

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Create Project'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        return '<span>Projects</span> <span>></span> <span>Create</span>'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        context['dashboard'] = {'id': CREATE_SLUG}
        return context

    def post(self, request, **kwargs):
        """Create dashboard."""
        data = DashboardForm.update_data(
            request.POST.copy().dict()
        )
        data['creator'] = request.user
        try:
            Dashboard.objects.get(slug=data['slug'])
            return HttpResponseBadRequest(
                f'Dashboard with name {data["name"]} '
                f'is exist. Please choose other name.'
            )
        except Dashboard.DoesNotExist:
            form = DashboardForm(data, request.FILES)
            if form.is_valid():
                try:
                    with transaction.atomic():
                        dashboard = form.save()
                        dashboard.save_relations(data)
                        return redirect(
                            reverse(
                                'dashboard-edit-view', args=[dashboard.slug]
                            )
                        )
                except Exception as e:
                    return HttpResponseBadRequest(e)
            else:
                errors = [
                    key + ' : ' + ''.join(value) for key, value in
                    form.errors.items()
                ]
                return HttpResponseBadRequest('<br>'.join(errors))
