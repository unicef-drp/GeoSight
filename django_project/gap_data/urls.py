"""GAP Data urls."""
from django.conf.urls import url
from django.urls import include

from gap_dashboard.views.backups import BackupsView
from gap_dashboard.views.dashboard.admin.instance import (
    InstanceCreateView
)
from gap_dashboard.views.dashboard.admin.instance import InstanceManagementView
from gap_dashboard.views.instances import InstancesView
from gap_data.api.context_analysis import ContextAnalysisData
from gap_data.api.dashboard import DashboardData
from gap_data.api.download import DownloadMasterData, DownloadMasterDataCheck
from gap_data.api.download_file import DownloadSharepointFile, \
    DownloadBackupsFile
from gap_data.api.geometry import GeometryGeojsonAPI, GeometryDetailAPI
from gap_data.api.indicator import (
    IndicatorValues, IndicatorValuesByGeometryAndLevel,
    IndicatorValuesByDateAndGeojson, IndicatorValuesByDate,
    IndicatorValuesByGeometry, IndicatorReportingUnits, IndicatorValuesBatch,
    IndicatorShow, IndicatorHide, IndicatorDetailAPI
)
from gap_data.api.indicators import IndicatorsValuesByGeometryDate, \
    IndicatorsList

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
        r'^(?P<pk>\d+)/values/(?P<geometry_identifier>.+)/(?P<geometry_level>.+)/(?P<date>.+).geojson',  # noqa: E501
        IndicatorValuesByDateAndGeojson.as_view(),
        name='indicator-values-by-date-geojson-api'
    ),
    url(
        r'^(?P<pk>\d+)/values/(?P<geometry_identifier>.+)/(?P<geometry_level>.+)/(?P<date>.+)',  # noqa: E501
        IndicatorValuesByDate.as_view(),
        name='indicator-values-by-date-api'
    ),
    url(
        r'^(?P<pk>\d+)/values/(?P<geometry_identifier>.+)/(?P<geometry_level>.+)',  # noqa: E501
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
        r'^(?P<pk>\d+)/reporting-units',
        IndicatorReportingUnits.as_view(), name='indicator-reporting-units-api'
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
    url(
        r'^',
        IndicatorsList.as_view(), name='indicator-list-api'
    ),
]
indicators_api = [
    # API for returning all indicators
    url(
        r'^values/(?P<geometry_identifier>.+)/(?P<geometry_level>.+)/(?P<date>.+)',  # noqa: E501
        IndicatorsValuesByGeometryDate.as_view(),
        name='indicators-values-by-geometry-level-date-api'
    ),
]
instance_api = [
    url(r'^geometry/', include(geometry_api)),
    url(r'^indicator/', include(indicator_api)),
    url(r'^indicators/', include(indicators_api)),
    url(
        r'^download-master-data/(?P<date>.+)/check',
        DownloadMasterDataCheck.as_view(),
        name='download-master-data-check'
    ),
    url(
        r'^download-master-data/(?P<date>.+)',
        DownloadMasterData.as_view(),
        name='download-master-data'
    ),
    url(
        r'^download/sharepoint',
        DownloadSharepointFile.as_view(),
        name='download-sharepoint'
    ),
    url(
        r'^context-analysis',
        ContextAnalysisData.as_view(),
        name='context-analysis'
    ),
]

instance_url = [
    url(r'^api/', include(instance_api)),
    url(r'^', include('gap_harvester.urls')),
    url(r'^', include('gap_dashboard.urls')),
]

api = [
    url(
        r'^dashboard/(?P<slug>[^/]+)$',
        DashboardData.as_view(),
        name='dashboard-data-api'
    )
]

urlpatterns = [
    # Instances
    url(
        r'^instances/create',
        InstanceCreateView.as_view(),
        name='instance-management-create'
    ),
    url(
        r'^instances', InstanceManagementView.as_view(),
        name='instance-management-view'
    ),

    url(r'^backups', BackupsView.as_view(), name='backups-view'),
    url(
        r'^download/backups',
        DownloadBackupsFile.as_view(),
        name='download-backups'
    ),
    url(r'^api/', include(api)),
    url(r'^(?P<slug>[^/]+)/', include(instance_url)),
    url(r'^', InstancesView.as_view(), name='instances-view'),
]
