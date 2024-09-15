from django.shortcuts import render
#from prediction.prediction import predictionFunc
from prediction.models import price, product
# Create your views here.

def updatePrice():
    obj = product.objects.raw("SELECT pid, domain, url FROM prediction_product").distinct
    return obj

print(updatePrice())