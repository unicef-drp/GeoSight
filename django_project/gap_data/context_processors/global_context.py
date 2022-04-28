from gap_data.models.instance import Instance, InstanceCategory
from gap_data.serializer.instance import InstanceSerializer


def global_context(request):
    instance_categories = {}
    for category in InstanceCategory.objects.all().order_by('order'):
        instance_categories[category.name] = InstanceSerializer(category.instance_set.order_by('name'), many=True).data

    other_instance = Instance.objects.filter(category__isnull=True)
    if other_instance.count() > 0:
        instance_categories['Others'] = InstanceSerializer(Instance.objects.filter(category__isnull=True), many=True).data

    return {
        'instances': InstanceSerializer(Instance.objects.order_by('name'), many=True).data,
        'instance_categories': instance_categories
    }
