# Generated by Django 3.2.13 on 2022-06-22 04:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('geosight_data', '0003_auto_20220621_0527'),
    ]

    operations = [
        migrations.AddField(
            model_name='indicatorrule',
            name='outline_color',
            field=models.CharField(default='#000000', help_text='Color for the outline of geometry on map.', max_length=16),
        ),
    ]
