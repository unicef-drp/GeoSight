"""For geometry uploader."""
import uuid

from django.contrib.gis.db import models


class GeometryUploader(models.Model):
    """Geometry uploader."""

    unique_id = models.UUIDField(
        default=uuid.uuid4, editable=False, unique=True
    )
    time = models.DateTimeField(
        auto_now_add=True
    )


def upload_to(self, filename):
    """Return upload to based on incident id.

    :type self: GeometryUploaderFile
    :type filename: str
    """
    url = "upload/{}/{}".format(self.uploader.unique_id, filename)
    return url


class GeometryUploaderFile(models.Model):
    """Geometry files."""

    uploader = models.ForeignKey(
        GeometryUploader,
        on_delete=models.CASCADE
    )
    file = models.FileField(
        upload_to=upload_to,
    )


class GeometryUploaderLog(models.Model):
    """Log for geometry uploader."""

    uploader = models.ForeignKey(
        GeometryUploader,
        on_delete=models.CASCADE
    )
    identifier = models.CharField(
        max_length=512
    )
    note = models.TextField(
        null=True, blank=True
    )
