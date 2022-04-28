"""Model factory for site preference."""

import factory

from core.models.preferences import SitePreferences


class SitePreferencesF(factory.django.DjangoModelFactory):
    """Model factory for site preference."""

    site_title = factory.Sequence(lambda n: 'Site Title {}'.format(n))

    class Meta:  # noqa: D106
        model = SitePreferences
