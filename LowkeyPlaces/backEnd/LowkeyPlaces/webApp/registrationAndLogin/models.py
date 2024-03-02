from django.db import models

# Create your models here.
class USER(models.Model):
    name=models.CharField(max_length = 24, unique=True)
    psswd=models.CharField(max_length=90)
    dateTimeCreated=models.DateTimeField(auto_now_add=True)
    isDeleted=models.BooleanField(default=False)
    mapCount=models.IntegerField(default=0)
    token=models.CharField(max_length = 15)