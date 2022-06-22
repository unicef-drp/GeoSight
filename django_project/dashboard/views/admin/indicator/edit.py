"""Indicator Editor View."""
from django.shortcuts import redirect, reverse, render, get_object_or_404

from dashboard.forms.indicator import IndicatorForm
from dashboard.views.admin._base import AdminView
from geosight.data.models import Indicator, IndicatorRule


class IndicatorEditView(AdminView):
    """Indicator Editor View."""

    template_name = 'admin/indicator/form.html'

    @property
    def page_title(self):
        """Return page title."""
        indicator = get_object_or_404(
            Indicator, id=self.kwargs.get('pk', '')
        )
        return f'Edit Indicator : {indicator.__str__()}'

    @property
    def content_title(self):
        """Return content title."""
        return ''

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        indicator = get_object_or_404(
            Indicator, id=self.kwargs.get('pk', '')
        )

        rules = indicator.rules_dict()
        context.update(
            {
                'form': IndicatorForm(
                    initial=IndicatorForm.model_to_initial(indicator)
                ),
                'rules': rules
            }
        )
        return context

    def post(self, request, **kwargs):
        """Save indicator."""
        indicator = get_object_or_404(
            Indicator, id=self.kwargs.get('pk', '')
        )
        form = IndicatorForm(
            request.POST,
            instance=indicator
        )
        if form.is_valid():
            indicator = form.save()
            indicator.indicatorrule_set.all().delete()

            for req_key, value in request.POST.dict().items():
                if 'rule_name_' in req_key:
                    idx = req_key.replace('rule_name_', '')
                    name = request.POST.get(f'rule_name_{idx}', None)
                    rule = request.POST.get(f'rule_rule_{idx}', None)
                    color = request.POST.get(f'rule_color_{idx}', None)
                    outline_color = request.POST.get(
                        f'rule_outline_color_{idx}', None)
                    if rule and name:
                        indicator_rule, created = \
                            IndicatorRule.objects.get_or_create(
                                indicator=indicator,
                                name=name
                            )
                        indicator_rule.rule = rule
                        indicator_rule.color = color
                        indicator_rule.outline_color = outline_color
                        indicator_rule.save()
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
