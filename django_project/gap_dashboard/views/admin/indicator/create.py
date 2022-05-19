"""Indicator Creation View."""
from django.shortcuts import redirect, reverse, render, get_object_or_404

from gap_dashboard.forms.indicator import IndicatorForm
from gap_dashboard.views.admin._base import AdminView
from gap_data.models import Indicator


class IndicatorCreateView(AdminView):
    """Indicator Creation View."""

    template_name = 'dashboard/admin/indicator/form.html'

    @property
    def page_title(self):
        """Return page title."""
        return 'Create New Indicator'

    @property
    def content_title(self):
        """Return content title."""
        return ''

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        scenarios = []
        from_id = self.request.GET.get('from')
        initial = None
        if from_id:
            try:
                indicator = Indicator.objects.get(id=from_id)
                initial = IndicatorForm.model_to_initial(indicator)
                initial['name'] = None
                initial['description'] = None
                scenarios = indicator.scenarios_dict()
            except Indicator.DoesNotExist:
                pass

        context.update(
            {
                'form': IndicatorForm(
                    initial=initial,
                ),
                'scenarios': scenarios,
                'is_create': True
            }
        )
        return context

    def post(self, request, **kwargs):
        """Create indicator."""
        form = IndicatorForm(
            request.POST
        )
        if form.is_valid():
            indicator = form.save()
            # rule = request.POST.get(f'scenario_{scenario.id}_rule', None)
            # name = request.POST.get(f'scenario_{scenario.id}_name', None)
            # color = request.POST.get(f'scenario_{scenario.id}_color', None)
            # if rule and name:
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
                    'indicator-management-view', args=[self.instance.slug]
                )
            )
        context = self.get_context_data(**kwargs)
        context['form'] = form
        context['is_create'] = True
        return render(
            request,
            self.template_name,
            context
        )
