"""Indicator Editor View."""
from django.http import Http404
from django.shortcuts import redirect, reverse, render, get_object_or_404

from gap_dashboard.forms.indicator import IndicatorForm
from gap_dashboard.views.admin._base import AdminView
from gap_data.models import Indicator


class IndicatorEditView(AdminView):
    """Indicator Editor View."""

    template_name = 'dashboard/admin/indicator/form.html'

    @property
    def content_title(self):
        """Return content title."""
        try:
            indicator = get_object_or_404(
                Indicator, id=self.kwargs.get('pk', '')
            )
        except Indicator.DoesNotExist:
            raise Http404('Indicator does not exist')
        return f'<span>Edit Indicator : {indicator.full_name}</span>'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        try:
            indicator = get_object_or_404(
                Indicator, id=self.kwargs.get('pk', '')
            )
        except Indicator.DoesNotExist:
            raise Http404('Indicator does not exist')

        scenarios = indicator.scenarios_dict()
        context.update(
            {
                'form': IndicatorForm(
                    initial=IndicatorForm.model_to_initial(indicator)
                ),
                'scenarios': scenarios
            }
        )
        return context

    def post(self, request, **kwargs):
        """Save indicator."""
        try:
            indicator = get_object_or_404(
                Indicator, id=self.kwargs.get('pk', '')
            )
        except Indicator.DoesNotExist:
            raise Http404('Indicator does not exist')

        form = IndicatorForm(
            request.POST,
            instance=indicator
        )
        if form.is_valid():
            indicator = form.save()

            # save the scenario
            # rule = request.POST.get(f'scenario_{scenario.id}_rule', None)
            # name = request.POST.get(f'scenario_{scenario.id}_name', None)
            # color = request.POST.get(f'scenario_{scenario.id}_color', None)
            # if name:
            #     scenario_rule, created = \
            #         IndicatorScenarioRule.objects.get_or_create(
            #             indicator=indicator,
            #             scenario_level=scenario
            #         )
            #     scenario_rule.name = name
            #     scenario_rule.rule = rule
            #     scenario_rule.color = color
            #     scenario_rule.save()
            return redirect(
                reverse(
                    'indicator-management-view', args=[]
                )
            )
        context = self.get_context_data(**kwargs)
        context['form'] = form
        return render(
            request,
            self.template_name,
            context
        )
