from rest_framework import serializers
from django.contrib.auth.models import User


class Userserializer(serializers.ModelSerializer):
    username = serializers.EmailField()
    password = serializers.CharField(
        max_length=18, min_length=6, write_only=True)
    

    class Meta:
        model = User
        fields = ['username', 'password']

    def validate(self, attrs):
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({'username' : ('email in use')})
        return super().validate(attrs)

    def create(self, data):
        return User.objects.create_user(**data)
