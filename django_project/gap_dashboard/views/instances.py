"""Instance List View."""
from ._base import BaseView


class InstancesView(BaseView):
    """Instance List View."""

    @property
    def template_name(self):
        """Return template name."""
        return 'pages/instances.html'

    @property
    def page_title(self):
        """Return page title."""
        return 'Instances'

    @property
    def content_title(self):
        """Return content title."""
        return 'Instances'
