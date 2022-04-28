from django.conf.urls import url
from django.urls import include

from gap_dashboard.views.dashboard.admin.geography import (
    GeographyView, GeographyLevelManagementView, GeographyUploadView,
)
from gap_dashboard.views.dashboard.admin.harvesters import (
    HarvesterDetail, HarvesterIndicatorDetail
)
from gap_dashboard.views.dashboard.admin.harvesters.forms import (
    HarvesterAPIWithGeographyAndDateView, HarvestedUsingExposedAPIByExternalClientView,
    HarvesterAPIWithGeographyAndTodayDateView, MetaIngestorView,
    SharepointHarvesterView
)
from gap_dashboard.views.dashboard.admin.indicator import (
    IndicatorCreateView,
    IndicatorManagementView, IndicatorEditView, IndicatorReportingUnitView,
    IndicatorValueManagementMapView, IndicatorValueManagementTableView,
    IndicatorMultiEditView
)
from gap_dashboard.views.dashboard.admin.instance import (
    InstanceEditView
)
from gap_dashboard.views.dashboard.list import DashboardListView

harvester_form_url = [
    url(r'^update/api-with-geography-and-date',
        HarvesterAPIWithGeographyAndDateView.as_view(),
        name=str(HarvesterAPIWithGeographyAndDateView.harvester_class).split("'")[1]
        ),
    url(r'^update/api-with-geography-and-today-date',
        HarvesterAPIWithGeographyAndTodayDateView.as_view(),
        name=str(HarvesterAPIWithGeographyAndTodayDateView.harvester_class).split("'")[1]
        ),
    url(
        r'^update/harvested-using-exposed-api-by-external-client',
        HarvestedUsingExposedAPIByExternalClientView.as_view(),
        name=str(HarvestedUsingExposedAPIByExternalClientView.harvester_class).split("'")[1]
    ),
    url(
        r'^update/sharepoint',
        SharepointHarvesterView.as_view(),
        name=str(SharepointHarvesterView.harvester_class).split("'")[1]
    ),
]

indicator_url = [
    url(r'^(?P<pk>\d+)/harvester/', include(harvester_form_url)),
    url(r'^(?P<pk>\d+)/harvester', HarvesterIndicatorDetail.as_view(), name='harvester-indicator-detail'),
    url(r'^(?P<pk>\d+)/value-manager-map', IndicatorValueManagementMapView.as_view(), name='indicator-value-mapview-manager'),
    url(r'^(?P<pk>\d+)/value-manager-form', IndicatorValueManagementTableView.as_view(), name='indicator-value-form-manager'),

    # this is for harvester with global indicators
    url(
        r'^meta-ingestor/(?P<uuid>[0-9a-f-]+)',
        MetaIngestorView.as_view(),
        name='meta-ingestor-uuid-view'
    ),
    url(
        r'^meta-ingestor',
        MetaIngestorView.as_view(),
        name='meta-ingestor-view'
    ),
]

dashboard_url = [
    url(r'^indicator/', include(indicator_url)),
    url(r'^harvester/(?P<uuid>[0-9a-f-]+)', HarvesterDetail.as_view(), name='harvester-detail'),
    url(r'^', DashboardListView.as_view(), name='dashboard-list-view'),
]

admin_geography_url = [
    url(r'^upload', GeographyUploadView.as_view(), name='geography-upload-view'),
    url(r'^level-management', GeographyLevelManagementView.as_view(), name='geography-level-management-view'),
    url(r'^', GeographyView.as_view(), name='geography-management-view'),
]

admin_indicator_url = [
    url(r'^(?P<pk>\d+)/reporting-unit', IndicatorReportingUnitView.as_view(), name='indicator-reporting-unit'),
    url(r'^(?P<pk>\d+)/edit', IndicatorEditView.as_view(), name='indicator-edit'),
    url(r'^create', IndicatorCreateView.as_view(), name='indicator-management-new'),
    url(r'^multi-edit', IndicatorMultiEditView.as_view(), name='indicator-multi-edit-view'),
    url(r'^', IndicatorManagementView.as_view(), name='indicator-management-view'),
]
admin_instance_url = [
    url(r'^edit', InstanceEditView.as_view(), name='instance-management-edit'),
]

admin_url = [
    url(r'^geography/', include(admin_geography_url)),
    url(r'^indicator/', include(admin_indicator_url)),
    url(r'^instance/', include(admin_instance_url)),
]

urlpatterns = [
    url(r'^dashboard/', include(dashboard_url)),
    url(r'^admin/', include(admin_url)),
]
