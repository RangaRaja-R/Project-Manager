# Generated by Django 4.1.13 on 2024-05-24 12:49

import api.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
                ('objects', api.models.UserManager()),
            ],
        ),
    ]
