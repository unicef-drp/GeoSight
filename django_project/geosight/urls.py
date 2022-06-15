"""GeoSight urls."""
from django.conf.urls import url
from django.urls import include

urlpatterns = [
    url(r'^', include('geosight.harvester.urls')),
    url(r'^', include('geosight.data.urls')),
]
