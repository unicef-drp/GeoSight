"""Indicators urls."""
from django.conf.urls import url
from django.urls import include

from frontend.views.admin.basemap.create import BasemapCreateView
from frontend.views.admin.basemap.edit import BasemapEditView
from frontend.views.admin.basemap.list import BasemapListView

admin_detail_url = [
    url(
        r'^edit',
        BasemapEditView.as_view(),
        name='admin-basemap-edit-view'
    ),
]
urlpatterns = [
    url(r'^(?P<pk>\d+)/', include(admin_detail_url)),
    url(
        r'^create',
        BasemapCreateView.as_view(),
        name='admin-basemap-create-view'
    ),
    url(
        r'^',
        BasemapListView.as_view(),
        name='admin-basemap-list-view'
    ),
]
