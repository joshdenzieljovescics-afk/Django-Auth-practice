from django.contrib import admin
from django.urls import path, include
from api.views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', UserCreate.as_view(), name='user_create'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('accounts/', include('allauth.urls')),
    path('callback/', google_login_callback, name='callback'),
    path('api/auth/user/', UserDetailView.as_view(), name = 'user_detial'),
    path('api/google/validate_token/', validate_google_token, name='validate_token'),
    path('dashboard/', UserDashboardView.as_view(), name = 'dashboard'),
    path('products/', ProductView.as_view(), name = 'products'), #Supposedly its /api/products but he remove the /api/. Figure out why
    path('api/products/', AdminProductView.as_view(), name = 'admin_product'),
    path('api/products/<int:pk>/', AdminEditProductView.as_view(), name='admin_product_detail'),
] 
