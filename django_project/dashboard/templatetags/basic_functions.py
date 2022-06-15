"""Basic functions."""
from django import template

register = template.Library()


@register.filter
def index(indexable, i):
    """For returning specific index."""
    try:
        return indexable[i]
    except IndexError:
        return None


@register.filter
def split(value, key):
    """For splitting the value turned into a list."""
    return str(value).split(key)
