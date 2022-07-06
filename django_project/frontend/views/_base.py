"""Base View."""
from django.shortcuts import render
from django.views.generic import View

from core.serializer.user import UserSerializer


class BaseView(View):
    """Base View."""

    def get_context_data(self, **kwargs) -> dict:
        """Get context data."""
        context = {
            'content_title': self.content_title,
            'page_title': self.page_title,
            'user': {}
        }
        if self.request.user.is_authenticated:
            context['user'] = UserSerializer(self.request.user).data
        return context

    def get(self, request, **kwargs):
        """GET function."""
        return render(
            request,
            self.template_name,
            self.get_context_data(**kwargs)
        )

    @property
    def template_name(self):
        """Return template name."""
        raise NotImplementedError

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        raise NotImplementedError

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        raise NotImplementedError
