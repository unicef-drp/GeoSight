from django import forms
from django.core.exceptions import ValidationError
from django.forms.models import model_to_dict

from gap_data.models.instance import Instance, InstanceCategory


class InstanceForm(forms.ModelForm):
    """
    Form to upload CSV file.
    """
    label_suffix = ""
    category = forms.ChoiceField(required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['category'].choices = [('', '')] + [
            (
                group.name, group.name
            ) for group in InstanceCategory.objects.order_by('name')
        ]

        try:
            if self.data['category']:
                self.fields['category'].choices += [
                    (self.data['category'], self.data['category'])
                ]
        except KeyError:
            pass

    class Meta:
        model = Instance
        exclude = ('slug', 'white_icon')

    def clean_name(self):
        name = self.cleaned_data['name']
        if self.instance and self.instance.name_is_exist(name):
            raise ValidationError('This name already exist')
        elif not self.instance and Instance.name_is_exist_of_all(name):
            raise ValidationError('This name already exist')
        return name

    def clean_category(self):
        category = self.cleaned_data['category']
        if not category:
            return None
        instance_category, created = InstanceCategory.objects.get_or_create(
            name=category
        )
        return instance_category

    @staticmethod
    def model_to_initial(instance: Instance):
        initial = model_to_dict(instance)
        try:
            initial['category'] = InstanceCategory.objects.get(
                id=initial['category']
            ).name
        except InstanceCategory.DoesNotExist:
            initial['category'] = None
        return initial
