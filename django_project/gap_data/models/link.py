"""The external link model."""
from django.contrib.gis.db import models

from core.models import AbstractTerm


class Link(AbstractTerm):
    """The external link model."""

    url = models.CharField(
        max_length=256
    )
    is_public = models.BooleanField(
        default=True,
        help_text="Is the link available for public or just admin."
    )
    order = models.IntegerField(
        default=0
    )

    class Meta:  # noqa: D106
        ordering = ('order',)
