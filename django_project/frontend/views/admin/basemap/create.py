"""Admin Basemap Create View."""

from braces.views import SuperuserRequiredMixin
from django.shortcuts import redirect, reverse, render

from frontend.views._base import BaseView
from geosight.data.forms.basemap import BasemapForm
from geosight.data.models.basemap_layer import BasemapLayer


class BasemapCreateView(SuperuserRequiredMixin, BaseView):
    """Basemap Create View."""

    template_name = 'frontend/admin/basemap/form.html'

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Create Basemap'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        return '<span>Basemap</span> <span>></span> <span>Create</span>'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        rules = []
        initial = None

        # from_id used for duplication
        from_id = self.request.GET.get('from')
        if from_id:
            try:
                model = BasemapLayer.objects.get(id=from_id)
                initial = BasemapForm.model_to_initial(model)
                initial['name'] = None
                initial['description'] = None
                rules = model.rules_dict()
            except BasemapLayer.DoesNotExist:
                pass

        context.update(
            {
                'form': BasemapForm(initial=initial),
                'rules': rules
            }
        )
        return context

    def post(self, request, **kwargs):
        """Create indicator."""
        form = BasemapForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect(reverse('admin-basemap-list-view'))
        context = self.get_context_data(**kwargs)
        context['form'] = form
        return render(
            request,
            self.template_name,
            context
        )
