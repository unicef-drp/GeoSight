# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def run(apps, schema_editor):
    Dashboard = apps.get_model("geosight_data", "Dashboard")
    DashboardIndicator = apps.get_model("geosight_data", "DashboardIndicator")
    DashboardBasemap = apps.get_model("geosight_data", "DashboardBasemap")
    DashboardContextLayer = apps.get_model(
        "geosight_data", "DashboardContextLayer")

    for dashboard in Dashboard.objects.all():
        # Dashboard indicator
        dashboard.dashboardindicator_set.all().delete()
        for idx, model in enumerate(dashboard.indicators.all()):
            DashboardIndicator.objects.create(
                dashboard=dashboard,
                group=model.group.name if model.group else '',
                order=idx,
                visible_by_default=idx == 0,
                indicator=model
            )
        # Dashboard DashboardBasemap
        dashboard.dashboardbasemap_set.all().delete()
        for idx, model in enumerate(dashboard.basemap_layers.all()):
            DashboardBasemap.objects.create(
                dashboard=dashboard,
                order=idx,
                visible_by_default=idx == 0,
                basemap=model
            )
        # Dashboard DashboardContextLayer
        dashboard.dashboardcontextlayer_set.all().delete()
        for idx, model in enumerate(dashboard.context_layers.all()):
            DashboardContextLayer.objects.create(
                dashboard=dashboard,
                group=model.group.name if model.group else '',
                order=idx,
                context_layer=model
            )


class Migration(migrations.Migration):
    dependencies = [
        (
            'geosight_data',
            '0013_dashboardbasemap_dashboardcontextlayer_dashboardindicator'
        )
    ]

    operations = [
        migrations.RunPython(run, migrations.RunPython.noop),
    ]
