from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('latest-checks/', views.latest_checks, name='latest-checks'),
    path('history/', views.history, name='history'),
    path('details/<path:encoded_url>/', views.service_details, name='service-details'),


       # AUTH (corrigé)
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
