"""Dashboard urls."""
from django.conf.urls import url

from frontend.views.dashboard.create import DashboardCreateView
from frontend.views.dashboard.detail import DashboardDetailView
from frontend.views.dashboard.edit import DashboardEditView

urlpatterns = [
    url(
        r'^create',
        DashboardCreateView.as_view(),
        name='dashboard-create-view'
    ),
    url(
        r'^(?P<slug>[^/]+)/edit',
        DashboardEditView.as_view(),
        name='dashboard-edit-view'
    ),
    url(
        r'^(?P<slug>[^/]+)',
        DashboardDetailView.as_view(),
        name='dashboard-detail-view'
    ),
]
