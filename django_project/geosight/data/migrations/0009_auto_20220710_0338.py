# Generated by Django 3.2.13 on 2022-07-10 03:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('geosight_data', '0008_auto_20220710_0308'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contextlayergroup',
            name='group',
        ),
        migrations.AlterField(
            model_name='contextlayer',
            name='password',
            field=models.CharField(blank=True, help_text='Password to access the layer if needed.', max_length=512, null=True),
        ),
        migrations.AlterField(
            model_name='contextlayer',
            name='token',
            field=models.CharField(blank=True, help_text='Token to access the layer if needed.', max_length=512, null=True),
        ),
        migrations.AlterField(
            model_name='contextlayer',
            name='username',
            field=models.CharField(blank=True, help_text='Username to access the layer if needed.', max_length=512, null=True),
        ),
    ]
