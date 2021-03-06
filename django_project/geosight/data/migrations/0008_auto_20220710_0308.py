# Generated by Django 3.2.13 on 2022-07-10 03:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('geosight_data', '0007_alter_indicator_reporting_level'),
    ]

    operations = [
        migrations.CreateModel(
            name='BasemapGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=512)),
                ('description', models.TextField(blank=True, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.RemoveField(
            model_name='basemaplayer',
            name='dashboard_default',
        ),
        migrations.AddField(
            model_name='basemaplayer',
            name='group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='geosight_data.basemapgroup'),
        ),
    ]
