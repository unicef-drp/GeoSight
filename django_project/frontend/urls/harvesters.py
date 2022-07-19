"""Basemap urls."""
from django.conf.urls import url
from django.urls import include

from frontend.views.admin.harvesters import MetaIngestorForm

ingestor_url = [
    url(
        r'^(?P<uuid>[0-9a-f-]+)',
        MetaIngestorForm.as_view(),
        name='meta-ingestor-uuid-form'
    ),
    url(
        r'^',
        MetaIngestorForm.as_view(),
        name='meta-ingestor-form'
    ),
]
meta_ingestor_url = [
    url(r'^meta-ingestor/', include(ingestor_url)),
]
urlpatterns = [
    url(r'^ingestor/', include(meta_ingestor_url)),
]
