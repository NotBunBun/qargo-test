from rest_framework import serializers
from .models import Column
import re

class ColumnSerializer(serializers.ModelSerializer):
    note_count = serializers.SerializerMethodField()

    class Meta:
        model = Column
        fields = ('id', 'title', 'color', 'position', 'created_at', 'note_count')
        read_only_fields = ('id', 'created_at')

    def get_note_count(self, obj):
        return obj.notes.filter(is_archived=False).count()

    def validate_color(self, value):
        if not re.match(r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$', value):
            raise serializers.ValidationError('Color debe ser un código hexadecimal válido (#RGB o #RRGGBB).')
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
