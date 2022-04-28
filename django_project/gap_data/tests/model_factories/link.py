"""Factory for Link."""
import factory

from gap_data.models.link import Link
from gap_data.tests.model_factories.instance import InstanceF


class LinkF(factory.django.DjangoModelFactory):
    """Factory for Link."""

    instance = factory.SubFactory(InstanceF)
    name = factory.Sequence(lambda n: 'Link {}'.format(n))

    class Meta:  # noqa: D106
        model = Link
