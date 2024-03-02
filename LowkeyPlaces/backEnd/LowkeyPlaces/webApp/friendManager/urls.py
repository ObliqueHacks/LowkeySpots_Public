from django.urls import path
from .views import getUserInfo, makeRequest

urlpatterns = [
    path('user-info/', getUserInfo, name='user_info'),
    path('make-request/', makeRequest, name='send_friend_request'),
]
