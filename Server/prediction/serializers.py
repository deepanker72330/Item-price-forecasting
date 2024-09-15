from rest_framework import serializers
from . models import *


class ProductSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length = 50)
    productName = serializers.CharField(max_length = 500)
    domain = serializers.CharField(max_length = 50)
    pid = serializers.CharField(max_length = 500)
    url = serializers.CharField(max_length = 10000)

    class Meta:
        model = product
        fields = ['username', 'productName', 'domain', 'pid', 'url']

    #def validate(self, attrs):
    #    if product.objects.filter(username=attrs['username']).exists():
    #        raise serializers.ValidationError({'username' : ('email in use')})
    #    return super().validate(attrs)

    #def create(self, data):
    #    return product.objects.create_user(**data)

class PriceSerializer(serializers.ModelSerializer):
    domain = serializers.CharField(max_length = 50)
    pid = serializers.CharField(max_length = 500)
    price = serializers.DecimalField(max_digits=12, decimal_places=3, default=0)
    date = serializers.DateField(default = "2000-01-01")
    

    class Meta:
        model = price
        fields = ['domain', 'pid', 'price', 'date']
