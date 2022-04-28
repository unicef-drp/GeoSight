from django.shortcuts import reverse, render, get_object_or_404

from gap_dashboard.views.dashboard.admin._base import AdminView
from gap_data.models.instance import Instance


class GeographyView(AdminView):
    template_name = 'dashboard/admin/geography/view.html'

    @property
    def content_title(self):
        return 'Management: Geography View'

    def get_context_data(self, **kwargs) -> dict:
        context = super().get_context_data(**kwargs)
        context.update(
            {
                'instance_levels': self.instance.geometry_levels_in_order,
                'url': reverse(
                    'geometry-geojson-api', args=[
                        self.instance.slug, 'level', 'date'
                    ]
                )
            }
        )
        return context

    def post(self, request, **kwargs):
        self.instance = get_object_or_404(
            Instance, slug=kwargs.get('slug', '')
        )
        data = request.POST
        context = self.get_context_data(**kwargs)
        for geometry in self.instance.geometries():
            if f'{geometry.id}_name' in data:
                name = data.get(f'{geometry.id}_name', None)
                alias = data.get(f'{geometry.id}_name', None)
                dashboard_link = data.get(
                    f'{geometry.id}_dashboard_link', None
                )
                if name is not None:
                    geometry.name = name
                if alias is not None:
                    geometry.alias = alias
                if dashboard_link is not alias:
                    geometry.dashboard_link = dashboard_link
                geometry.save()
        return render(
            request,
            self.template_name,
            context
        )
