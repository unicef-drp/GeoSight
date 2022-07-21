"""Basemap urls."""
from django.conf.urls import url
from django.urls import include

from frontend.views.admin.harvesters import HarvesterDetail
from frontend.views.admin.harvesters import MetaIngestorForm

ingestor_url = [
    url(
        r'form/(?P<uuid>[0-9a-f-]+)',
        MetaIngestorForm.as_view(),
        name='meta-ingestor-uuid-form'
    ),
    url(
        r'form',
        MetaIngestorForm.as_view(),
        name='meta-ingestor-form'
    ),
    url(
        r'^(?P<uuid>[0-9a-f-]+)',
        HarvesterDetail.as_view(),
        name='meta-ingestor-detail'
    ),
]
meta_ingestor_url = [
    url(r'^meta-ingestor/', include(ingestor_url)),
]
urlpatterns = [
    url(r'^ingestor/', include(meta_ingestor_url)),
]
