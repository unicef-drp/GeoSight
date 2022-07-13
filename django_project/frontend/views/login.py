"""Login View."""

from django.contrib.auth.views import LoginView


class LoginPageView(LoginView):
    """Login Create View."""

    template_name = 'frontend/login.html'
