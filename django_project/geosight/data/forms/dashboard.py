"""Dashboard form."""
import json

from django import forms
from django.contrib.gis.geos import Polygon
from django.template.defaultfilters import slugify

from geosight.data.models.dashboard import Dashboard, DashboardGroup


class DashboardForm(forms.ModelForm):
    """Dashboard form."""

    slug = forms.SlugField()
    group = forms.ChoiceField(
        label='Category',
        required=False,
        widget=forms.Select(
            attrs={'data-autocreated': 'True'}
        )
    )

    class Meta:  # noqa: D106
        model = Dashboard
        # fields = '__all__'
        exclude = (
            'basemap_layers', 'default_basemap_layer', 'indicators',
            'context_layers')

    def __init__(self, *args, **kwargs):
        """Init."""
        super().__init__(*args, **kwargs)
        self.fields['group'].choices = [
            (group.name, group.name)
            for group in DashboardGroup.objects.all().order_by('name')
        ]

        try:
            if self.data['group']:
                self.fields['group'].choices += [
                    (self.data['group'], self.data['group'])
                ]
        except KeyError:
            pass

    def clean_group(self):
        """Return group."""
        group, created = DashboardGroup.objects.get_or_create(
            name=self.cleaned_data['group']
        )
        return group

    @staticmethod
    def update_data(data):
        """Update data from POST data."""
        data['slug'] = slugify(data['name'])
        other_data = json.loads(data['data'])

        # save polygon
        poly = Polygon.from_bbox(other_data['extent'])
        poly.srid = 4326
        data['extent'] = poly

        # save others data
        data['reference_layer_identifier'] = other_data['referenceLayer']

        data['indicators'] = other_data['indicators']
        data['basemapsLayers'] = other_data['basemapsLayers']
        data['contextLayers'] = other_data['contextLayers']
        data['widgets'] = other_data['widgets']

        data['filters'] = json.dumps(other_data['filters'])
        return data
