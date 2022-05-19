import factory

from gap_data.models.reference_layer import (
    GeometryLevelName, Geometry
)
from gap_data.tests.attribute_factories import polygon_sample


class GeometryLevelNameF(factory.django.DjangoModelFactory):
    name = factory.Sequence(lambda n: 'Geometry Level {}'.format(n))

    class Meta:
        model = GeometryLevelName


class GeometryF(factory.django.DjangoModelFactory):
    geometry_level = factory.SubFactory(GeometryLevelNameF)
    identifier = factory.Sequence(lambda n: 'geometry_{}'.format(n))
    name = factory.Sequence(lambda n: 'Geometry {}'.format(n))
    geometry = polygon_sample()

    class Meta:
        model = Geometry
