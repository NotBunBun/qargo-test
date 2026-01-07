from rest_framework import serializers
from .models import Note
import re

class NoteSerializer(serializers.ModelSerializer):
    column_title = serializers.CharField(source='column.title', read_only=True)

    class Meta:
        model = Note
        fields = ('id', 'title', 'content', 'color', 'column', 'column_title',
                  'position', 'is_archived', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_color(self, value):
        if not re.match(r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$', value):
            raise serializers.ValidationError('Color debe ser un código hexadecimal válido (#RGB o #RRGGBB).')
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
