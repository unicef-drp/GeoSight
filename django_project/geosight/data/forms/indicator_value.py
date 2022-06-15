"""For of IndicatorValue."""
from django import forms

from geosight.data.models.indicator.indicator_value import IndicatorValue


class IndicatorValueForm(forms.ModelForm):
    """For of IndicatorValue."""

    class Meta:  # noqa: D106
        model = IndicatorValue
        fields = '__all__'
