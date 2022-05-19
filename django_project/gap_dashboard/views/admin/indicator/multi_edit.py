"""Multi Indicator Editor View."""
from django.http import Http404
from django.shortcuts import redirect, reverse, get_object_or_404

from gap_dashboard.forms.indicator import IndicatorForm
from gap_dashboard.views.admin._base import AdminView
from gap_data.models import Indicator


class IndicatorMultiEditView(AdminView):
    """Multi Indicator Editor View."""

    template_name = 'admin/indicator/form-multi-edit.html'

    @property
    def page_title(self):
        """Return page title."""
        return 'Multi Edit Indicators'

    @property
    def content_title(self):
        """Return content title."""
        return ''

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        initial = {}
        indicators = []
        ids = self.request.GET.get('ids')
        for _id in ids.split(','):
            try:
                indicator = Indicator.objects.get(id=_id)
                indicators.append(indicator)
                initial_model = IndicatorForm.model_to_initial(indicator)
                initial_model['name'] = None
                initial_model['description'] = None

                # need to check all initial data
                for key, value in initial_model.items():
                    try:
                        if value != initial[key]:
                            initial[key] = None
                    except KeyError:
                        initial[key] = value

            except Indicator.DoesNotExist:
                raise Http404(f'Indicator with id {_id} does not exist')

        context.update(
            {
                'form': IndicatorForm(
                    initial=initial,
                ),
                'indicators': indicators
            }
        )
        return context

    def post(self, request, **kwargs):
        """Save indicators."""
        ids = self.request.GET.get('ids')
        for _id in ids.split(','):
            indicator = get_object_or_404(
                Indicator, id=_id
            )
            data = request.POST.copy()
            for key, field in IndicatorForm().fields.items():
                if key not in data:
                    value = getattr(indicator, key)
                    try:
                        if key in ['group']:
                            value = value.name
                        elif key == 'frequency':
                            value = value.frequency
                        else:
                            value = value.pk
                    except AttributeError:
                        pass
                    data[key] = value

            form = IndicatorForm(
                data,
                instance=indicator
            )
            if form.is_valid():
                indicator = form.save()
        return redirect(
            reverse(
                'indicator-management-view', args=[]
            )
        )
