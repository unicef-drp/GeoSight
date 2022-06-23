"""Indicator Creation View."""
from django.shortcuts import redirect, reverse, render

from dashboard.forms.indicator import IndicatorForm
from dashboard.views.admin._base import AdminView
from geosight.data.models import Indicator, IndicatorRule


class IndicatorCreateView(AdminView):
    """Indicator Creation View."""

    template_name = 'admin/indicator/form.html'

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
        rules = []
        from_id = self.request.GET.get('from')
        initial = None
        if from_id:
            try:
                indicator = Indicator.objects.get(id=from_id)
                initial = IndicatorForm.model_to_initial(indicator)
                initial['name'] = None
                initial['description'] = None
                rules = indicator.rules_dict()
            except Indicator.DoesNotExist:
                pass

        context.update(
            {
                'form': IndicatorForm(
                    initial=initial,
                ),
                'rules': rules,
                'is_create': True
            }
        )
        return context

    def post(self, request, **kwargs):
        """Create indicator."""
        form = IndicatorForm(request.POST)
        if form.is_valid():
            indicator = form.save()
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
        context['is_create'] = True
        return render(
            request,
            self.template_name,
            context
        )
