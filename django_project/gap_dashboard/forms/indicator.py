"""Indicator form."""
from django import forms
from django.forms.models import model_to_dict

from gap_data.models.indicator import (
    Indicator, IndicatorFrequency, IndicatorGroup, frequency_help_text,
)


class IndicatorForm(forms.ModelForm):
    """Indicator form."""

    label_suffix = ""
    frequency = forms.IntegerField(help_text=frequency_help_text)
    group = forms.ChoiceField()

    def __init__(self, *args, **kwargs):
        """Init."""
        super().__init__(*args, **kwargs)
        self.fields['aggregation_behaviour'].label = 'Reporting Behaviour'
        self.fields['group'].choices = [('', '')] + [
            (group.name, group.name)
            for group in IndicatorGroup.objects.all().order_by('name')
        ]

        try:
            if self.data['group']:
                self.fields['group'].choices += [
                    (self.data['group'], self.data['group'])
                ]
        except KeyError:
            pass

    class Meta:  # noqa: D106
        model = Indicator
        exclude = (
            'order', 'geometry_reporting_units',
            'instance', 'show_in_context_analysis'
        )

    def clean_frequency(self):
        """Return frequency."""
        frequency = self.cleaned_data['frequency']
        indicator_frequency, created = \
            IndicatorFrequency.objects.get_or_create(
                name=f'{frequency} days',
                frequency=frequency
            )
        return indicator_frequency

    def clean_group(self):
        """Return group."""
        group = self.cleaned_data['group']
        indicator_group, created = IndicatorGroup.objects.get_or_create(
            name=group
        )
        return indicator_group

    @staticmethod
    def model_to_initial(indicator: Indicator):
        """Return model data as json."""
        from gap_data.models.indicator import IndicatorGroup
        from gap_data.models.indicator import IndicatorFrequency
        initial = model_to_dict(indicator)
        try:
            initial['group'] = IndicatorGroup.objects.get(
                id=initial['group']
            ).name
        except IndicatorGroup.DoesNotExist:
            initial['group'] = None
        try:
            initial['frequency'] = IndicatorFrequency.objects.get(
                id=initial['frequency']
            ).frequency
        except IndicatorFrequency.DoesNotExist:
            initial['frequency'] = None
        return initial
