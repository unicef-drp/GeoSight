"""The external link model."""
from django.contrib.gis.db import models

from core.models import AbstractTerm
from gap_data.models.instance import Instance


class Link(AbstractTerm):
    """The external link model."""

    instance = models.ForeignKey(
        Instance,
        null=True, blank=True,
        on_delete=models.CASCADE,
        help_text="Make this empty to be used by every instance."
    )
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
