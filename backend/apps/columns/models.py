import uuid
from django.db import models
from django.contrib.auth.models import User

class Column(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='columns')
    title = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default='#3B82F6')
    position = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['position']
        unique_together = ['user', 'position']
        indexes = [
            models.Index(fields=['user', 'position']),
        ]

    def __str__(self):
        return f"{self.title} ({self.user.username})"

    def save(self, *args, **kwargs):
        if self.position is None or self.position == 0:
            max_position = Column.objects.filter(user=self.user).aggregate(
                models.Max('position')
            )['position__max']
            self.position = (max_position or 0) + 1
        super().save(*args, **kwargs)
