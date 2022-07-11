"""Dashboard urls."""
from django.conf.urls import url

from frontend.views.dashboard.detail import DashboardDetailView

urlpatterns = [
    url(
        r'^(?P<slug>[^/]+)',
        DashboardDetailView.as_view(),
        name='dashboard-detail-view'
    ),
]
