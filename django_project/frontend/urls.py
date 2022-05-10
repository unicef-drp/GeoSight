"""GAP Dashboard urls."""
from django.conf.urls import url

from frontend.views.dashboard.detail import DashboardDetailView

urlpatterns = [
    url(
        r'^',
        DashboardDetailView.as_view(),
        name='dashboard-detail-view'
    ),
]
