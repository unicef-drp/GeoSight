"""GeoSight Data urls."""
from django.conf.urls import url
from django.urls import include

from dashboard.views.backups import BackupsView
from geosight.data.api.basemap import (
    BasemapListAPI, BasemapDetailAPI
)
from geosight.data.api.context_layers import (
    ContextLayerListAPI, ContextLayerDetailAPI
)
from geosight.data.api.dashboard import (
    DashboardData, DashboardDetail, DashboardListAPI
)
from geosight.data.api.download_file import (
    DownloadSharepointFile,
    DownloadBackupsFile
)
from geosight.data.api.indicator import (
    IndicatorListAPI, IndicatorBasicListAPI,
    IndicatorDetailAPI, IndicatorValuesAPI,
)
from geosight.data.api.indicator_value import (
    IndicatorValuesByGeometry,
    IndicatorValueDetail,
    IndicatorValues, IndicatorValuesBatch
)

# ------------------------------------------------------
# DASHBOARD API
dashboard_api = [
    url(
        r'^list',
        DashboardListAPI.as_view(), name='dashboard-list-api'
    ),
    url(
        r'^(?P<slug>[^/]+)/data$',
        DashboardData.as_view(),
        name='dashboard-data-api'
    ),
    url(
        r'^(?P<slug>[^/]+)$',
        DashboardDetail.as_view(),
        name='dashboard-detail-api'
    ),
]
# ------------------------------------------------------
# INDICATOR API
indicator_api = [
    url(
        r'^list/basic',
        IndicatorBasicListAPI.as_view(), name='indicator-basic-list-api'
    ),
    url(
        r'^list',
        IndicatorListAPI.as_view(), name='indicator-list-api'
    ),
    url(
        r'^(?P<pk>\d+)/upload/batch',
        IndicatorValuesBatch.as_view(),
        name='indicator-upload-values-batch-api'
    ),
    url(
        r'^(?P<pk>\d+)/upload',
        IndicatorValues.as_view(), name='indicator-upload-values-api'
    ),
    url(
        r'^(?P<pk>\d+)/values/latest',
        IndicatorValuesAPI.as_view(), name='indicator-values-api'
    ),
    url(
        r'^(?P<pk>\d+)/values/by-geometry/(?P<geometry_code>.+)/',
        IndicatorValuesByGeometry.as_view(),
        name='indicator-values-by-geometry'
    ),
    url(
        r'^(?P<pk>\d+)/values/(?P<value_id>\d+)/details/',
        IndicatorValueDetail.as_view(),
        name='indicator-value-detail'
    ),
    url(
        r'^(?P<pk>\d+)',
        IndicatorDetailAPI.as_view(), name='indicator-detail-api'
    ),
]
# ------------------------------------------------------
# BASEMAP API
basemap_api = [
    url(
        r'^list',
        BasemapListAPI.as_view(), name='basemap-list-api'
    ),
    url(
        r'^(?P<pk>\d+)',
        BasemapDetailAPI.as_view(), name='basemap-detail-api'
    ),
]
# ------------------------------------------------------
# CONTEXT LAYER API
context_layer_api = [
    url(
        r'^list',
        ContextLayerListAPI.as_view(), name='context-layer-list-api'
    ),
    url(
        r'^(?P<pk>\d+)',
        ContextLayerDetailAPI.as_view(), name='context-layer-detail-api'
    ),
]
# ------------------------------------------------------
api = [
    url(r'^dashboard/', include(dashboard_api)),
    url(r'^basemap/', include(basemap_api)),
    url(r'^indicator/', include(indicator_api)),
    url(r'^context-layer/', include(context_layer_api)),
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
    url(r'^', include('dashboard.urls')),
]
