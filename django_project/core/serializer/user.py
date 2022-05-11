"""Site preference serializer."""
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """User serializer."""

    is_staff = serializers.SerializerMethodField()

    def get_is_staff(self, obj: User):
        """Return is staff."""
        return 'true' if obj.is_staff else 'false'

    class Meta:  # noqa: D106
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'is_staff')
