from .models import USER
from rest_framework import serializers


class registrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = USER
        fields = ['id', 'name', 'psswd']


class loginSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=20)
    psswd = serializers.CharField(max_length=20)
