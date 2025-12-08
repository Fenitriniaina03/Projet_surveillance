# monitor/serializers.py
from rest_framework import serializers
from .models import SiteCheck

class SiteCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteCheck
        fields = "__all__"

