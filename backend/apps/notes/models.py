import uuid
from django.db import models
from django.contrib.auth.models import User
from apps.columns.models import Column

class Note(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    column = models.ForeignKey(Column, on_delete=models.CASCADE, related_name='notes', null=True, blank=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    color = models.CharField(max_length=7, default='#FFFFFF')
    position = models.PositiveIntegerField(default=0)
    is_archived = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['position', '-created_at']
        indexes = [
            models.Index(fields=['user', 'is_archived']),
            models.Index(fields=['column', 'position']),
            models.Index(fields=['user', 'column']),
        ]

    def __str__(self):
        return f"{self.title} ({self.user.username})"

    def save(self, *args, **kwargs):
        if self.position is None or self.position == 0:
            if self.column:
                max_position = Note.objects.filter(
                    user=self.user,
                    column=self.column,
                    is_archived=False
                ).aggregate(models.Max('position'))['position__max']
                self.position = (max_position or 0) + 1
            else:
                max_position = Note.objects.filter(
                    user=self.user,
                    column__isnull=True,
                    is_archived=False
                ).aggregate(models.Max('position'))['position__max']
                self.position = (max_position or 0) + 1
        super().save(*args, **kwargs)
