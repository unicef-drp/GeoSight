import factory

from gap_harvester.models.harvester import Harvester
from gap_harvester.models.harvester_attribute import HarvesterAttribute, HarvesterMappingValue


class HarvesterF(factory.django.DjangoModelFactory):
    class Meta:
        model = Harvester


class HarvesterAttributeF(factory.django.DjangoModelFactory):
    harvester = factory.SubFactory(HarvesterF)

    class Meta:
        model = HarvesterAttribute


class HarvesterMappingValueF(factory.django.DjangoModelFactory):
    harvester = factory.SubFactory(HarvesterF)

    class Meta:
        model = HarvesterMappingValue
