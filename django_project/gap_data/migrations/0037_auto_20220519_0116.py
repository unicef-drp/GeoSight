# Generated by Django 3.2.13 on 2022-05-19 01:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('gap_data', '0036_dashboard_plugin'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='basemaplayer',
            name='enable_by_default',
        ),
        migrations.RemoveField(
            model_name='basemaplayer',
            name='instance',
        ),
        migrations.RemoveField(
            model_name='basemaplayer',
            name='show_on_map',
        ),
        migrations.RemoveField(
            model_name='basemaplayer',
            name='white_icon',
        ),
        migrations.RemoveField(
            model_name='instance',
            name='white_icon',
        ),
        migrations.RemoveField(
            model_name='link',
            name='instance',
        ),
        migrations.RemoveField(
            model_name='program',
            name='white_icon',
        ),
    ]