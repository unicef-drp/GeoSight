import uuid

from django.contrib.gis.geos import GEOSGeometry, MultiPolygon, Polygon
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.shortcuts import redirect, reverse, render, get_object_or_404

from gap_dashboard.forms.geometry import GeometryForm, ADD_JUST_NEW
from gap_dashboard.views.dashboard.admin._base import AdminView
from gap_data.models.geometry import (
    Geometry, GeometryLevelInstance
)
from gap_data.models.geometry_uploader import (
    GeometryUploader, GeometryUploaderLog, GeometryUploaderFile
)
from gap_data.models.instance import Instance


class GeographyUploadView(AdminView):
    template_name = 'dashboard/admin/geography/upload.html'

    @property
    def content_title(self):
        return 'Upload Geography'

    def get_context_data(self, **kwargs) -> dict:
        context = super().get_context_data(**kwargs)
        context.update(
            {
                'instance_levels': self.instance.geometry_levels_in_order,
                'url': reverse(
                    'geometry-geojson-api', args=[
                        self.instance.slug, 'level', 'date'
                    ]
                ),
                'form': GeometryForm(
                    level=self.instance.geometry_levels_in_order
                )
            }
        )
        return context

    def post(self, request, **kwargs):
        self.instance = get_object_or_404(
            Instance, slug=kwargs.get('slug', '')
        )
        form_uuid = uuid.uuid4()
        form = GeometryForm(
            request.POST, request.FILES,
            level=self.instance.geometry_levels_in_order,
            uuid=form_uuid)
        for _file in request.FILES.getlist('file'):
            default_storage.save(
                form.temporary_filename(_file.name), ContentFile(_file.read())
            )
        if form.is_valid():
            file = form.cleaned_data['file']
            instance_geometries = self.instance.geometries()
            geometries = instance_geometries.filter(
                geometry_level=form.cleaned_data['level']
            )
            try:
                instance_levels = self.instance.geometry_instance_levels
                instance_level = instance_levels.get(
                    level=form.cleaned_data['level']
                )
                is_most_top_level = instance_level.parent is None
            except GeometryLevelInstance.DoesNotExist:
                return

            # save data
            uploader = GeometryUploader.objects.create()
            for _file in request.FILES.getlist('file'):
                GeometryUploaderFile.objects.create(
                    uploader=uploader,
                    file=_file
                )
            level = form.cleaned_data['level']
            for feature in file['features']:
                try:
                    properties = feature['properties']
                    identifier = properties['identifier']
                    name = properties['name']
                    parent_identifier = properties['parent_identifier']
                    if form.cleaned_data['replace_method'] == ADD_JUST_NEW:
                        try:
                            geometries.get(
                                identifier__iexact=identifier,
                                geometry_level=level
                            )
                            note = 'Geometry exist'
                        except Geometry.DoesNotExist:
                            try:
                                parent = None
                                if not is_most_top_level:
                                    parent = instance_geometries.get(
                                        identifier__iexact=parent_identifier,
                                        geometry_level=instance_level.parent
                                    )
                                geometry = GEOSGeometry(
                                    str(feature['geometry'])
                                )
                                if isinstance(geometry, Polygon):
                                    geometry = MultiPolygon(geometry)
                                Geometry.objects.get_or_create(
                                    instance=self.instance,
                                    identifier=identifier,
                                    geometry_level=level,
                                    defaults={
                                        'name': name,
                                        'child_of': parent,
                                        'geometry': GEOSGeometry(geometry)
                                    }
                                )
                                note = 'Geometry created'
                            except Geometry.DoesNotExist:
                                note = (
                                    f'Parent {parent_identifier} '
                                    f'does not exist'
                                )

                        GeometryUploaderLog.objects.create(
                            uploader=uploader,
                            identifier=identifier,
                            note=note
                        )
                except Exception as e:
                    print(f'{e}')

            return redirect(
                reverse(
                    'geography-management-view', args=[self.instance.slug]
                )
            )
        context = self.get_context_data(**kwargs)
        context['form'] = form
        return render(
            request,
            self.template_name,
            context
        )
