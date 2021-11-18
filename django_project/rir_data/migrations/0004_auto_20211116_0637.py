# Generated by Django 3.2.8 on 2021-11-16 06:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rir_data', '0003_auto_20211115_0530'),
    ]

    operations = [
        migrations.AddField(
            model_name='indicator',
            name='geometry_reporting_units',
            field=models.ManyToManyField(blank=True, to='rir_data.Geometry'),
        ),
        migrations.AlterField(
            model_name='indicator',
            name='aggregation_behaviour',
            field=models.CharField(choices=[('Use all available populated geography in current time window', 'Use all available populated geography in current time window')], default='Use all available populated geography in current time window', max_length=256),
        ),
    ]
