from django.core.management.base import BaseCommand

from gap_harvester.models import Harvester


class Command(BaseCommand):
    """
    Run specific or all harvester
    """
    args = ''
    help = 'Run specific of all harvester.'

    def add_arguments(self, parser):
        parser.add_argument(
            '-id',
            '--id',
            dest='id',
            default='',
            help='ID of harvester.')
        parser.add_argument(
            '-force',
            '--force',
            default='',
            dest='force',
            help='Force the harvesting')

    def handle(self, *args, **options):
        id = options.get('id', None)
        harvesters = Harvester.objects.filter(active=True)
        force = options.get('force', False)
        if id:
            harvesters = harvesters.filter(id=id)

        for harvester in harvesters:
            harvester.run(force)
