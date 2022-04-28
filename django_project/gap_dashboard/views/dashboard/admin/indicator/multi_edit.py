from django.http import Http404
from django.shortcuts import redirect, reverse, get_object_or_404

from gap_dashboard.forms.indicator import IndicatorForm
from gap_dashboard.views.dashboard.admin._base import AdminView
from gap_data.models import (
    Indicator, Instance, ScenarioLevel, IndicatorScenarioRule
)


class IndicatorMultiEditView(AdminView):
    template_name = 'dashboard/admin/indicator/form-multi-edit.html'

    @property
    def content_title(self):
        return '<span>Multi Edit Indicators</span>'

    def get_context_data(self, **kwargs) -> dict:
        context = super().get_context_data(**kwargs)
        scenarios_by_id = {}
        initial = {}
        indicators = []
        ids = self.request.GET.get('ids')
        for _id in ids.split(','):
            try:
                indicator = self.instance.indicators.get(id=_id)
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

                # check scenario
                # If there are differente scenarios values, put it empty
                scenarios = indicator.scenarios_dict()
                for scenario in scenarios:
                    if scenario['id'] not in scenarios_by_id:
                        scenarios_by_id[scenario['id']] = {}
                        scenarios_by_id[scenario['id']][
                            'id'] = scenario['id']
                        scenarios_by_id[scenario['id']][
                            'name'] = scenario['name']
                    for key in ['rule_name', 'rule_color', 'rule_value']:
                        try:
                            if scenario[key] != scenarios_by_id[
                                scenario['id']
                            ][key]:
                                scenarios_by_id[scenario['id']][key] = ''
                        except KeyError:
                            scenarios_by_id[scenario['id']][key] = scenario[
                                key]

            except Indicator.DoesNotExist:
                raise Http404(f'Indicator with id {_id} does not exist')

        scenarios = []
        for id, value in scenarios_by_id.items():
            scenarios.append(value)

        context.update(
            {
                'form': IndicatorForm(
                    indicator_instance=self.instance,
                    initial=initial,
                ),
                'indicators': indicators,
                'scenarios': scenarios
            }
        )
        return context

    def post(self, request, **kwargs):
        self.instance = get_object_or_404(
            Instance, slug=kwargs.get('slug', '')
        )
        ids = self.request.GET.get('ids')
        for _id in ids.split(','):
            try:
                indicator = self.instance.indicators.get(id=_id)
                data = request.POST.copy()
                data['instance'] = self.instance.id
                for key, field in IndicatorForm(
                        indicator_instance=self.instance
                ).fields.items():
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
                    instance=indicator,
                    indicator_instance=self.instance
                )
                if form.is_valid():
                    indicator = form.save()
                    for scenario in ScenarioLevel.objects.order_by('level'):
                        rule = request.POST.get(
                            f'scenario_{scenario.id}_rule', None
                        )
                        name = request.POST.get(
                            f'scenario_{scenario.id}_name', None
                        )
                        color = request.POST.get(
                            f'scenario_{scenario.id}_color', None
                        )
                        if rule and name:
                            scenario_rule, created = \
                                IndicatorScenarioRule.objects.get_or_create(
                                    indicator=indicator,
                                    scenario_level=scenario
                                )
                            scenario_rule.name = name
                            scenario_rule.rule = rule
                            scenario_rule.color = color
                            scenario_rule.save()

            except Indicator.DoesNotExist:
                raise Http404(f'Indicator with id {_id} does not exist')
        return redirect(
            reverse(
                'indicator-management-view', args=[self.instance.slug]
            )
        )
