# coding=utf-8
"""Main django urls."""

from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic.base import RedirectView

from core.api.proxy import ProxyView

admin.autodiscover()

urlpatterns = [
    url(r'^django-admin/core/sitepreferences/$', RedirectView.as_view(
        url='/django-admin/core/sitepreferences/1/change/', permanent=False),
        name='index'),
    url(r'^django-admin/', admin.site.urls),
    url(r'^auth/', include('django.contrib.auth.urls')),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    url(r'^proxy', ProxyView.as_view(), name='proxy-view'),
    url(r'^', include('geosight.urls')),
    url(r'^', include('frontend.urls')),
]
