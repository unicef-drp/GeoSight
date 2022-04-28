"""Export all geometries."""
from django.core.management.base import BaseCommand

from gap_data.fixtures.somalia import administrative as somalia


class Command(BaseCommand):
    """Export all geometries."""

    def handle(self, *args, **options):
        """Command handler."""
        somalia.run()
