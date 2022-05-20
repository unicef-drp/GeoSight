"""Reference Layer model.

TODO:
 This will be moved to georepo
"""
import datetime
import uuid

from django.contrib.gis.db import models

from core.models.general import AbstractTerm
from gap_data.models.reference_layer.geometry import (
    Geometry, GeometryLevelName
)


class ReferenceLayer(AbstractTerm):
    """Reference Layer model."""

    identifier = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True
    )
    source = models.CharField(
        max_length=512
    )
    last_update = models.DateField(
        default=datetime.datetime.today
    )
    geometries = models.ManyToManyField(
        Geometry, blank=True
    )


class ReferenceLayerLevel(models.Model):
    """Reference layer level."""

    reference_layer = models.ForeignKey(
        ReferenceLayer, on_delete=models.CASCADE
    )
    level = models.IntegerField()
    level_name = models.ForeignKey(
        GeometryLevelName, on_delete=models.CASCADE
    )

    class Meta:  # noqa: D106
        unique_together = ('reference_layer', 'level')
