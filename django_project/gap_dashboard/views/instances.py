from ._base import BaseView


class InstancesView(BaseView):
    @property
    def template_name(self):
        return 'pages/instances.html'

    @property
    def page_title(self):
        return 'Instances'

    @property
    def content_title(self):
        return 'Instances'
