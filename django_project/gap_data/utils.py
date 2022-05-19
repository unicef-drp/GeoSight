"""Utilities."""
import os

from django.templatetags.static import static


def get_level_instance_in_tree(instance, level_instances) -> dict:
    """Return level instance in tree."""
    from gap_data.models import GeometryLevelInstance
    levels = {}
    for top in level_instances:
        levels[top.level.id] = get_level_instance_in_tree(
            instance,
            GeometryLevelInstance.objects.filter(
                instance=instance,
                parent=top.level
            )
        )

    return levels


def sizeof_fmt(num, suffix="B"):
    """Bytes to human readable."""
    for unit in ["", "K", "M", "G", "T", "P", "E", "Z"]:
        if abs(num) < 1024.0:
            return f"{num:3.1f}{unit}{suffix}"
        num /= 1024.0
    return f"{num:.1f}Yi{suffix}"


def path_to_dict(
        path, original_folder=None, ext_filters=None, show_size=False
):
    """Return path as dict with child."""
    filename, ext = os.path.splitext(path)
    if ext_filters and not os.path.isdir(path) and ext not in ext_filters:
        return None
    d = {
        'text': os.path.basename(path),
        'path': path if not original_folder else path.replace(
            original_folder, ''
        ).lstrip('/')
    }
    if os.path.isdir(path):
        d['children'] = []
        for x in os.listdir(path):
            # recursive
            child = path_to_dict(
                os.path.join(path, x), original_folder, ext_filters, show_size
            )
            if child:
                d['children'].append(child)
    else:
        d['type'] = "file"
        d['icon'] = static(f"img/icons/{ext.replace('.', '')}.png")
        if show_size:
            d['text'] += f" ({sizeof_fmt(os.path.getsize(path))})"
    return d
