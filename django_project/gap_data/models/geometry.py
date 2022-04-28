import datetime

from django.contrib.gis.db import models
from django.db.models import Q
from django.utils.translation import ugettext_lazy as _

from core.models.general import AbstractTerm
from gap_data.models.instance import Instance


class GeometryLevelName(AbstractTerm):
    """
    Geometry level name
    """
    pass


class GeometryLevelInstance(models.Model):
    """
    This is geometry level hierarchy for the instance
    """
    instance = models.ForeignKey(
        Instance,
        on_delete=models.CASCADE
    )
    level = models.ForeignKey(
        GeometryLevelName,
        on_delete=models.CASCADE
    )
    parent = models.ForeignKey(
        GeometryLevelName,
        on_delete=models.SET_NULL,
        blank=True, null=True,
        related_name='geometry_parent_level'
    )

    class Meta:
        unique_together = ('instance', 'level')

    def get_level_tree(self):
        tree = []
        level_instance = self
        parent = True
        while parent:
            tree.append(level_instance.level.name)
            parent = level_instance.parent
            if parent:
                level_instance = GeometryLevelInstance.objects.filter(
                    instance=self.instance,
                    level=parent
                ).first()
        return tree

    def get_child_tree(self):
        tree = [self.level.name]
        for child in GeometryLevelInstance.objects.filter(
                instance=self.instance,
                parent=self.level
        ):
            tree += child.get_child_tree()
        return tree


class FindGeometry(models.Manager):
    def get_by(self, name, geometry_level, child_of=None):
        return self.filter(
            child_of=child_of,
            geometry_level=geometry_level
        ).get(
            Q(name__iexact=name) |
            Q(alias__icontains=name)
        )

    def by_date(self, date: datetime.date):
        """
        Filter dates by date
        """
        return super().filter(
            Q(active_date_from__lte=date, active_date_to__isnull=True) |
            Q(active_date_from__lte=date, active_date_to__gte=date)
        )


def default_active_date_from():
    now = datetime.date.today()
    return now.replace(year=1900, month=1, day=1)


class Geometry(models.Model):
    """
    Geometry with it's type
    """
    identifier = models.CharField(
        max_length=512
    )
    instance = models.ForeignKey(
        Instance,
        on_delete=models.CASCADE
    )
    name = models.CharField(
        max_length=512
    )
    alias = models.TextField(
        default='',
        help_text=_(
            'Alias of the geometry name. '
            'Use comma separator for multi alias.')
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

    # geometry time active
    active_date_from = models.DateField(
        default=default_active_date_from
    )
    active_date_to = models.DateField(
        blank=True,
        null=True
    )

    # dashboard link
    dashboard_link = models.CharField(
        default='',
        max_length=1024,
        null=True, blank=True,
        help_text=(
            'A dashboard link can be any URL to e.g. '
            'a BI platform or another web site. '
            'This is optional, and when populated, '
            'a special icon will be shown next to the indicator which, '
            'when clicked, will open up this URL in '
            'a frame over the main map area.'
        )
    )

    objects = FindGeometry()

    class Meta:
        verbose_name_plural = 'geometries'

    def __str__(self):
        return self.str()

    def str(self):
        name = f'{self.name}'
        if self.name != self.identifier:
            name += f' ({self.identifier})'
        return name

    def geometries_by_level(self, geometry_level: GeometryLevelName):
        """
        Return geometries of this geometry by geometry level
        """
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
