"""Admin Indicator Edit View."""

from braces.views import SuperuserRequiredMixin
from django.shortcuts import get_object_or_404
from django.shortcuts import redirect, reverse, render

from frontend.views._base import BaseView
from geosight.data.forms.indicator import IndicatorForm
from geosight.data.models.indicator import Indicator, IndicatorRule


class IndicatorEditView(SuperuserRequiredMixin, BaseView):
    """Indicator Edit View."""

    template_name = 'frontend/admin/indicator/form.html'

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Create Indicator'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        indicator = get_object_or_404(
            Indicator, id=self.kwargs.get('pk', '')
        )
        return f'<span>Indicators</span> <span>></span> <span>{indicator.__str__()}</span>'

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
        """Edit indicator."""
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
            return redirect(reverse('admin-indicator-list-view'))
        context = self.get_context_data(**kwargs)
        context['form'] = form
        return render(request, self.template_name, context)
