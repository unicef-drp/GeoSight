"""Link Serializer."""
from rest_framework import serializers

from geosight.data.models.link import Link


class LinkSerializer(serializers.ModelSerializer):
    """Serializer for Link."""

    class Meta:  # noqa: D106
        model = Link
        exclude = ('is_public',)
