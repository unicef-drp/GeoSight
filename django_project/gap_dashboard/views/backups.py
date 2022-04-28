from braces.views import SuperuserRequiredMixin
from django.conf import settings
from django.views.generic.base import TemplateView

from gap_data.utils import path_to_dict


class BackupsView(SuperuserRequiredMixin, TemplateView):
    template_name = 'pages/backups.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['dir'] = path_to_dict(
            settings.BACKUPS_ROOT, settings.BACKUPS_ROOT, ['.dmp'], True
        )
        return context
