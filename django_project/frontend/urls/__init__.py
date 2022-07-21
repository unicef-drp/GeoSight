"""Frontend urls."""
from django.conf.urls import url
from django.urls import include

from frontend.views.home import HomePageView
from frontend.views.login import LoginPageView

admin_url = [
    url(r'^project/', include('frontend.urls.dashboard_admin')),
    url(r'^indicators/', include('frontend.urls.indicator')),
    url(r'^basemap/', include('frontend.urls.basemap')),
    url(r'^context-layer/', include('frontend.urls.context_layer')),
    url(r'^', include('frontend.urls.harvesters')),
]
urlpatterns = [
    url(r'^project/', include('frontend.urls.dashboard')),
    url(r'^login/', LoginPageView.as_view(), name='login'),
    url(r'^admin/', include(admin_url)),
    url(r'^', HomePageView.as_view(), name='home-view'),
]
