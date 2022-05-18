"""Dashboard urls."""
from django.conf.urls import url
from django.urls import include

from frontend.views.dashboard.detail import DashboardDetailView

dashboard_url = [
    url(
        r'^(?P<slug>[^/]+)',
        DashboardDetailView.as_view(),
        name='dashboard-detail-view'
    ),
]
urlpatterns = [
    url(r'^dashboard/', include(dashboard_url)),
]
