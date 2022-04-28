from rest_framework import serializers

from gap_harvester.models.harvester_log import HarvesterLog


class HarvesterLogSerializer(serializers.ModelSerializer):
    html_detail = serializers.SerializerMethodField()

    def get_html_detail(self, obj: HarvesterLog):
        return obj.html_detail()

    class Meta:
        model = HarvesterLog
        fields = '__all__'
