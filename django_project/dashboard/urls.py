"""harvester Dashboard urls."""
from django.conf.urls import url
from django.urls import include

from dashboard.views.admin.harvesters import (
    HarvesterDetail, HarvesterIndicatorDetail
)
from dashboard.views.admin.harvesters.forms import (
    HarvesterAPIWithGeographyAndDateView,
    HarvestedUsingExposedAPIByExternalClientView,
    HarvesterAPIWithGeographyAndTodayDateView, MetaIngestorView,
    SharepointHarvesterView
)
from dashboard.views.admin.indicator import (
    IndicatorCreateView,
    IndicatorManagementView, IndicatorEditView,
    IndicatorValueManagementMapView, IndicatorValueManagementTableView,
    IndicatorMultiEditView
)

harvester_form_url = [
    url(r'^update/api-with-geography-and-date',
        HarvesterAPIWithGeographyAndDateView.as_view(),
        name=str(
            HarvesterAPIWithGeographyAndDateView.harvester_class
        ).split("'")[1]
        ),
    url(r'^update/api-with-geography-and-today-date',
        HarvesterAPIWithGeographyAndTodayDateView.as_view(),
        name=str(
            HarvesterAPIWithGeographyAndTodayDateView.harvester_class
        ).split("'")[1]
        ),
    url(
        r'^update/harvested-using-exposed-api-by-external-client',
        HarvestedUsingExposedAPIByExternalClientView.as_view(),
        name=str(
            HarvestedUsingExposedAPIByExternalClientView.harvester_class
        ).split("'")[1]
    ),
    url(
        r'^update/sharepoint',
        SharepointHarvesterView.as_view(),
        name=str(SharepointHarvesterView.harvester_class).split("'")[1]
    ),
    url(
        r'^',
        HarvesterIndicatorDetail.as_view(),
        name='harvester-indicator-detail'
    ),
]

indicator_url = [
    url(
        r'^harvester/',
        include(harvester_form_url)
    ),
    url(
        r'^value-manager-map$',
        IndicatorValueManagementMapView.as_view(),
        name='indicator-value-mapview-manager'
    ),
    url(
        r'^value-manager-form',
        IndicatorValueManagementTableView.as_view(),
        name='indicator-value-form-manager'
    ),
    url(
        r'^edit',
        IndicatorEditView.as_view(),
        name='indicator-edit'
    ),
]

admin_indicator_url = [
    url(r'^(?P<pk>\d+)/', include(indicator_url)),
    url(
        r'^create',
        IndicatorCreateView.as_view(),
        name='indicator-management-new'
    ),
    url(
        r'^meta-ingestor',
        MetaIngestorView.as_view(),
        name='meta-ingestor-view'
    ),
    url(
        r'^multi-edit',
        IndicatorMultiEditView.as_view(),
        name='indicator-multi-edit-view'
    ),
    url(
        r'^',
        IndicatorManagementView.as_view(),
        name='indicator-management-view'
    ),
    url(
        r'^harvester/(?P<uuid>[0-9a-f-]+)',
        HarvesterDetail.as_view(),
        name='harvester-detail'
    ),
    url(
        r'^meta-ingestor/(?P<uuid>[0-9a-f-]+)',
        MetaIngestorView.as_view(),
        name='meta-ingestor-uuid-view'
    ),
]

admin_url = [
    url(r'^indicator/', include(admin_indicator_url)),
    url(
        r'^harvester/(?P<uuid>[0-9a-f-]+)',
        HarvesterDetail.as_view(),
        name='harvester-detail'
    ),
]

urlpatterns = [
    url(r'^old-admin/', include(admin_url)),
]
