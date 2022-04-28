from django.conf.urls import url
from django.urls import include

from gap_harvester.api.harvester import HarvesterLogData

api = [
    url(r'^harvester-log/(?P<pk>\d+)', HarvesterLogData.as_view(), name='harvester-log-api'),
]

urlpatterns = [
    url(r'^api/', include(api)),
]
