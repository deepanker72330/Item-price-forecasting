from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.tracker import parseProductPage
import jwt
import datetime
from . models import product, price
from . serializers import PriceSerializer, ProductSerializer
from django.core import serializers
from . prediction import predictionFunc
import pandas as pd


# Create your views here.
class ProductView(APIView):
    queryset = product.objects.all()

    serializer_class = ProductSerializer

    def get(self, request):
        mydetail = [{"username": detail.username, "productName": detail.productName, "domain": detail.domain, "pid": detail.pid, "url": detail.url}
                    for detail in product.objects.filter(username=(request.GET.get('username')))]
        return Response(mydetail)

    def post(self, request):
        reqdata = request.data
        url = str(reqdata['url'])
        username = reqdata['username']
        trackerObj = parseProductPage(url)
        data = {
            "username": username,
            "productName": trackerObj['productName'].replace("\n", "").replace("\t", ""),
            "domain": trackerObj['domain'],
            "pid": trackerObj['pid'],
            "url": url
        }
        if len(product.objects.filter(username=data['username']).filter(pid=data['pid'])) > 0:
            return Response("Product Already in wishlist", status=status.HTTP_409_CONFLICT)

        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteView(APIView):
    queryset = product.objects.all()

    serializer_class = ProductSerializer

    def post(self, request):
        reqdata = request.data
        print(reqdata)
        username = reqdata['username']
        pid = reqdata['pid']
        product.objects.filter(pid=pid).filter(username=username).delete()

        if (len(product.objects.filter(pid=pid)) == 0):
            price.objects.filter(pid=pid).delete()

        return Response("test response")


def makeDateArray():
    import datetime

    today = datetime.datetime.now()
    today += datetime.timedelta(1)
    d2 = today.strftime("%B %d")


class TrackedPriceView(APIView):
    queryset = price.objects.all()

    serializer_class = PriceSerializer

    def get(self, request):
        mydetail = [{"date": detail.date, "price": detail.price}
                    for detail in price.objects.filter(pid=(request.GET.get('pid')))]
        return Response(mydetail)


class PredictedPriceView(APIView):
    queryset = price.objects.all()

    serializer_class = PriceSerializer

    def get(self, request):
        mydetail = [{"date": detail.date, "price": detail.price}
                    for detail in price.objects.filter(pid=(request.GET.get('pid')))]
        collectedPrices = []
        for priceObj in mydetail:
            collectedPrices.append(priceObj["price"])
        predictedPrices = predictionFunc(mydetail)
        # predObj = [ {"price": detail.price}
        # for detail in predictedPrices]
        return Response(predictedPrices)
