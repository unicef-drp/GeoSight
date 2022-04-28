from django.http import Http404
from django.shortcuts import redirect, reverse, render, get_object_or_404

from gap_dashboard.forms.indicator import IndicatorForm
from gap_dashboard.views.dashboard.admin._base import AdminView
from gap_data.models import Indicator, Instance, ScenarioLevel, IndicatorScenarioRule


class IndicatorEditView(AdminView):
    template_name = 'dashboard/admin/indicator/form.html'

    @property
    def content_title(self):
        try:
            indicator = self.instance.indicators.get(
                id=self.kwargs.get('pk', '')
            )
        except Indicator.DoesNotExist:
            raise Http404('Indicator does not exist')
        return f'<span>Edit Indicator : {indicator.full_name}</span>'

    def get_context_data(self, **kwargs) -> dict:
        context = super().get_context_data(**kwargs)
        try:
            indicator = self.instance.indicators.get(
                id=self.kwargs.get('pk', '')
            )
        except Indicator.DoesNotExist:
            raise Http404('Indicator does not exist')

        scenarios = indicator.scenarios_dict()
        context.update(
            {
                'form': IndicatorForm(
                    initial=IndicatorForm.model_to_initial(indicator),
                    indicator_instance=self.instance,
                ),
                'scenarios': scenarios
            }
        )
        return context

    def post(self, request, **kwargs):
        self.instance = get_object_or_404(
            Instance, slug=kwargs.get('slug', '')
        )
        try:
            indicator = self.instance.indicators.get(
                id=self.kwargs.get('pk', '')
            )
        except Indicator.DoesNotExist:
            raise Http404('Indicator does not exist')

        form = IndicatorForm(
            request.POST,
            instance=indicator,
            indicator_instance=self.instance
        )
        if form.is_valid():
            indicator = form.save()
            for scenario in ScenarioLevel.objects.order_by('level'):
                rule = request.POST.get(f'scenario_{scenario.id}_rule', None)
                name = request.POST.get(f'scenario_{scenario.id}_name', None)
                color = request.POST.get(f'scenario_{scenario.id}_color', None)
                if name:
                    scenario_rule, created = IndicatorScenarioRule.objects.get_or_create(
                        indicator=indicator,
                        scenario_level=scenario
                    )
                    scenario_rule.name = name
                    scenario_rule.rule = rule
                    scenario_rule.color = color
                    scenario_rule.save()
            return redirect(
                reverse(
                    'indicator-management-view', args=[self.instance.slug]
                )
            )
        context = self.get_context_data(**kwargs)
        context['form'] = form
        return render(
            request,
            self.template_name,
            context
        )
