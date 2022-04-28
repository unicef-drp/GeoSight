from django import forms

from gap_data.models.indicator.indicator_value import IndicatorValue


class IndicatorValueForm(forms.ModelForm):
    class Meta:
        model = IndicatorValue
        fields = '__all__'
