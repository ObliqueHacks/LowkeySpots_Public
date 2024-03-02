from django.db import models
from registrationAndLogin.models import USER
from mapManager.models import MAP
from datetime import datetime 
from django.conf import settings 
import uuid


def generate_uuid():
    return str(uuid.uuid4())

# Create your models here.
class MARKER(models.Model):
    name=models.CharField(default="No Name", max_length=30)
    desc=models.TextField(default="")
    lat=models.FloatField(default=0.0)
    long=models.FloatField(default=0.0)
    address=models.CharField(max_length=100)
    color=models.CharField(max_length=10, default="Default")
    
    mapId=models.ForeignKey(MAP, on_delete=models.CASCADE, related_name='markerToMapId')
    userId=models.ForeignKey(USER, on_delete=models.CASCADE, related_name='markerToUserId')
    imageCount=models.IntegerField(default=0)
    timeCreated=models.DateTimeField(default=datetime.now)
    folderPath=models.CharField(default=generate_uuid, max_length=36)
    
class MARKER_IMG(models.Model):
    markerId=models.ForeignKey(MARKER, on_delete=models.CASCADE, related_name='imgToMarkerId')
    folderPath=models.CharField(default=generate_uuid, max_length=36)
    pass
