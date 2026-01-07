from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Note
from .serializers import NoteSerializer

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at', 'position']

    def get_queryset(self):
        queryset = Note.objects.filter(user=self.request.user)

        column_id = self.request.query_params.get('column_id', None)
        is_archived = self.request.query_params.get('is_archived', None)
        search = self.request.query_params.get('search', None)

        if column_id:
            queryset = queryset.filter(column_id=column_id)

        if is_archived is not None:
            is_archived_bool = is_archived.lower() == 'true'
            queryset = queryset.filter(is_archived=is_archived_bool)

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(content__icontains=search)
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['patch'])
    def move(self, request, pk=None):
        note = self.get_object()
        target_column_id = request.data.get('column_id')
        new_position = request.data.get('position')
        print(note.id, target_column_id)

        if target_column_id is not None:
            note.column_id = target_column_id if target_column_id else None

        if new_position is not None:
            old_position = note.position
            old_column = note.column

            note.position = new_position
            note.save()

            if note.column == old_column:
                if new_position < old_position:
                    notes_to_update = Note.objects.filter(
                        user=request.user,
                        column=note.column,
                        position__gte=new_position,
                        position__lt=old_position,
                        is_archived=False
                    ).exclude(id=note.id)
                    for other_note in notes_to_update:
                        other_note.position += 1
                        other_note.save()
                else:
                    notes_to_update = Note.objects.filter(
                        user=request.user,
                        column=note.column,
                        position__gt=old_position,
                        position__lte=new_position,
                        is_archived=False
                    ).exclude(id=note.id)
                    for other_note in notes_to_update:
                        other_note.position -= 1
                        other_note.save()
        else:
            note.save()

        serializer = self.get_serializer(note)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def archive(self, request, pk=None):
        note = self.get_object()
        note.is_archived = not note.is_archived
        note.save()

        serializer = self.get_serializer(note)
        return Response(serializer.data)

    @action(detail=False, methods=['patch'])
    def reorder(self, request):
        note_ids = request.data.get('note_ids', [])
        column_id = request.data.get('column_id')

        if not note_ids:
            return Response(
                {'detail': 'Se requiere una lista de IDs de notas.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        for position, note_id in enumerate(note_ids):
            try:
                note = Note.objects.get(id=note_id, user=request.user)
                note.position = position
                if column_id is not None:
                    note.column_id = column_id if column_id else None
                note.save()
            except Note.DoesNotExist:
                return Response(
                    {'detail': f'Nota con ID {note_id} no encontrada.'},
                    status=status.HTTP_404_NOT_FOUND
                )

        return Response({'detail': 'Notas reordenadas exitosamente.'})
