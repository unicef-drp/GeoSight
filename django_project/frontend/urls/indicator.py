"""Indicators urls."""
from django.conf.urls import url
from django.urls import include

from frontend.views.admin.indicator.create import IndicatorCreateView
from frontend.views.admin.indicator.edit import IndicatorEditView
from frontend.views.admin.indicator.list import IndicatorListView

admin_indicator_detail_url = [
    url(
        r'^edit',
        IndicatorEditView.as_view(),
        name='admin-indicator-edit-view'
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
