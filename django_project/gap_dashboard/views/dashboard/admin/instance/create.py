from braces.views import SuperuserRequiredMixin
from django.shortcuts import redirect, reverse, render

from gap_dashboard.forms.instance import InstanceForm
from gap_dashboard.views._base import BaseView


class InstanceCreateView(BaseView, SuperuserRequiredMixin):
    template_name = 'dashboard/admin/instance/form.html'

    @property
    def content_title(self):
        return f''

    @property
    def page_title(self):
        return f'Create New Instance'

    def get_context_data(self, **kwargs) -> dict:
        context = super().get_context_data(**kwargs)
        context.update(
            {
                'form': InstanceForm(),
                'is_create': True
            }
        )
        return context

    def post(self, request, **kwargs):
        form = InstanceForm(
            request.POST,
            request.FILES
        )
        if form.is_valid():
            form.save()
            return redirect(
                reverse(
                    'instance-management-view'
                )
            )
        context = self.get_context_data(**kwargs)
        context['form'] = form
        context['is_create'] = True
        return render(
            request,
            self.template_name,
            context
        )
