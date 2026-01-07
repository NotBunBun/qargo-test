from django.contrib import admin
from .models import Note

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'column', 'is_archived', 'position', 'created_at')
    list_filter = ('is_archived', 'column', 'created_at')
    search_fields = ('title', 'content', 'user__username')
    ordering = ('user', 'column', 'position')
    readonly_fields = ('created_at', 'updated_at')
