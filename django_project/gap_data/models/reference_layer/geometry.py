"""Geometry model."""
import datetime

from django.contrib.gis.db import models

from core.models.general import AbstractTerm


class GeometryLevelName(AbstractTerm):
    """Geometry level name."""

    pass


class FindGeometry(models.Manager):
    """Model manager for geometry."""

    def get_by(self, name, geometry_level, child_of=None):
        """Filter geometry by name, geometry level and/or child of."""
        return self.filter(
            child_of=child_of,
            geometry_level=geometry_level
        ).get(
            name__iexact=name
        )


def default_active_date_from():
    """Return default of active date of geometry."""
    now = datetime.date.today()
    return now.replace(year=1900, month=1, day=1)


class Geometry(models.Model):
    """Geometry model."""

    identifier = models.CharField(
        max_length=512
    )
    name = models.CharField(
        max_length=512
    )
    geometry_level = models.ForeignKey(
        GeometryLevelName,
        on_delete=models.CASCADE
    )
    child_of = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        blank=True, null=True,
        related_name='geometry_child_of'
    )

    geometry = models.MultiPolygonField()
    objects = FindGeometry()

    class Meta:  # noqa: D106
        verbose_name_plural = 'geometries'

    def __str__(self):
        """Return the name of geometry."""
        return self.str()

    def str(self):
        """Return the name of geometry."""
        name = f'{self.name}'
        if self.name != self.identifier:
            name += f' ({self.identifier})'
        return name

    def geometries_by_level(self, geometry_level: GeometryLevelName):
        """Return geometries of this geometry by geometry level."""
        geometries = Geometry.objects.filter(id=self.id)
        current_geometry_level = self.geometry_level

        while geometry_level != current_geometry_level:
            geometry_ids = list(geometries.values_list('id', flat=True))
            geometries = Geometry.objects.filter(child_of__in=geometry_ids)

            if geometries.first():
                levels = geometries.values_list(
                    'geometry_level', flat=True).distinct()
                for level in levels:
                    if level == geometry_level.id:
                        return geometries.filter(geometry_level=level)

                current_geometry_level = geometries.first().geometry_level
            else:
                current_geometry_level = geometry_level
        return geometries
