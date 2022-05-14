"""Link Serializer."""
from rest_framework import serializers

from gap_data.models.link import Link


class LinkSerializer(serializers.ModelSerializer):
    """Serializer for Link."""

    instance = serializers.SerializerMethodField()

    def get_instance(self, obj: Link):
        """Return parameters."""
        return obj.instance.slug if obj.instance else ''

    class Meta:  # noqa: D106
        model = Link
        exclude = ('is_public',)
