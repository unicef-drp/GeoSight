import factory

from gap_data.models.link import Link
from gap_data.tests.model_factories.instance import InstanceF


class LinkF(factory.django.DjangoModelFactory):
    instance = factory.SubFactory(InstanceF)
    name = factory.Sequence(lambda n: 'Link {}'.format(n))

    class Meta:
        model = Link
