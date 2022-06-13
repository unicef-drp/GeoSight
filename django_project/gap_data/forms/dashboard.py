"""Dashboard form."""
import json

from django import forms
from django.contrib.gis.geos import Polygon
from django.template.defaultfilters import slugify

from gap_data.models.basemap_layer import BasemapLayer
from gap_data.models.context_layer import ContextLayer
from gap_data.models.dashboard import Dashboard
from gap_data.models.indicator import Indicator
from gap_data.models.reference_layer import ReferenceLayer


class DashboardForm(forms.ModelForm):
    """Dashboard form."""

    slug = forms.SlugField()
    basemap_layers = forms.ModelMultipleChoiceField(
        queryset=BasemapLayer.objects.all()
    )
    indicators = forms.ModelMultipleChoiceField(
        queryset=Indicator.objects.all()
    )
    context_layers = forms.ModelMultipleChoiceField(
        queryset=ContextLayer.objects.all(),
        required=False
    )

    class Meta:  # noqa: D106
        model = Dashboard
        fields = '__all__'

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
        data['reference_layer'] = ReferenceLayer.objects.get(
            id=other_data['referenceLayer']
        )
        data['indicators'] = other_data['indicators']
        data['basemap_layers'] = other_data['basemapsLayers']
        data['default_basemap_layer'] = BasemapLayer.objects.get(
            id=other_data['defaultBasemapLayer']
        )
        data['context_layers'] = other_data['contextLayers']
        data['widgets'] = other_data['widgets']

        data['filters'] = json.dumps(other_data['filters'])
        return data
