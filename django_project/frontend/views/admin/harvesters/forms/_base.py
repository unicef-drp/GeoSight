"""Harvester base."""
from abc import ABC

from braces.views import SuperuserRequiredMixin
from django.http import HttpResponseBadRequest
from django.shortcuts import redirect, reverse, get_object_or_404
from django.utils.module_loading import import_string

from frontend.views._base import BaseView
from geosight.data.models import Indicator
from geosight.harvester.models import (
    HARVESTERS, Harvester, HarvesterAttribute, HarvesterMappingValue
)


class HarvesterFormView(SuperuserRequiredMixin, BaseView, ABC):
    """HarvesterForm Base View."""

    indicator = None
    harvester_class = None

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Harvester'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        return f'Harvester for {self.indicator.__str__()}'

    def get_indicator(self):
        """Return indicator and save it as attribute."""
        self.indicator = get_object_or_404(
            Indicator, id=self.kwargs.get('pk', '')
        )
        return self.indicator

    def get_harvester(self) -> Harvester:
        """Return harvester."""
        return self.indicator.harvester

    @property
    def harvesters(self) -> list:
        """Return harvesters."""
        return HARVESTERS

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        self.get_indicator()
        context = super().get_context_data(**kwargs)
        attributes = []
        mapping = []
        harvester = None
        try:
            harvester = self.get_harvester()
            for _map in harvester.harvestermappingvalue_set.order_by(
                    'remote_value'
            ):
                mapping.append(
                    {
                        'remote_value': _map.remote_value,
                        'platform_value': _map.platform_value
                    }
                )
        except Harvester.DoesNotExist:
            pass

        harvester_class = str(self.harvester_class).split("'")[1]
        for name, attr in self.harvester_class.additional_attributes(
                indicator=self.indicator
        ).items():
            value = attr.get('value', '')
            try:
                if name != 'API URL' and harvester:
                    value = harvester.harvesterattribute_set.get(
                        name=name
                    ).value
            except HarvesterAttribute.DoesNotExist:
                pass

            attributes.append(
                {
                    'name': name,
                    'title': attr.get('title', name).replace(
                        '_', ' ').capitalize(),
                    'value': value if value else '',
                    'description': attr.get('description', ''),
                    'required': attr.get('required', True),
                    'type': attr.get('type', ''),
                    'class': attr.get('class', ''),
                    'data': attr.get('data', {}),
                    'read_only': attr.get('read_only', False),
                }
            )
        context.update(
            {
                'indicator': self.indicator,
                'harvesters': [
                    {
                        'name': harvester[1],
                        'value': harvester[0],
                        'description': import_string(
                            harvester[0]
                        ).description,
                        'url': reverse(
                            harvester[0], args=[self.indicator.id]
                        ) if self.indicator else ''
                    } for harvester in self.harvesters
                ],
                'harvester_class': harvester_class,
                'attributes': attributes,
                'mapping': mapping
            }
        )
        return context

    def post(self, request, **kwargs):
        """POST save harvester."""
        indicator = self.get_indicator()
        try:
            data = request.POST.copy()
            data['attribute_extra_columns'] = ','.join(
                request.POST.getlist('attribute_extra_columns')
            )
            data['attribute_extra_keys'] = ','.join(
                request.POST.getlist('attribute_extra_keys')
            )
            harvester_class = data['harvester']
            try:
                harvester = self.get_harvester()
            except Harvester.DoesNotExist:
                if indicator:
                    try:
                        harvester = indicator.harvester
                    except Harvester.DoesNotExist:
                        harvester = Harvester()
                        harvester.indicator = indicator
                else:
                    harvester = Harvester.objects.create(
                        harvester_class=harvester_class
                    )

            harvester.harvesterattribute_set.all().delete()
            harvester.harvestermappingvalue_set.all().delete()

            harvester.harvester_class = harvester_class
            harvester.save()

            for key, value in data.items():
                if value:
                    if 'attribute_' in key:
                        try:
                            attribute = harvester.harvesterattribute_set.get(
                                name=key.replace('attribute_', '')
                            )
                            attribute.value = value
                            attribute.save()
                        except HarvesterAttribute.DoesNotExist:
                            pass
                    if 'mapping_remote_' in key:
                        try:
                            mapping_id = key.replace('mapping_remote_', '')
                            mapping_remote = value
                            mapping_platform = data[
                                'mapping_platform_' + mapping_id]
                            HarvesterMappingValue.objects.get_or_create(
                                harvester=harvester,
                                remote_value=mapping_remote,
                                defaults={
                                    'platform_value': mapping_platform
                                }
                            )
                        except KeyError:
                            pass

            # this is for files
            for key, _file in request.FILES.items():
                if _file:
                    if 'attribute_' in key:
                        try:
                            attribute = harvester.harvesterattribute_set.get(
                                name=key.replace('attribute_', '')
                            )
                            attribute.file = _file
                            attribute.save()
                        except HarvesterAttribute.DoesNotExist:
                            pass

            self.after_post(harvester)
            if indicator:
                return redirect(
                    reverse(
                        'harvester-indicator-detail', args=[
                            indicator.id
                        ]
                    )
                )
            else:
                return redirect(
                    reverse(
                        'meta-ingestor-detail', args=[
                            str(harvester.unique_id)
                        ]
                    )
                )
        except KeyError as e:
            return HttpResponseBadRequest(f'{e} is required')

    def after_post(self, harvester: Harvester):
        """For calling after post success."""
        pass
