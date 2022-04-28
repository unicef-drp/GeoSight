"""Instance Editor View."""
from django.shortcuts import redirect, reverse, render, get_object_or_404

from gap_dashboard.forms.instance import InstanceForm
from gap_dashboard.views.dashboard.admin._base import AdminView
from gap_data.models import Instance


class InstanceEditView(AdminView):
    """Instance Editor View."""

    template_name = 'dashboard/admin/instance/form.html'

    @property
    def content_title(self):
        """Return content title."""
        return ''

    @property
    def page_title(self):
        """Return page title."""
        return 'Edit Instance'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        context.update(
            {
                'form': InstanceForm(
                    initial=InstanceForm.model_to_initial(self.instance)
                )
            }
        )
        return context

    def post(self, request, **kwargs):
        """Edit an instance."""
        self.instance = get_object_or_404(
            Instance, slug=kwargs.get('slug', '')
        )

        form = InstanceForm(
            request.POST,
            request.FILES,
            instance=self.instance
        )
        if form.is_valid():
            instance = form.save()
            if request.POST.get('icon_delete', None):
                instance.icon = None
                instance.save()
            return redirect(
                reverse(
                    'instance-management-view'
                )
            )
        context = self.get_context_data(**kwargs)
        context['form'] = form
        return render(
            request,
            self.template_name,
            context
        )
