"""Admin ContextLayer Create View."""

from braces.views import SuperuserRequiredMixin
from django.shortcuts import redirect, reverse, render

from frontend.views._base import BaseView
from geosight.data.forms.context_layer import ContextLayerForm
from geosight.data.models.context_layer import ContextLayer


class ContextLayerCreateView(SuperuserRequiredMixin, BaseView):
    """ContextLayer Create View."""

    template_name = 'frontend/admin/context_layer/form.html'

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Create Context Layer'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        return '<span>Context Layer</span> <span>></span> <span>Create</span>'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        rules = []
        initial = None

        # from_id used for duplication
        from_id = self.request.GET.get('from')
        if from_id:
            try:
                model = ContextLayer.objects.get(id=from_id)
                initial = ContextLayerForm.model_to_initial(model)
                initial['name'] = None
                initial['description'] = None
                rules = model.rules_dict()
            except ContextLayer.DoesNotExist:
                pass

        context.update(
            {
                'form': ContextLayerForm(initial=initial),
                'rules': rules
            }
        )
        return context

    def post(self, request, **kwargs):
        """Create indicator."""
        form = ContextLayerForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect(reverse('admin-context-layer-list-view'))
        context = self.get_context_data(**kwargs)
        context['form'] = form
        return render(
            request,
            self.template_name,
            context
        )
