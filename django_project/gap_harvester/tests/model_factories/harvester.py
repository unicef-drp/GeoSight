"""Model Factory for Harvester."""
import factory

from gap_harvester.models.harvester import Harvester
from gap_harvester.models.harvester_attribute import (
    HarvesterAttribute, HarvesterMappingValue
)


class HarvesterF(factory.django.DjangoModelFactory):
    """Model Factory for Harvester."""

    class Meta:  # noqa: D106
        model = Harvester


class HarvesterAttributeF(factory.django.DjangoModelFactory):
    """Model Factory for HarvesterAttribute."""

    harvester = factory.SubFactory(HarvesterF)

    class Meta:  # noqa: D106
        model = HarvesterAttribute


class HarvesterMappingValueF(factory.django.DjangoModelFactory):
    """Model Factory for HarvesterMappingValue."""

    harvester = factory.SubFactory(HarvesterF)

    class Meta:  # noqa: D106
        model = HarvesterMappingValue
