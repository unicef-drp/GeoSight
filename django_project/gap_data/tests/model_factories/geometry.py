"""Factory for Geometry."""
import factory

from gap_data.models.geometry import (
    GeometryLevelName, GeometryLevelInstance,
    Geometry
)
from gap_data.tests.attribute_factories import polygon_sample
from gap_data.tests.model_factories.instance import InstanceF


class GeometryLevelNameF(factory.django.DjangoModelFactory):
    """Factory for GeometryLevelName."""

    name = factory.Sequence(lambda n: 'Geometry Level {}'.format(n))

    class Meta:  # noqa: D106
        model = GeometryLevelName


class GeometryLevelInstanceF(factory.django.DjangoModelFactory):
    """Factory for GeometryLevelInstance."""

    instance = factory.SubFactory(InstanceF)
    level = factory.SubFactory(GeometryLevelNameF)

    class Meta:  # noqa: D106
        model = GeometryLevelInstance


class GeometryF(factory.django.DjangoModelFactory):
    """Factory for Geometry."""

    instance = factory.SubFactory(InstanceF)
    geometry_level = factory.SubFactory(GeometryLevelNameF)
    identifier = factory.Sequence(lambda n: 'geometry_{}'.format(n))
    name = factory.Sequence(lambda n: 'Geometry {}'.format(n))
    geometry = polygon_sample()

    class Meta:  # noqa: D106
        model = Geometry
