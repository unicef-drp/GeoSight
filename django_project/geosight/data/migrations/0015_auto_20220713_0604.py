# Generated by Django 3.2.13 on 2022-07-13 06:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('geosight_data', '0014_dashboard_data_migrations'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dashboard',
            name='basemap_layers',
        ),
        migrations.RemoveField(
            model_name='dashboard',
            name='context_layers',
        ),
        migrations.RemoveField(
            model_name='dashboard',
            name='default_basemap_layer',
        ),
        migrations.RemoveField(
            model_name='dashboard',
            name='indicators',
        ),
    ]
