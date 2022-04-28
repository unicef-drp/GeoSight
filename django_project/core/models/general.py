"""General that contains abstract model classes."""
from django.contrib.gis.db import models
from django.template.defaultfilters import slugify


class AbstractTerm(models.Model):
    """Abstract model for Term."""

    name = models.CharField(
        max_length=512
    )
    description = models.TextField(
        null=True, blank=True
    )

    def __str__(self):
        return self.name

    class Meta:  # noqa: D106
        abstract = True


class SlugTerm(AbstractTerm):
    """Abstract model for Term."""

    slug = models.SlugField(
        max_length=512, unique=True
    )

    def save(self, *args, **kwargs):
        """Save model."""
        self.slug = slugify(self.name)
        return super().save(*args, **kwargs)

    class Meta:  # noqa: D106
        abstract = True

    def name_is_exist(self, name: str) -> bool:
        """Check of name is exist."""
        return self._meta.model.objects.exclude(pk=self.pk).filter(
            slug=slugify(name)
        ).first() is not None

    @staticmethod
    def name_is_exist_of_all(name: str) -> bool:
        """Check of name is exist."""
        return SlugTerm._meta.model.objects.filter(
            slug=slugify(name)
        ).first() is not None


class IconTerm(models.Model):
    """Abstract model contains icon."""

    icon = models.FileField(
        upload_to='icons',
        null=True,
        blank=True
    )
    white_icon = models.FileField(
        upload_to='icons',
        null=True,
        blank=True
    )

    class Meta:  # noqa: D106
        abstract = True


# AGGREGATION METHOD
class PermissionLevels(object):
    """Class that hold Permission Level quick variable with string."""

    PUBLIC = 'Public'
    SIGNIN = 'Signin'
    ADMIN = 'Admin'


class PermissionModel(models.Model):
    """Abstract model for Permission."""

    access_level = models.CharField(
        max_length=126,
        default=PermissionLevels.PUBLIC,
        choices=(
            (PermissionLevels.PUBLIC, 'Accessed in public.'),
            (PermissionLevels.SIGNIN, 'Need login to access.'),
            (PermissionLevels.ADMIN, 'Need admin level to access it.')
        )
    )

    class Meta:  # noqa: D106
        abstract = True
