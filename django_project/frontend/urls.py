"""GAP Dashboard urls."""
from django.conf.urls import url

from frontend.views.counter import CounterView
from frontend.views.dashboard.detail import DashboardDetailView

urlpatterns = [
    url(
        r'^counter',
        CounterView.as_view(),
        name='counter-view'
    ),
    url(
        r'^',
        DashboardDetailView.as_view(),
        name='dashboard-detail-view'
    ),
]
