"""Indicators urls."""
from django.conf.urls import url
from django.urls import include

from frontend.views.admin.harvesters import HarvesterIndicatorDetail
from frontend.views.admin.harvesters.forms import (
    HarvestedUsingExposedAPIByExternalClientView
)
from frontend.views.admin.indicator.create import IndicatorCreateView
from frontend.views.admin.indicator.edit import IndicatorEditView
from frontend.views.admin.indicator.list import IndicatorListView

harvester_form_url = [
    url(
        r'^update/harvested-using-exposed-api-by-external-client',
        HarvestedUsingExposedAPIByExternalClientView.as_view(),
        name=str(
            HarvestedUsingExposedAPIByExternalClientView.harvester_class
        ).split("'")[1]
    ),
    url(
        r'^',
        HarvesterIndicatorDetail.as_view(),
        name='harvester-indicator-detail'
    ),
]
admin_indicator_detail_url = [
    url(
        r'^edit',
        IndicatorEditView.as_view(),
        name='admin-indicator-edit-view'
    ),
    url(
        r'^harvester/',
        include(harvester_form_url)
    ),
]
urlpatterns = [
    url(r'^(?P<pk>\d+)/', include(admin_indicator_detail_url)),
    url(
        r'^create',
        IndicatorCreateView.as_view(),
        name='admin-indicator-create-view'
    ),
    url(
        r'^',
        IndicatorListView.as_view(),
        name='admin-indicator-list-view'
    ),
]
