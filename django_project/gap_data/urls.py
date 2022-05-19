"""GAP Data urls."""
from django.conf.urls import url
from django.urls import include

from gap_dashboard.views.backups import BackupsView
from gap_dashboard.views.instances import InstancesView
from gap_data.api.dashboard import DashboardData, DashboardReferenceGeojson
from gap_data.api.download_file import (
    DownloadSharepointFile,
    DownloadBackupsFile
)
from gap_data.api.geometry import GeometryGeojsonAPI, GeometryDetailAPI
from gap_data.api.indicator import (
    IndicatorValues, IndicatorValuesByGeometryAndLevel,
    IndicatorValuesByDateAndGeojson, IndicatorValuesByDate,
    IndicatorValuesByGeometry, IndicatorValuesBatch,
    IndicatorShow, IndicatorHide, IndicatorDetailAPI
)

geometry_api = [
    url(
        r'^(?P<geometry_level>.+)/(?P<date>.+).geojson',
        GeometryGeojsonAPI.as_view(),
        name='geometry-geojson-api'
    ),
    url(
        r'^(?P<pk>.+)',
        GeometryDetailAPI.as_view(),
        name='geometry-detail-api'
    ),
]
indicator_api = [
    url(
        r'^(?P<pk>\d+)/values/by-geometry/(?P<geometry_pk>\d+)/',
        IndicatorValuesByGeometry.as_view(),
        name='indicator-values-by-geometry'
    ),
    url(
        r'^(?P<pk>\d+)/values/(?P<geometry_identifier>.+)/(?P<geometry_level>.+)/(?P<date>.+).geojson',
        # noqa: E501
        IndicatorValuesByDateAndGeojson.as_view(),
        name='indicator-values-by-date-geojson-api'
    ),
    url(
        r'^(?P<pk>\d+)/values/(?P<geometry_identifier>.+)/(?P<geometry_level>.+)/(?P<date>.+)',
        # noqa: E501
        IndicatorValuesByDate.as_view(),
        name='indicator-values-by-date-api'
    ),
    url(
        r'^(?P<pk>\d+)/values/(?P<geometry_identifier>.+)/(?P<geometry_level>.+)',
        # noqa: E501
        IndicatorValuesByGeometryAndLevel.as_view(),
        name='indicator-values-by-geometry-and-level-api'
    ),
    url(
        r'^(?P<pk>\d+)/values/batch',
        IndicatorValuesBatch.as_view(), name='indicator-values-batch-api'
    ),
    url(
        r'^(?P<pk>\d+)/values',
        IndicatorValues.as_view(), name='indicator-values-api'
    ),
    url(
        r'^(?P<pk>\d+)/show',
        IndicatorShow.as_view(), name='indicator-show-api'
    ),
    url(
        r'^(?P<pk>\d+)/hide',
        IndicatorHide.as_view(), name='indicator-hide-api'
    ),
    url(
        r'^(?P<pk>\d+)',
        IndicatorDetailAPI.as_view(), name='indicator-detail-api'
    ),
]

api = [
    url(
        r'^dashboard/(?P<slug>[^/]+)/reference-layer.geojson$',
        DashboardReferenceGeojson.as_view(),
        name='dashboard-ref-layer-api'
    ),
    url(
        r'^dashboard/(?P<slug>[^/]+)$',
        DashboardData.as_view(),
        name='dashboard-data-api'
    ),
    
    url(r'^geometry/', include(geometry_api)),
    url(r'^indicator/', include(indicator_api)),
    url(
        r'^download/sharepoint',
        DownloadSharepointFile.as_view(),
        name='download-sharepoint'
    ),
]

urlpatterns = [
    url(r'^backups', BackupsView.as_view(), name='backups-view'),
    url(
        r'^download/backups',
        DownloadBackupsFile.as_view(),
        name='download-backups'
    ),
    url(r'^api/', include(api)),
    url(r'^', include('gap_harvester.urls')),
    url(r'^', include('gap_dashboard.urls')),
    url(r'^', InstancesView.as_view(), name='instances-view'),
]
