"""Factory for Link."""
import factory

from geosight.data.models.link import Link


class LinkF(factory.django.DjangoModelFactory):
    """Factory for Link."""

    name = factory.Sequence(lambda n: 'Link {}'.format(n))

    class Meta:  # noqa: D106
        model = Link
