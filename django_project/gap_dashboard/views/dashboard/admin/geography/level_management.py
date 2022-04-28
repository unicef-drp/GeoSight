import json

from django.shortcuts import get_object_or_404, redirect, reverse

from gap_dashboard.views.dashboard.admin._base import AdminView
from gap_data.models.geometry import GeometryLevelName, GeometryLevelInstance
from gap_data.models.instance import Instance


class GeographyLevelManagementView(AdminView):
    template_name = 'dashboard/admin/geography/level-management.html'

    @property
    def content_title(self):
        return 'Level Management'

    def get_context_data(self, **kwargs) -> dict:
        context = super().get_context_data(**kwargs)
        level_in_tree = self.instance.geometry_levels_in_tree
        context.update({
            'level_in_tree': level_in_tree,
            'levels': GeometryLevelName.objects.all()
        })
        return context

    def post(self, request, **kwargs):
        self.instance = get_object_or_404(
            Instance, slug=kwargs.get('slug', '')
        )
        levels = request.POST.get('levels', None)
        if levels:
            levels = json.loads(levels)
            self.instance.geometry_instance_levels.delete()

            self.save_level_tree(None, levels)
        return redirect(
            reverse(
                'geography-level-management-view', args=[self.instance.slug]
            )
        )

    def save_level_tree(self, parent_id, level_data):
        for id, value in level_data.items():
            GeometryLevelInstance.objects.get_or_create(
                instance=self.instance,
                level_id=id,
                parent_id=parent_id
            )
            self.save_level_tree(id, value)
