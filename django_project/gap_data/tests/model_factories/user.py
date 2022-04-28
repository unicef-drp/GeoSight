import factory
from django.contrib.auth import get_user_model

User = get_user_model()


class UserF(factory.django.DjangoModelFactory):
    username = factory.Sequence(lambda n: 'user_{}'.format(n))
    password = factory.PostGenerationMethodCall('set_password', 'password')

    class Meta:
        model = User
