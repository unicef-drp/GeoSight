# Generated by Django 3.2.13 on 2022-07-11 05:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('geosight_data', '0011_auto_20220711_0414'),
    ]

    operations = [
        migrations.AddField(
            model_name='widget',
            name='visible_by_default',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='widget',
            name='dashboard',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='geosight_data.dashboard'),
        ),
    ]