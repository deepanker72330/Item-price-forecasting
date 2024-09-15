from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from .serializers import Userserializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.exceptions import AuthenticationFailed
import jwt
import datetime
from django.conf import settings

# Create your views here.


class RegisterView(GenericAPIView):
    def post(self, request):
        serializer = Userserializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_409_CONFLICT)


class LoginView(GenericAPIView):
    def post(self, request):
        data = request.data
        username = data['username']
        password = data['password']

        user = User.objects.filter(username=username).first()

        if user is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if not user.check_password(password):
            return Response(status=status.HTTP_403_FORBIDDEN)

        payload = {
            'username': user.username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')

        response = Response(data=token, status=status.HTTP_200_OK)

        # response.set_cookie(key='jwt', value=token, httponly=True, samesite='None', secure=True)
        return response


class Userview(GenericAPIView):
    def post(self, request):
        token = request.data['token']
        if not token:
            return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            payload = jwt.decode(
                token, settings.JWT_SECRET, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return Response(status=status.HTTP_403_FORBIDDEN)

        user = User.objects.filter(username=payload['username'])

        serializer = Userserializer(user, many=True)
        return(Response(serializer.data, status=status.HTTP_200_OK))


class Logoutview(GenericAPIView):
    def post(self, request):
        response = Response(status=status.HTTP_200_OK)
        response.delete_cookie('jwt')
        return response
