from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """
    Update all fixtures
    """

    def handle(self, *args, **options):
        call_command('loaddata', 'gap_data/fixtures/fixtures.json')
        call_command('load_geometries')
