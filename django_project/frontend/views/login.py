"""Login View."""

from django.contrib.auth.views import LoginView

from core.serializer.user import UserSerializer


class LoginPageView(LoginView):
    """Login Create View."""

    template_name = 'frontend/login.html'

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Log In'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        return 'Log In'

    def get_context_data(self, **kwargs) -> dict:
        """Get context data."""
        context = super().get_context_data(**kwargs)
        context.update({
            'content_title': self.content_title,
            'page_title': self.page_title,
            'user': {}
        })
        if self.request.user.is_authenticated:
            context['user'] = UserSerializer(self.request.user).data
        return context
