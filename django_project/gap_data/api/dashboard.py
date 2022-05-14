"""Context Analysis API.."""
from rest_framework.response import Response
from rest_framework.views import APIView

from gap_data.models.instance import Instance
from gap_data.serializer.indicator import IndicatorSerializer


class DashboardData(APIView):
    """Return all dashboard data."""

    def get(self, request, slug):
        """Return all context analysis data."""
        # TODO:
        #  Check this from dashboard
        instance = Instance.objects.all().first()

        context = {
            'indicators': IndicatorSerializer(
                instance.user_indicators(request.user), many=True
            ).data
        }
        return Response(context)
