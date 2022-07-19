"""MetaIngestor View."""

from geosight.harvester.harveters.excel_harvester import ExcelHarvester
from geosight.harvester.models.harvester import Harvester
from geosight.harvester.tasks import run_harvester
from ._base import HarvesterFormView

MetaIngestor = (
    'geosight.harvester.harveters.excel_harvester.ExcelHarvester',
    'Local Master File',
)


class MetaIngestorForm(HarvesterFormView):
    """Meta Ingestor View."""

    harvester_class = ExcelHarvester
    template_name = 'frontend/admin/harvesters/meta_ingestor.html'

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Meta Ingestor'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        return (
            '<span>Indicators</span> <span>></span> <span>Meta Ingestor</span>'
        )

    def get_indicator(self):
        """Return indicator and save it as attribute."""
        return None

    def get_harvester(self) -> Harvester:
        """Return harvester."""
        uuid = self.kwargs.get('uuid', None)
        if not uuid:
            raise Harvester.DoesNotExist()
        return Harvester.objects.get(
            unique_id=uuid
        )

    @property
    def harvesters(self) -> tuple:
        """Return harvesters."""
        return (MetaIngestor,)

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        for attr in context['attributes']:
            if attr['name'] == 'file':
                attr['title'] = 'File'
                attr['type'] = 'file'
                attr['description'] = (
                    'Upload file that will be used to save the data'
                )
                attr['file_accept'] = '.xlsx,.xls'
        return context

    def after_post(self, harvester: Harvester):
        """For calling after post success."""
        harvester.user = self.request.user
        harvester.save()
        run_harvester.delay(harvester.pk)
