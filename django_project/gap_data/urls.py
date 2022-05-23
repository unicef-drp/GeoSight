"""GAP Data urls."""
from django.conf.urls import url
from django.urls import include

from gap_dashboard.views.backups import BackupsView
from gap_dashboard.views.dashboard import DashboardListView
from gap_data.api.basemap import BasemapListAPI
from gap_data.api.dashboard import DashboardData
from gap_data.api.download_file import (
    DownloadSharepointFile,
    DownloadBackupsFile
)
from gap_data.api.indicator import (
    IndicatorListAPI,
    IndicatorDetailAPI, IndicatorValuesAPI
)
from gap_data.api.reference_layer import (
    ReferenceLayerGeojson, ReferenceLayerListAPI
)

indicator_api = [
    url(
        r'^list',
        IndicatorListAPI.as_view(), name='indicator-list-api'
    ),
    url(
        r'^(?P<pk>\d+)/values/latest',
        IndicatorValuesAPI.as_view(), name='indicator-values-api'
    ),
    url(
        r'^(?P<pk>\d+)',
        IndicatorDetailAPI.as_view(), name='indicator-detail-api'
    ),
]

api = [
    url(
        r'^basemap/list$',
        BasemapListAPI.as_view(),
        name='basemap-list-api'
    ),
    url(
        r'^reference-layer/list$',
        ReferenceLayerListAPI.as_view(),
        name='reference-layer-list-api'
    ),
    url(
        r'^reference-layer/(?P<uuid>[0-9a-f-]+)/(?P<level>.+)$',
        ReferenceLayerGeojson.as_view(),
        name='reference-layer-api'
    ),
    url(
        r'^dashboard/(?P<slug>[^/]+)$',
        DashboardData.as_view(),
        name='dashboard-data-api'
    ),

    url(r'^indicator/', include(indicator_api)),
]

download = [
    url(
        r'^sharepoint',
        DownloadSharepointFile.as_view(),
        name='download-sharepoint'
    ),
    url(
        r'^backups',
        DownloadBackupsFile.as_view(),
        name='download-backups'
    ),
]
urlpatterns = [
    url(r'^backups', BackupsView.as_view(), name='backups-view'),
    url(r'^download/', include(download)),
    url(r'^api/', include(api)),
    url(r'^', include('gap_harvester.urls')),
    url(r'^', include('gap_dashboard.urls')),
    url(r'^', DashboardListView.as_view(), name='dashboard-view'),
]
