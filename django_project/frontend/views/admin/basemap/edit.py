"""Admin Basemap Edit View."""

from braces.views import SuperuserRequiredMixin
from django.shortcuts import get_object_or_404
from django.shortcuts import redirect, reverse, render

from frontend.views._base import BaseView
from geosight.data.forms.basemap import BasemapForm
from geosight.data.models.basemap_layer import BasemapLayer


class BasemapEditView(SuperuserRequiredMixin, BaseView):
    """Basemap Edit View."""

    template_name = 'frontend/admin/basemap/form.html'

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Edit Basemap'

    @property
    def content_title(self):
        """Return content title that used on page title basemap."""
        basemap = get_object_or_404(
            BasemapLayer, id=self.kwargs.get('pk', '')
        )
        return (
            f'<span>Basemap</span> <span>></span> '
            f'<span>{basemap.__str__()}</span>'
        )

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        basemap = get_object_or_404(
            BasemapLayer, id=self.kwargs.get('pk', '')
        )

        context.update(
            {
                'form': BasemapForm(
                    initial=BasemapForm.model_to_initial(basemap)
                )
            }
        )
        return context

    def post(self, request, **kwargs):
        """Edit basemap."""
        basemap = get_object_or_404(
            BasemapLayer, id=self.kwargs.get('pk', '')
        )
        form = BasemapForm(
            request.POST,
            instance=basemap
        )
        if form.is_valid():
            form.save()
            return redirect(reverse('admin-basemap-list-view'))
        context = self.get_context_data(**kwargs)
        context['form'] = form
        return render(request, self.template_name, context)
