"""Global context for data."""
from gap_data.models.link import Link
from gap_data.serializer.link import LinkSerializer


def global_context(request):
    """Global context that will be returned for every request."""
    links = Link.objects.filter(is_public=True)
    if request.user.is_staff:
        links = Link.objects.all()

    return {
        'links': [dict(d) for d in LinkSerializer(links, many=True).data]
    }
