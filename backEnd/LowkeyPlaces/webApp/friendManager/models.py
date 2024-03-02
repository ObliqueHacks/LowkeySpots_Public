from django.db import models
from registrationAndLogin.models import USER
# Create your models here.
class USER_RELATION(models.Model):
    user1=models.ForeignKey(USER, on_delete=models.CASCADE, related_name='usrRelToUser1')
    user2=models.ForeignKey(USER, on_delete=models.CASCADE, related_name='usrRelToUser2')
    status=models.IntegerField()

class FRIEND_REQUEST(models.Model):
    sendId=models.ForeignKey(USER, on_delete=models.CASCADE, related_name='senderToUser')
    recId=models.ForeignKey(USER, on_delete=models.CASCADE, related_name='receiverToUser')
    