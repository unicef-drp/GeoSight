"""ContextLayer urls."""
from django.conf.urls import url
from django.urls import include

from frontend.views.admin.context_layer.create import ContextLayerCreateView
from frontend.views.admin.context_layer.edit import ContextLayerEditView
from frontend.views.admin.context_layer.list import ContextLayerListView

admin_detail_url = [
    url(
        r'^edit',
        ContextLayerEditView.as_view(),
        name='admin-context-layer-edit-view'
    ),
]
urlpatterns = [
    url(r'^(?P<pk>\d+)/', include(admin_detail_url)),
    url(
        r'^create',
        ContextLayerCreateView.as_view(),
        name='admin-context-layer-create-view'
    ),
    url(
        r'^',
        ContextLayerListView.as_view(),
        name='admin-context-layer-list-view'
    ),
]
