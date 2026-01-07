from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Column
from .serializers import ColumnSerializer

class ColumnViewSet(viewsets.ModelViewSet):
    serializer_class = ColumnSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Column.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        user_columns = Column.objects.filter(user=self.request.user, position__gt=instance.position)
        instance.delete()
        for new_pos, column in enumerate(user_columns, start=instance.position):
            column.position = new_pos
            column.save()

    @action(detail=False, methods=['patch'])
    def reorder(self, request):
        column_ids = request.data.get('column_ids', [])
        print(column_ids)

        if not column_ids:
            return Response(
                {'detail': 'Se requiere una lista de IDs de columnas.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        for position, column_id in enumerate(column_ids):
            try:
                column = Column.objects.get(id=column_id, user=request.user)
                column.position = position
                column.save()
            except Column.DoesNotExist:
                return Response(
                    {'detail': f'Columna con ID {column_id} no encontrada.'},
                    status=status.HTTP_404_NOT_FOUND
                )

        return Response({'detail': 'Columnas reordenadas exitosamente.'})
