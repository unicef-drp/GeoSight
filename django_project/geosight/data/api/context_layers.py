"""Context Layers API."""

from rest_framework.response import Response
from rest_framework.views import APIView

from geosight.data.models.context_layer import ContextLayer
from geosight.data.serializer.context_layer import ContextLayerSerializer


class ContextLayerListAPI(APIView):
    """Return ContextLayer list."""

    def get(self, request):
        """Return ContextLayer list."""
        return Response(
            ContextLayerSerializer(
                ContextLayer.objects.order_by('name'), many=True
            ).data
        )
