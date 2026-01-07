from django.contrib import admin
from .models import Column

@admin.register(Column)
class ColumnAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'color', 'position', 'created_at')
    list_filter = ('user', 'created_at')
    search_fields = ('title', 'user__username')
    ordering = ('user', 'position')
