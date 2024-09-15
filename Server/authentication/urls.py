from django.urls import path
from .views import RegisterView, LoginView, Userview, Logoutview

urlpatterns = [
  path('register', RegisterView.as_view()),
  path('login', LoginView.as_view()),
  path('user', Userview.as_view() ),
  path('logout', Logoutview.as_view())
]