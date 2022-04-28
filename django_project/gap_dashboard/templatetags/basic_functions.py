from django import template

register = template.Library()


@register.filter
def index(indexable, i):
    """
    Return specific index
    """
    try:
        return indexable[i]
    except IndexError:
        return None


@register.filter
def split(value, key):
    """
    Returns the value turned into a list.
    """
    return str(value).split(key)
