#return user based on token or return None
from registrationAndLogin.models import USER
import jwt
from datetime import datetime, timedelta
from django.db.models.query import QuerySet
from rest_framework.response import Response
from rest_framework import status
from dotenv import load_dotenv
import os
import bcrypt
from jwt.exceptions import PyJWTError
from google.cloud import storage

from google.cloud import storage
from io import BytesIO

def upload_image_to_bucket(bucket_name, source_file, destination_blob_name):
    """Uploads an opened file to the Google Cloud Storage bucket."""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    
    # Read the contents of the opened file
    content = source_file.read()

    # Upload the contents to the blob
    blob.upload_from_file(BytesIO(content), content_type='image/jpeg')  # You may need to adjust the content type


def generate_download_signed_url_v4(bucket_name, blob_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)

    url = blob.generate_signed_url(
        version="v4",
        expiration=timedelta(minutes=60),
        method="GET",
    )
    return url


def hash_password(password) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

def verify_password(input_password, hashed_password):
    return bcrypt.checkpw(input_password.encode('utf-8'), hashed_password.encode('utf-8'))

#load Key
dotenv_path = '/LowkeySpots/' 
load_dotenv()
randomKey=os.getenv('randomKey')

def error_returner(error_message: str) -> Response:
    return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)

# generate token
def create_token(elem: USER) -> str:
    load = {
        'name': elem.name,
        'exp': datetime.utcnow() + timedelta(days=3)  # Token expiration time
    }
    token=jwt.encode(load, randomKey, algorithm='HS256')
    return token

#verify token
def token_to_user(usrToken: str) -> USER:
    try:
        load=jwt.decode(usrToken, randomKey, 'HS256')
        found=USER.objects.filter(name=load['name'])
        exp=datetime.utcfromtimestamp(load['exp'])
        if found and exp > datetime.utcnow():
            return found.first()
    except PyJWTError:
        return None
    return None

# friend methodss
action_map = {
0:'sendFriendReq',
1:'acceptFriendReq',
2:'rejectFriendReq',
3:'blockFriendReq',
4:'removeFriend',
5:'blockFriend',
6:'unblockUser'
}
def intToAction(num: int):
    if -1 < num < len(action_map):
        return action_map[num]
    return None



#map_request method
map_request_action_map = {
0: 'inviteCollaborator',
1: 'inviteSpectator',
2: 'inviteThroughLinkCollaborator', #makes them friends (make api-auth call itself)
3: 'inviteThroughLinkSpectator',    #makes them friends
4: 'acceptCollaborator',
5: 'acceptSpectator',
}