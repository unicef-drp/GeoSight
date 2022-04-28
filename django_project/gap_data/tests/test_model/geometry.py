from django.test.testcases import TestCase

from gap_data.tests.attribute_factories import polygon_sample
from gap_data.tests.model_factories import (
    InstanceF, GeometryF,
    GeometryLevelInstanceF, GeometryLevelNameF
)


class GeometryLevelNameTest(TestCase):
    """ Test for GeometryLevelName model """

    def setUp(self):
        self.name = 'Geometry Level 1'
        self.instance = GeometryLevelNameF()

    def test_create(self):
        geometry_level_name = GeometryLevelNameF(
            name=self.name
        )
        self.assertEquals(geometry_level_name.name, self.name)


class GeometryLevelInstanceTest(TestCase):
    """ Test for GeometryLevelInstance model """

    def setUp(self):
        self.instance = InstanceF()
        self.level = GeometryLevelNameF()

    def test_create_scenario_level(self):
        geometry_level_name = GeometryLevelInstanceF(
            instance=self.instance,
            level=self.level
        )
        self.assertEquals(geometry_level_name.instance, self.instance)
        self.assertEquals(geometry_level_name.level, self.level)

        # create child
        level = GeometryLevelNameF()
        geometry_level_name_child = GeometryLevelInstanceF(
            instance=self.instance,
            level=level,
            parent=self.level
        )
        self.assertEquals(geometry_level_name_child.instance, self.instance)
        self.assertEquals(geometry_level_name_child.level, level)
        self.assertEquals(geometry_level_name_child.parent, self.level)


class GeometryTest(TestCase):
    """ Test for Geometry model """

    def setUp(self):
        self.name = 'Geometry 1'
        self.instance = InstanceF()
        self.level = GeometryLevelNameF()

    def test_create(self):
        geometry_parent = GeometryF(
            name=self.name,
            instance=self.instance,
            geometry_level=self.level
        )
        self.assertEquals(geometry_parent.instance, self.instance)
        self.assertEquals(geometry_parent.geometry_level, self.level)
        self.assertEquals(geometry_parent.name, self.name)
        self.assertEquals(geometry_parent.geometry, polygon_sample())

        # create child
        name = 'Geometry child 1'
        level_1 = GeometryLevelNameF()
        geometry_child_1 = GeometryF(
            name=name,
            instance=self.instance,
            geometry_level=level_1,
            child_of=geometry_parent
        )
        self.assertEquals(geometry_child_1.instance, self.instance)
        self.assertEquals(geometry_child_1.geometry_level, level_1)
        self.assertEquals(geometry_child_1.name, name)
        self.assertEquals(geometry_child_1.geometry, polygon_sample())
        self.assertEquals(geometry_child_1.child_of, geometry_parent)

        name = 'Geometry child 2'
        geometry_child_2 = GeometryF(
            name=name,
            instance=self.instance,
            geometry_level=level_1,
            child_of=geometry_parent
        )
        self.assertEquals(geometry_child_2.instance, self.instance)
        self.assertEquals(geometry_child_2.geometry_level, level_1)
        self.assertEquals(geometry_child_2.name, name)
        self.assertEquals(geometry_child_2.geometry, polygon_sample())
        self.assertEquals(geometry_child_2.child_of, geometry_parent)

        # create child 3
        name = 'Geometry child 3'
        level_2 = GeometryLevelNameF()
        geometry_child_3 = GeometryF(
            name=name,
            instance=self.instance,
            geometry_level=level_2,
            child_of=geometry_parent
        )
        self.assertEquals(geometry_child_3.instance, self.instance)
        self.assertEquals(geometry_child_3.geometry_level, level_2)
        self.assertEquals(geometry_child_3.name, name)
        self.assertEquals(geometry_child_3.geometry, polygon_sample())
        self.assertEquals(geometry_child_3.child_of, geometry_parent)

        # check geometry functions
        self.assertEquals(
            geometry_parent.geometries_by_level(self.level)[0].id,
            geometry_parent.id
        )
        self.assertEquals(
            geometry_parent.geometries_by_level(level_1)[0].id,
            geometry_child_1.id
        )
        self.assertEquals(
            geometry_parent.geometries_by_level(level_1)[1].id,
            geometry_child_2.id
        )
        self.assertEquals(
            geometry_parent.geometries_by_level(level_2)[0].id,
            geometry_child_3.id
        )

        # create child 1 for 1
        name = 'Geometry child 1-3'
        level_3 = GeometryLevelNameF()
        geometry_child_1_3 = GeometryF(
            name=name,
            instance=self.instance,
            geometry_level=level_3,
            child_of=geometry_child_1
        )
        self.assertEquals(geometry_child_1_3.instance, self.instance)
        self.assertEquals(geometry_child_1_3.geometry_level, level_3)
        self.assertEquals(geometry_child_1_3.name, name)
        self.assertEquals(geometry_child_1_3.geometry, polygon_sample())
        self.assertEquals(geometry_child_1_3.child_of, geometry_child_1)

        # check from parent and the child 1
        self.assertEquals(
            geometry_parent.geometries_by_level(level_3)[0].id,
            geometry_child_1_3.id
        )
        self.assertEquals(
            geometry_child_1.geometries_by_level(level_3)[0].id,
            geometry_child_1_3.id
        )
        self.assertEquals(
            len(geometry_child_2.geometries_by_level(level_3)), 0
        )
