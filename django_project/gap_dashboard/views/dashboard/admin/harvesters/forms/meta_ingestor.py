from gap_harvester.harveters.excel_harvester import ExcelHarvester
from gap_harvester.models.harvester import Harvester
from gap_harvester.tasks import run_harvester
from ._base import HarvesterFormView

MetaIngestor = (
    'gap_harvester.harveters.excel_harvester.ExcelHarvester',
    'Local Master File',
)


class MetaIngestorView(HarvesterFormView):
    harvester_class = ExcelHarvester
    template_name = 'dashboard/admin/harvesters/forms/meta_ingestor.html'

    @property
    def dashboard_title(self):
        return f'Meta Ingestor'

    def get_indicator(self):
        """
         Return indicator and save it as attribute
        """
        return None

    def get_harvester(self) -> Harvester:
        """
         Return harvester
        """
        uuid = self.kwargs.get('uuid', None)
        if not uuid:
            raise Harvester.DoesNotExist()
        return Harvester.objects.get(
            unique_id=uuid
        )

    @property
    def harvesters(self) -> tuple:
        """
         Return harvesters
        """
        return (MetaIngestor,)

    def get_context_data(self, **kwargs) -> dict:
        context = super().get_context_data(**kwargs)
        for attr in context['attributes']:
            if attr['name'] == 'file':
                attr['title'] = 'File'
                attr['type'] = 'file'
                attr['description'] = 'Upload file that will be used to save the data'
                attr['file_accept'] = '.xlsx,.xls'
            if attr['name'] == 'instance_slug':
                attr['value'] = self.instance.slug
        return context

    def after_post(self, harvester: Harvester):
        """
         Called after post success
        """
        harvester.user = self.request.user
        harvester.save()
        run_harvester.delay(harvester.pk)
