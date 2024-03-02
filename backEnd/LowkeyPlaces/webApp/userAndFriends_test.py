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

class CommonSetup():
    def start(self):
        passwords_dict = {
            'User1': 'A$2rP#zT8x',
            'User2': 'qF9v!oI7jL',
            'User3': 'gH5uX*bW1y',
            'User4': 'cK3s&dV6mN',
            'User5': 'xP8l@zQ4eF',
            'User6': 'iO7w#yU6vB',
            'User7': 'mC2n!hG3fX',
            'User8': 'rZ1aV&kP9t',
            'User9': 'bJ4eQ7dM2u',
            'User10': 'lT6oI9gY#1'
        }
        self.factory = APIRequestFactory()

        # Make Register Account Requests
        for i in passwords_dict:
            request=self.factory.post('/api-auth/homepage/register', {'name': i, 'psswd': passwords_dict[i]}, format='json')
            response = register(request)
            self.assertEqual(response.status_code, 201)
            
        self.user1=create_token(USER.objects.get(name='User1'))
        self.user2=create_token(USER.objects.get(name='User2'))
        self.user3=create_token(USER.objects.get(name='User3'))
        self.user4=create_token(USER.objects.get(name='User4'))

    

class TestRegistrationAndLogin(TestCase, CommonSetup):
    # Make 10 users
    def setUp(self):
        super().start()
        
    def testAuthenitication(self):
        #correct username and incorrect password
        request=self.factory.post('/api-auth/homepage/login', {'name': 'User1' ,'psswd':'A$2rP#zT8xfdf'}, format='json')
        response = login(request)
        self.assertNotEqual(response.status_code, 201)

        #incorrect usernames correct password 
        request=self.factory.post('/api-auth/homepage/login', {'name': 'User11' ,'psswd':'A$2rP#zT8x'}, format='json')
        response = login(request)
        self.assertNotEqual(response.status_code, 201)


        request=self.factory.post('/api-auth/homepage/login', {'name': 'User10' ,'psswd':'A$2rP#zT8x'}, format='json')
        response = login(request)
        self.assertNotEqual(response.status_code, 201)

        #incorrect username and incorrect password
        request=self.factory.post('/api-auth/homepage/login', {'name': 'User10' ,'psswd':'A$2frP#zT8x'}, format='json')
        response = login(request)
        self.assertNotEqual(response.status_code, 201)
        
        #correct username correct password
        request=self.factory.post('/api-auth/homepage/login', {'name': 'User1' ,'psswd':'A$2rP#zT8x'}, format='json')
        response = login(request)
        self.assertEqual(response.status_code, 201)
        #assert it gave correct code:
        self.assertEqual(response.data, {'genToken': create_token(USER.objects.get(name='User1'))})


class TestFriendManager(TestCase, CommonSetup):
    def setUp(self):
        super().start()
        
        
    def testSendFriendReqest(self):
        #sending valid friend requests
        request = self.factory.post("/api-auth/dashboard/make-request/", {'userToken': self.user2, 'name':'User1', 'action': 0}, format='json')
        response = makeRequest(request)
        self.assertEqual(response.status_code, 201)

        request = self.factory.post("/api-auth/dashboard/make-request/", {'userToken': self.user3, 'name':'User1', 'action': 0}, format='json')
        response = makeRequest(request)
        self.assertEqual(response.status_code, 201)

        request = self.factory.post("/api-auth/dashboard/make-request/", {'userToken': self.user4, 'name':'User3', 'action': 0}, format='json')
        response = makeRequest(request)
        self.assertEqual(response.status_code, 201, response.data)

        #self reference error
        request = self.factory.post("/api-auth/dashboard/make-request/", {'userToken': self.user1, 'name':'User1', 'action': 0}, format='json')
        response = makeRequest(request)
        self.assertNotEqual(response.status_code, 201)

        #friend request already exists
        request = self.factory.post("/api-auth/dashboard/make-request/", {'userToken': self.user2, 'name':'User1', 'action': 0}, format='json')
        response = makeRequest(request)
        self.assertNotEqual(response.status_code, 201)
        '''
        try:
            FRIEND_REQUEST.get(sendId = 'User2', recId='User1')
        except ValidationError:
            self.fail("request_not_made")
        '''
    
    
    def testAcceptFriendRequest(self):

        makeRequest(self.factory.post("/api-auth/make-request/", {'userToken': self.user2, 'name':'User1', 'action': 0}, format='json'))
        makeRequest(self.factory.post("/api-auth/make-request/", {'userToken': self.user3, 'name':'User1', 'action': 0}, format='json'))
        makeRequest(self.factory.post("/api-auth/make-request/", {'userToken': self.user4, 'name':'User3', 'action': 0}, format='json'))
        makeRequest(self.factory.post("/api-auth/make-request/", {'userToken': self.user4, 'name':'User2', 'action': 0}, format='json'))
        
        #valid accepting FriendRequest
        request = self.factory.post("/api-auth/make-request/", {'userToken': self.user1, 'name':'User2', 'action': 1}, format='json')
        response = makeRequest(request)
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(USER_RELATION.objects.filter(user1=USER.objects.get(name='User1'), user2=USER.objects.get(name='User2')).first())
        self.assertIsNotNone(USER_RELATION.objects.filter(user1=USER.objects.get(name='User2'), user2=USER.objects.get(name='User1')).first())

        request = self.factory.post("/api-auth/make-request/", {'userToken': self.user1, 'name':'User3', 'action': 1}, format='json')
        response = makeRequest(request)
        self.assertEqual(response.status_code, 201)

        #no friend request exists 
        request = self.factory.post("/api-auth/make-request/", {'userToken': self.user1, 'name':'User3', 'action': 1}, format='json')
        response = makeRequest(request)
        self.assertNotEqual(response.status_code, 201)

        #cross friend request
        makeRequest(self.factory.post("/api-auth/make-request/", {'userToken': self.user3, 'name':'User4', 'action': 0}, format='json'))
        self.assertIsNotNone(USER_RELATION.objects.filter(user1=USER.objects.get(name='User4'), user2=USER.objects.get(name='User3')).first())
        self.assertIsNotNone(USER_RELATION.objects.filter(user1=USER.objects.get(name='User3'), user2=USER.objects.get(name='User4')).first())
        
        #already friends
        response=makeRequest(self.factory.post("/api-auth/make-request/", {'userToken': self.user2, 'name':'User1', 'action': 0}, format='json'))
        self.assertNotEqual(response.status_code, 201)

    def testRejectFriendRequest(self):
        makeRequest(self.factory.post("/api-auth/make-request/", {'userToken': self.user2, 'name':'User1', 'action': 0}, format='json'))
        makeRequest(self.factory.post("/api-auth/make-request/", {'userToken': self.user3, 'name':'User1', 'action': 0}, format='json'))
        makeRequest(self.factory.post("/api-auth/make-request/", {'userToken': self.user4, 'name':'User3', 'action': 0}, format='json'))
        makeRequest(self.factory.post("/api-auth/make-request/", {'userToken': self.user4, 'name':'User2', 'action': 0}, format='json'))
        
        #valid rejection
        response=makeRequest(self.factory.post("/api-auth/make-request/", {'userToken': self.user1, 'name':'User2', 'action': 2}, format='json'))
        self.assertEqual(response.status_code, 201)

        #no incoming request (invalid user)
        response=makeRequest(self.factory.post("/api-auth/make-request/", {'userToken': self.user1, 'name':'User20', 'action': 2}, format='json'))
        self.assertNotEqual(response.status_code, 201)

        #no incoming request (valid user)
        response=makeRequest(self.factory.post("/api-auth/make-request/", {'userToken': self.user1, 'name':'User4', 'action': 2}, format='json'))
        self.assertNotEqual(response.status_code, 201)
    
    
class TestUserInfo(TestCase, CommonSetup):
    def setUp(self):
        super().start()
    def testGetUserinfo(self):
        #send friend requests
        makeRequest(self.factory.post("/api-auth/dashboard/make-request/", {'userToken': self.user2, 'name':'User1', 'action': 0}, format='json'))
        makeRequest(self.factory.post("/api-auth/dashboard/make-request/", {'userToken': self.user3, 'name':'User1', 'action': 0}, format='json'))
        makeRequest(self.factory.post("/api-auth/dashboard/make-request/", {'userToken': self.user4, 'name':'User3', 'action': 0}, format='json'))
        makeRequest(self.factory.post("/api-auth/dashboard/make-request/", {'userToken': self.user4, 'name':'User2', 'action': 0}, format='json'))
        
        response=getUserInfo(self.factory.post("/api-auth/dashboard/user-info/", {'userToken': self.user1}, format='json')).data
        expected={'incomingRequests': ['User2', 'User3'], 'sentRequests': [], 'friends': [], 'blocks': [], 'mapCount': 0}
        self.assertEqual(response, expected)

        response=getUserInfo(self.factory.post("/api-auth/dashboard/user-info/",{'userToken': self.user2}, format='json')).data
        expected={'incomingRequests': ['User4'], 'sentRequests': ['User1'], 'friends': [], 'blocks': [], 'mapCount': 0}
        self.assertEqual(response,expected)
        
        
        response=getUserInfo(self.factory.post("/api-auth/dashboard/user-info/",{'userToken': self.user3}, format='json')).data
        expected={'incomingRequests': ['User4'], 'sentRequests': ['User1'], 'friends': [], 'blocks': [], 'mapCount': 0}
        
        
        response=getUserInfo(self.factory.post("/api-auth/dashboard/user-info/",{'userToken': self.user4}, format='json')).data
        expected={'incomingRequests': [], 'sentRequests': ['User3', 'User2'], 'friends': [], 'blocks': [], 'mapCount': 0}
        
        #accept them
        makeRequest(self.factory.post("/api-auth/dashboard/make-request/", {'userToken': self.user1, 'name':'User2', 'action': 1}, format='json'))
        makeRequest(self.factory.post("/api-auth/dashboard/make-request/", {'userToken': self.user1, 'name':'User3', 'action': 1}, format='json'))
        makeRequest(self.factory.post("/api-auth/dashboard/make-request/", {'userToken': self.user2, 'name':'User4', 'action': 1}, format='json'))
        #reject one
        makeRequest(self.factory.post("/api-auth/dashboard/make-request/", {'userToken': self.user3, 'name':'User4', 'action': 2}, format='json'))
        
        
        #ensure it worked
        response = getUserInfo(self.factory.post("/api-auth/dashboard/user-info/",{'userToken': self.user1}, format='json')).data
        expected = {'incomingRequests': [], 'sentRequests': [], 'friends': ['User2', 'User3'], 'blocks': [], 'mapCount': 0}
        self.assertEqual(response, expected)

        response = getUserInfo(self.factory.post("/api-auth/dashboard/user-info/",{'userToken': self.user2}, format='json')).data
        expected = {'incomingRequests': [], 'sentRequests': [], 'friends': ['User1', 'User4'], 'blocks': [], 'mapCount': 0}
        self.assertEqual(response, expected)

        response = getUserInfo(self.factory.post("/api-auth/dashboard/user-info/",{'userToken': self.user3}, format='json')).data
        expected = {'incomingRequests': [], 'sentRequests': [], 'friends': ['User1'], 'blocks': [], 'mapCount': 0}
        self.assertEqual(response, expected)

        response = getUserInfo(self.factory.post("/api-auth/dashboard/user-info/",{'userToken': self.user4}, format='json')).data
        expected = {'incomingRequests': [], 'sentRequests': [], 'friends': ['User2'], 'blocks': [], 'mapCount': 0}
        self.assertEqual(response, expected)