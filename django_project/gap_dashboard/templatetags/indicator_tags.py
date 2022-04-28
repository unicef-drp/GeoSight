from django import template

register = template.Library()


@register.simple_tag(name='get_scenario_rule')
def get_scenario_rule(indicator: dict, level):
    return indicator.get(f'scenario_{level}', '-')
