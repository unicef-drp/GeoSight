"""Frontend urls."""
from django.conf.urls import url
from django.urls import include

admin_url = [
    url(r'^indicators/', include('frontend.urls.indicator')),
    url(r'^basemap/', include('frontend.urls.basemap')),
    url(r'^context-layer/', include('frontend.urls.context_layer')),
]
urlpatterns = [
    url(r'^dashboard/', include('frontend.urls.dashboard')),
    url(r'^admin/', include(admin_url)),
]
