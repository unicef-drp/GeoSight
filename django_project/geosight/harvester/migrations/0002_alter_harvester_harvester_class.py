# Generated by Django 3.2.13 on 2022-07-21 23:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('geosight_harvester', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='harvester',
            name='harvester_class',
            field=models.CharField(choices=[('geosight.harvester.harveters.using_exposed_api.UsingExposedAPI', 'Harvested using exposed API by external client'), ('geosight.harvester.harveters.excel_harvester.ExcelHarvester', 'Excel Harvesters')], help_text='The type of harvester that will be used.Use class with full package.', max_length=256),
        ),
    ]
