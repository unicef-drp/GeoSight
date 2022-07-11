"""Dashboard urls."""
from django.conf.urls import url

from frontend.views.admin.dashboard.list import DashboardListView

urlpatterns = [
    url(
        r'^',
        DashboardListView.as_view(),
        name='admin-dashboard-list-view'
    ),
]
