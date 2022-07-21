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


@register.filter
def js_json(input):
    """Js to json."""
    if isinstance(input, list):
        for row in input:
            for key, value in row.items():
                if row[key] == True:  # noqa: E712
                    row[key] = 'true'
                elif row[key] == False:  # noqa: E712
                    row[key] = 'false'
                elif row[key] == None:  # noqa: E712,E711
                    row[key] = ''
        return input
    elif isinstance(input, dict):
        for key, value in input.items():
            if input[key] == True:  # noqa: E712
                input[key] = 'true'
            elif input[key] == False:  # noqa: E712
                input[key] = 'false'
            elif input[key] == None:  # noqa: E712,E711
                input[key] = ''
        return input
    else:
        return input
