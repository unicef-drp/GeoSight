"""Admin Indicator Create View."""

from braces.views import SuperuserRequiredMixin
from django.shortcuts import redirect, reverse, render

from frontend.views._base import BaseView
from geosight.data.forms.indicator import IndicatorForm
from geosight.data.models.indicator import Indicator, IndicatorRule


class IndicatorCreateView(SuperuserRequiredMixin, BaseView):
    """Indicator Create View."""

    template_name = 'frontend/admin/indicator/form.html'

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Create Indicator'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        return '<span>Indicators</span> <span>></span> <span>Create</span>'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        rules = []
        initial = None

        # from_id used for duplication
        from_id = self.request.GET.get('from')
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
                'form': IndicatorForm(initial=initial),
                'rules': rules
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
            return redirect(reverse('admin-indicator-list-view'))
        context = self.get_context_data(**kwargs)
        context['form'] = form
        return render(
            request,
            self.template_name,
            context
        )
