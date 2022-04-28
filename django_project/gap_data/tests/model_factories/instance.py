"""Factory for Instance."""
import factory

from gap_data.models.instance import Instance


class InstanceF(factory.django.DjangoModelFactory):
    """Factory for Instance."""

    name = factory.Sequence(lambda n: 'Instance {}'.format(n))

    class Meta:  # noqa: D106
        model = Instance
