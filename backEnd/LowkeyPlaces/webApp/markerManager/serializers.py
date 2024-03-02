from rest_framework import serializers
from .models import MARKER


class markerSerializer(serializers.Serializer):
    name=serializers.CharField(required=False, max_length=30)
    desc=serializers.CharField(required=False)
    lat=serializers.FloatField(required=False)
    long=serializers.FloatField(required=False)
    address=serializers.CharField(required=False, max_length=150)
    color=serializers.CharField(required=False, max_length=10)

class imageSerializer(serializers.Serializer):
    image=serializers.ImageField()
    
class markerIdSerializer(serializers.Serializer):
    markerId=serializers.IntegerField()
    
class updateMarkerActionSerializer(serializers.Serializer):
    action=serializers.IntegerField()
    
class imageIdSerializer(serializers.Serializer):
    folderPath=serializers.CharField(max_length=300)