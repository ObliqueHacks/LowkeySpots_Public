from django.test import TestCase
from registrationAndLogin.views import register, login
from registrationAndLogin.models import USER
from rest_framework.test import APIRequestFactory
from rest_framework.response import Response
from rest_framework import status
from utils import create_token
from django.core.exceptions import ValidationError
from friendManager.models import FRIEND_REQUEST, USER_RELATION
from friendManager.views import makeRequest, getUserInfo
from mapManager.views import makeMap,addFriendToMap, getMapUsers, getUserMaps, getMapFromId, editMapFeatures

from userAndFriends_test import CommonSetup

class TestMakeMap(TestCase, CommonSetup):
    def setUp(self):
        super().start()
        
    def test_makeMap(self):
        #assert map requests can be made
        request=self.factory.post('/api-auth/map/make-map/', {"userToken": self.user1}, format='json')
        response=makeMap(request)
        self.assertEqual(201, response.status_code)
        
        #do it again with a diff user
        request=self.factory.post('/api-auth/map/make-map/', {"userToken": self.user2}, format='json')
        response=makeMap(request)
        self.assertEqual(201, response.status_code)
        
        #check if incorrect token is not taken
        request=self.factory.post('/api-auth/map/make-map/', {"userToken": "3dkjgfdln"}, format='json')
        response=makeMap(request)
        self.assertEqual(408, response.status_code)
    
    def test_getUserMaps(self):
        #make user make 5 maps
        request=self.factory.post('/api-auth/map/make-map/', {"userToken": self.user1}, format='json')
        makeMap(request)
        request=self.factory.post('/api-auth/map/make-map/', {"userToken": self.user1}, format='json')
        makeMap(request)
        request=self.factory.post('/api-auth/map/make-map/', {"userToken": self.user1}, format='json')
        makeMap(request)
        request=self.factory.post('/api-auth/map/make-map/', {"userToken": self.user2}, format='json')
        makeMap(request)
        request=self.factory.post('/api-auth/map/make-map/', {"userToken": self.user1}, format='json')
        makeMap(request)
        request=self.factory.post('/api-auth/map/make-map/', {"userToken": self.user1}, format='json')
        makeMap(request)
        
        #ask for its mapids
        request=self.factory.post('/api-auth/map/get-user-maps/', {"userToken": self.user1}, format='json')
        response=getUserMaps(request)
        self.assertEqual(response.data, {'mapId': [1, 2, 3, 5, 6]})
        self.assertEqual(201, response.status_code)
        
    def test_getMapFromId(self):
        request=self.factory.post('/api-auth/map/make-map/', {"userToken": self.user1, "title":"Food Sauga"}, format='json')
        makeMap(request)
        request=self.factory.post('/api-auth/map/make-map/', {"userToken": self.user1, "title":"Trails Toronto"}, format='json')
        makeMap(request)
        request=self.factory.post('/api-auth/map/make-map/', {"userToken": self.user2, "title":"dontBelong"}, format='json')
        makeMap(request)
        
        #correct map
        request=self.factory.post('/api-auth/map/get-map/',  {"userToken": self.user1, "mapId":"1"})
        response=getMapFromId(request)
        self.assertEqual({'mapData': {'title': 'Food Sauga', 'desc': '', 'theme': 0, 'lat': 0.0, 'long': 0.0}, 'status': 0}, response.data)
        
        #map that doesnt exist
        request=self.factory.post('/api-auth/map/get-map/',  {"userToken": self.user1, "mapId":"4"})
        response=getMapFromId(request)
        self.assertNotEqual(201, response.status_code)
        
        #map that doesnt belong to user
        request=self.factory.post('/api-auth/map/get-map/',  {"userToken": self.user1, "mapId":"3"})
        response=getMapFromId(request)
        self.assertNotEqual(201, response.status_code)
    
    def test_getMapUsers(self):
        #add map
        request=self.factory.post('/api-auth/map/make-map/', {"userToken": self.user1, "title":"Food Sauga"}, format='json')
        makeMap(request)
        
        #check if it gives map users
        request=self.factory.post('/api-auth/map/get-users/', {'userToken': self.user1, 'mapId':'1'}, format='json')
        response = getMapUsers(request)
        self.assertEqual((201, {'User1': 0}), (response.status_code, response.data))
    
    def test_addFriendToMap(self):
        #add map
        request=self.factory.post('/api-auth/map/make-map/', {"userToken": self.user1, "title":"Food Sauga"}, format='json')
        makeMap(request)
        
        #add userfriend and accept
        makeRequest(self.factory.post("/api-auth/make-request/", {'userToken': self.user2, 'name':'User1', 'action': 0}, format='json'))
        makeRequest(self.factory.post("/api-auth/make-request/", {'userToken': self.user1, 'name':'User2', 'action': 1}, format='json'))
        
        #add friend to map
        request = self.factory.post("/api-auth/add-friend/", {'userToken': self.user1, 'recId': 'User2', 'mapId':'1', 'reqType': '1'}, format='json')
        response=addFriendToMap(request)
        print(response.status_code)
        
    
        