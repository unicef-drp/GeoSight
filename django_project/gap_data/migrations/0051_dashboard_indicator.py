# Generated by Django 3.2.13 on 2022-05-19 23:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gap_data', '0050_referencelayerlevel'),
    ]

    operations = [
        migrations.AddField(
            model_name='dashboard',
            name='Indicator',
            field=models.ManyToManyField(to='gap_data.Indicator'),
        ),
    ]
