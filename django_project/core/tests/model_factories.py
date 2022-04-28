import factory

from core.models.preferences import SitePreferences


class SitePreferencesF(factory.django.DjangoModelFactory):
    site_title = factory.Sequence(lambda n: 'Site Title {}'.format(n))

    class Meta:
        model = SitePreferences
