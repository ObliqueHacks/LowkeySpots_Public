from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import toUserAction, getUser
from .models import USER
from django.utils import timezone
from rest_framework import status
from utils import create_token, token_to_user, intToAction, error_returner
from .models import FRIEND_REQUEST, USER_RELATION
from datetime import datetime
from django.core.exceptions import ValidationError
# all respnses to makeRequest are binary in status code
#specific error message may be displayed if frontend desires.

def userEquals(request: Response) -> USER:
    session_id = request.COOKIES.get('genToken', None)
    user=token_to_user(session_id)
    return user


@api_view(['POST'])
def makeRequest(request):
    
    sender=userEquals(request)
    if sender is None: return Response(status=408)


    user=toUserAction(data=request.data)
    if user.is_valid() is False:
        return Response(status=400)
    
    
    #authenticate action
    action=intToAction(user.validated_data['action'])
    if action is None:
        return Response(status = 400) #invalid action
    
    #authenticate receiver
    rec=USER.objects.filter(name=user.validated_data['name'])
    if rec.first() is None:
        return Response(status = 404) #User doesn't exist

    #protect against self ref
    rec=rec.first()            
    if (rec==sender): return Response(status = 400)


    #handle friend request
    if action == 'sendFriendReq':
        #already friends or blocked
        if USER_RELATION.objects.filter(user1=sender, user2=rec).first() is not None:
            return Response(status = 409)
        
        #already pending request (resolve the case by changing the reqest type)
        elif FRIEND_REQUEST.objects.filter(sendId=rec, recId=sender).first() is not None:
            action='acceptFriendReq'
            
        #request already sent
        elif FRIEND_REQUEST.objects.filter(sendId=sender,recId=rec).first() is not None:
            return Response(status = 422)
        
        #process valid request
        else:
            new_instance=FRIEND_REQUEST(sendId=sender, recId=rec)
            new_instance.save()
            return Response(status=201)


    #if user accepts
    if action=='acceptFriendReq':
        rec,sender=sender,rec #flip to see if there even is an inconming request
        if FRIEND_REQUEST.objects.filter(sendId=sender, recId=rec).first() is not None:
            
            #create two way relation
            new_relation=USER_RELATION(user1=sender, user2=rec, status=1)
            new_relation.save()

            new_relation=USER_RELATION(user1=rec, user2=sender, status=1)
            new_relation.save()

            #remove pending requests
            FRIEND_REQUEST.objects.get(sendId=sender, recId=rec).delete()
            return Response(status=201)
        return Response(status = 404) 
            
   
            
    # if user rejects        
    if action=='rejectFriendReq':
        rec,sender=sender,rec #flip to see if there even is an inconming request
        friend_request=FRIEND_REQUEST.objects.filter(sendId=sender, recId=rec).first()
        if friend_request is not None:
            friend_request.delete()
            return Response(status=201)
        return error_returner('no_friend_request_found')



    if action=='blockFriendReq':
        pass


    if action == 'removeFriend':
        if USER_RELATION.objects.filter(user1=sender, user2=rec).first() is not None:
            a=USER_RELATION.objects.filter(user1=sender, user2=rec).first()
            a.delete()
            a=USER_RELATION.objects.filter(user1=rec, user2=sender).first()
            a.delete()
            return Response(status=201)
        return Response(status=408)
            
            
            
    if action=='blockFriend':
        pass


    if action=='unblockUser':
        pass


@api_view(['POST'])
def getUserInfo(request):

    user=userEquals(request)
    if user is None: return Response(status=408)
    
    #construct user data (for now include -> incoming friend requests, sent friend requests, friends, map_count) 
    #for getting which maps you are part of it will be done in maps itself
    incomingRequests=[i.sendId.name for i in FRIEND_REQUEST.objects.filter(recId=user)]
    sentRequests=[i.recId.name for i in FRIEND_REQUEST.objects.filter(sendId=user)]
    friends=[i.user2.name for i in USER_RELATION.objects.filter(user1=user, status=1)]
    blocks=[i.user2.name for i in USER_RELATION.objects.filter(user1=user, status=2)]
    mapCount=user.mapCount
    
    
    return Response({
        'incomingRequests': incomingRequests,
        'sentRequests': sentRequests,
        'friends': friends,
        'blocks': blocks,
        'mapCount': mapCount,
        'name': user.name
    }, status=201)