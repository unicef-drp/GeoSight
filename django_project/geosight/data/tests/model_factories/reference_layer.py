"""Reference Layer Test.

TODO:
 This will be moved to georepo
"""

import factory

from geosight.data.models.reference_layer import GeometryLevelName, Geometry
from geosight.data.tests.attribute_factories import polygon_sample


class GeometryLevelNameF(factory.django.DjangoModelFactory):
    """Factory of Geometry Level."""

    name = factory.Sequence(lambda n: 'Geometry Level {}'.format(n))

    class Meta:  # noqa: D106
        model = GeometryLevelName


class GeometryF(factory.django.DjangoModelFactory):
    """Factory of Geometry."""

    geometry_level = factory.SubFactory(GeometryLevelNameF)
    identifier = factory.Sequence(lambda n: 'geometry_{}'.format(n))
    name = factory.Sequence(lambda n: 'Geometry {}'.format(n))
    geometry = polygon_sample()

    class Meta:  # noqa: D106
        model = Geometry
