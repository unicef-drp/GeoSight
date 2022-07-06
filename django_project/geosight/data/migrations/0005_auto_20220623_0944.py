# Generated by Django 3.2.13 on 2022-06-23 09:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('geosight_data', '0004_indicatorrule_outline_color'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='referencelayer',
            name='geometries',
        ),
        migrations.AlterUniqueTogether(
            name='referencelayerlevel',
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name='referencelayerlevel',
            name='level_name',
        ),
        migrations.RemoveField(
            model_name='referencelayerlevel',
            name='reference_layer',
        ),
        migrations.DeleteModel(
            name='Geometry',
        ),
        migrations.DeleteModel(
            name='GeometryLevelName',
        ),
        migrations.DeleteModel(
            name='ReferenceLayer',
        ),
        migrations.DeleteModel(
            name='ReferenceLayerLevel',
        ),
    ]