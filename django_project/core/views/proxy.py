"""Proxi API for request the url from outside API."""
import requests
from django.http import HttpResponseBadRequest, HttpResponse
from rest_framework.views import APIView


class ProxyView(APIView):
    """Proxy API for returning outside url."""

    def get(self, request):
        """GET API."""
        url = request.GET.get('url', None)
        if not url:
            return HttpResponseBadRequest('url is required')
        username = request.GET.get('username', None)
        password = request.GET.get('password', None)
        basic_auth = request.GET.get('basic_auth', None)

        if username and password:
            response = requests.get(url, auth=(username, password))
        elif basic_auth:
            response = requests.get(url, headers={
                "Authorization": f"Basic {basic_auth}"})
        else:
            response = requests.get(url)

        django_response = HttpResponse(
            content=response.content,
            status=response.status_code,
            content_type=response.headers['Content-Type']
        )
        return django_response
