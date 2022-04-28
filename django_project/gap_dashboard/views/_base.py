from django.shortcuts import render
from django.views.generic import View


class BaseView(View):

    def get_context_data(self, **kwargs) -> dict:
        context = {
            'content_title': self.content_title,
            'page_title': self.page_title
        }
        return context

    def get(self, request, **kwargs):
        return render(
            request,
            self.template_name,
            self.get_context_data(**kwargs)
        )

    @property
    def template_name(self):
        raise NotImplementedError

    @property
    def content_title(self):
        raise NotImplementedError

    @property
    def page_title(self):
        raise NotImplementedError
