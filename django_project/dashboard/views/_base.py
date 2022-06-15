"""Base View."""
from django.shortcuts import render
from django.views.generic import View


class BaseView(View):
    """Base View."""

    def get_context_data(self, **kwargs) -> dict:
        """Get context data."""
        context = {
            'content_title': self.content_title,
            'page_title': self.page_title
        }
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
    def content_title(self):
        """Return content title."""
        raise NotImplementedError

    @property
    def page_title(self):
        """Return page title."""
        raise NotImplementedError
