"""Dashboard urls."""
from django.conf.urls import url
from django.urls import include

from frontend.views.dashboard.create import DashboardCreateView
from frontend.views.dashboard.detail import DashboardDetailView
from frontend.views.dashboard.edit import DashboardEditView

dashboard_url = [
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
urlpatterns = [
    url(r'^dashboard/', include(dashboard_url)),
]
