from django import forms
from django.forms.models import model_to_dict

from gap_data.models.indicator import (
    Indicator, IndicatorFrequency, IndicatorGroup, frequency_help_text,
)
from gap_data.models.instance import Instance


class IndicatorForm(forms.ModelForm):
    """
    Indicator form
    """
    label_suffix = ""
    instance = forms.ModelChoiceField(
        Instance.objects.all()
    )
    frequency = forms.IntegerField(
        help_text=frequency_help_text
    )
    group = forms.ChoiceField()

    def __init__(self, *args, **kwargs):
        instance = kwargs.pop("indicator_instance")
        super().__init__(*args, **kwargs)
        self.fields['instance'].initial = instance
        self.fields['geometry_reporting_level'].choices = [
            (u.id, u.name) for u in instance.geometry_levels_in_order
        ]
        self.fields['aggregation_behaviour'].label = 'Reporting Behaviour'
        self.fields['group'].choices = [('', '')] + [
            (group.name, group.name)
            for group in IndicatorGroup.objects.filter(
                instance=instance
            ).order_by('name')
        ]

        try:
            if self.data['group']:
                self.fields['group'].choices += [
                    (self.data['group'], self.data['group'])
                ]
        except KeyError:
            pass

    class Meta:
        model = Indicator
        exclude = (
            'order', 'geometry_reporting_units',
            'instance', 'show_in_context_analysis'
        )

    def clean_frequency(self):
        frequency = self.cleaned_data['frequency']
        indicator_frequency, created = \
            IndicatorFrequency.objects.get_or_create(
                name=f'{frequency} days',
                frequency=frequency
            )
        return indicator_frequency

    def clean_group(self):
        group = self.cleaned_data['group']
        instance = Instance.objects.get(id=self.data['instance'])
        indicator_group, created = IndicatorGroup.objects.get_or_create(
            name=group,
            instance=instance
        )
        return indicator_group

    @staticmethod
    def model_to_initial(indicator: Indicator):
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
