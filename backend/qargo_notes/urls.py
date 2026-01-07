from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({'status': 'ok', 'message': 'Qargo Notes API está funcionando'})

urlpatterns = [
    path('', health_check, name='health_check'),
    path('api/', health_check, name='api_health_check'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/columns/', include('apps.columns.urls')),
    path('api/notes/', include('apps.notes.urls')),
]
