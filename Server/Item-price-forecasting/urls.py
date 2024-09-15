"""Item-price-forecasting URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from prediction.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/wishlist/', ProductView.as_view(), name="Wishlist"),
    path('api/trackedprices', TrackedPriceView.as_view(), name="Tracked Prices"),
    path('api/predprices', PredictedPriceView.as_view(), name="Predicted Prices"),
    path('api/deleteWishlist', DeleteView.as_view(), name='Deleted Items'),
]

admin.site.site_header = 'WishiMart Admin'
