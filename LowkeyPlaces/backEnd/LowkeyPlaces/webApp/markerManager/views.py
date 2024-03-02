from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from friendManager.views import userEquals
from typing import Callable
from rest_framework.decorators import api_view
from mapManager.serializers import getMap
from mapManager.models import MAP, MAP_USER
from django.core.exceptions import ObjectDoesNotExist
from .serializers import markerSerializer, imageSerializer, markerIdSerializer, updateMarkerActionSerializer, imageIdSerializer
from .models import MARKER, MARKER_IMG
from mapManager.views import authTemplate
from django.conf import settings 
from utils import upload_image_to_bucket, generate_download_signed_url_v4
import os

def authTemplate2(request, result_function):
    print("will enter function:", result_function)
    #authenticate user
    print(request)
    user=userEquals(request)
    if user is None: return Response(status=408)
    
    
    #authenticate mapId
    mapId=getMap(data=request.data)
    if mapId.is_valid() is False:
        return Response(status=400)
    mapId=mapId.validated_data['mapId']
    
    #authenticate this is a real map
    try:
        mapId=MAP.objects.get(id=mapId)
        
        #authenticate this map belongs to user
        try:
            
            #authenticate this map even has the user
            checker = MAP_USER.objects.get(mapId=mapId, userId=user)
            #if they are spectator then ignore 
            if checker.status == 2: return Response(status=400)
            
            print("entering function:\t", result_function)
            
            # finally perform action   
            return result_function(mapId,user,request)
    
    
    #edit the codes here  
        except ObjectDoesNotExist:
            return Response(status=400)
        
        
    except ObjectDoesNotExist:
        return Response(status=400)    

#authTemplate2
@api_view(['POST'])
def placeMarker(request: Response) -> Response:
    def discrete(mapId, user, request):
        if mapId.markerCount == 25:
            return Response(status=497)
        
        marker = markerSerializer(data=request.data)
        if marker.is_valid() is False:
            return Response(status=419)
        marker=marker.validated_data
        markerInstance = MARKER(
            userId=user,
            mapId=mapId
        )
        if 'name' in marker:
            markerInstance.name=marker['name']
            
        if 'desc' in marker:
            markerInstance.desc=marker['desc']
            
        if 'lat' in marker:
            markerInstance.lat=marker['lat']
        
        if 'long' in marker:    
            markerInstance.long=marker['long']
          
        if 'address' in marker:      
            markerInstance.address=marker['address']
        markerInstance.save()        
        return Response(status=201)
    return authTemplate2(request, discrete)


#authTemplate2
#this returns a list of markers (it's fine to send all the marker data at once, since there isnt any scrolling)
@api_view(['POST'])
def getMarkerList(request: Response) -> Response:
    def discrete(mapId, user, request):
        markerList = MARKER.objects.filter(mapId=mapId)
        return Response(status=201, data={i.id:
            {'name':i.name,
             'desc':i.desc,
             'lat': i.lat,
             'long': i.long,
             'address': i.address,
             'imageCount': i.imageCount,
             'timeCreated': i.timeCreated,
             'color': i.color} for i in markerList})
    return authTemplate(request, discrete)


#authTemplate
@api_view(['POST'])
def addMarkerImg(request: Response) -> Response:
    def discrete(mapId, user, request):
        image=imageSerializer(data=request.data)
        markerId=markerIdSerializer(data=request.data)
        if image.is_valid() is False or markerId.is_valid() is False:
            return Response(status=440)
        try:
            #ensure there is a valid marker for this map
            markerId = MARKER.objects.get(id=markerId.validated_data['markerId'], mapId=mapId)
            if markerId.imageCount == 10:
                return Response(status=497)
            
            #save image in a variable
            image=image.validated_data['image']
            
            imageInstance = MARKER_IMG(markerId=markerId)
            imageInstance.save()  
            
            #save the image to file
            markerPath = os.path.join(mapId.mapFolder, "markers", markerId.folderPath, imageInstance.folderPath + '.jpg')
            upload_image_to_bucket('lowkey-spots-bucket',image, markerPath)
            markerId.imageCount+=1
            markerId.save()
            return Response(status = 200)
            
        except ObjectDoesNotExist:
            return Response(status=497)    
    return authTemplate2(request, discrete)


@api_view(['POST'])
def getMarkerImg(request):
    def discrete(mapId, user, request):
        markerId=markerIdSerializer(data=request.data)
        if markerId.is_valid() is False:
            return Response(status=440)
        try:
            #ensure there is a valid marker for this map
            markerId = MARKER.objects.get(id=markerId.validated_data['markerId'], mapId=mapId)
            img = MARKER_IMG.objects.filter(markerId=markerId)
            
            gamma = os.path.join(mapId.mapFolder, 'markers', markerId.folderPath)
            return Response({"image_ids":[generate_download_signed_url_v4('lowkey-spots-bucket', os.path.join(gamma, i.folderPath+ '.jpg')) for i in img]}, status=201)
        except ObjectDoesNotExist:
                return Response(status=500)
    return authTemplate(request, discrete)
        

#authTemplate2
@api_view(['POST'])
#action map: {1: update lat-long, 2: update description, 3: update color}
def updateMarker(request: Response) -> Response:
    def discrete(mapId, user, request): 
        markerId = markerIdSerializer(data=request.data)
        newMarker = markerSerializer(data=request.data)
        if newMarker.is_valid() is False or markerId.is_valid() is False:
            return Response(status=419)
        markerId=markerId.validated_data
        
        newMarker=newMarker.validated_data
        try:
            #ensure there is a valid marker for this map
            old_marker = MARKER.objects.get(id=markerId['markerId'], mapId=mapId)
            #update all success
            if 'name' in newMarker:
                old_marker.name=newMarker['name']   
            if 'desc' in newMarker:
                old_marker.desc=newMarker['desc']
            if 'lat' in newMarker:
                old_marker.lat=newMarker['lat']
            if 'long' in newMarker:
                old_marker.long=newMarker['long']
            if 'address' in newMarker:
                old_marker.address=newMarker['address']
            if 'color' in newMarker:
                old_marker.color=newMarker['color']
            old_marker.save()
            return Response(status=201)
        except ObjectDoesNotExist:
            return Response(status=497)
    return authTemplate2(request, discrete)


#authTemplate2
@api_view(['POST'])
def deleteMarkerImage(request):
    def discrete(mapId, user, request):
        print(request.data)
        markerId=markerIdSerializer(data=request.data)
        if markerId.is_valid() is False:
            return Response(status=440)
        try:
            #ensure there is a valid marker for this map
            markerId = MARKER.objects.get(id=markerId.validated_data['markerId'], mapId=mapId)
            #delete image
            img = imageIdSerializer(data=request.data)
            if img.is_valid() is False:
                return Response(status=440)
                       
            img = MARKER_IMG.objects.get(folderPath = img.validated_data['folderPath'])
            img.delete()
            markerId.imageCount-=1
            markerId.save()
            return Response(status=201)     
        except ObjectDoesNotExist:
                return Response(status=500)
    return authTemplate2(request, discrete)
        
        
#authTemplate2$
@api_view(['POST'])
def deleteMarker(request):
    def discrete(mapId, user, request):
        markerId=markerIdSerializer(data=request.data)
        if markerId.is_valid() is False:
            return Response(status=440)
        try:
            #ensure there is a valid marker for this map
            markerId = MARKER.objects.get(id=markerId.validated_data['markerId'], mapId=mapId)
            markerId.delete()
            mapId.markerCount-=1
            mapId.save()
            return Response(status=201)
        except ObjectDoesNotExist:
                return Response(status=500)
    return authTemplate2(request, discrete)