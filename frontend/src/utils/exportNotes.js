const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportAsJSON = (notes, columns) => {
  const exportData = {
    exportDate: new Date().toISOString(),
    columns: columns.map(col => ({
      id: col.id,
      title: col.title,
      color: col.color,
    })),
    notes: notes.map(note => ({
      id: note.id,
      title: note.title,
      content: note.content,
      color: note.color,
      column: note.column_title || 'Sin columna',
      isArchived: note.is_archived,
      createdAt: note.created_at,
      updatedAt: note.updated_at,
    })),
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const filename = `qargo-notes-${new Date().toISOString().split('T')[0]}.json`;
  downloadFile(blob, filename);
};

export const exportAsMarkdown = (notes, columns) => {
  let markdown = '# Qargo Notes\n\n';
  markdown += `**Exportado:** ${new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}\n\n`;
  markdown += '---\n\n';

  const groupedByColumn = {};

  columns.forEach(column => {
    groupedByColumn[column.id] = {
      title: column.title,
      notes: [],
    };
  });

  groupedByColumn['null'] = {
    title: 'Sin columna',
    notes: [],
  };

  notes.forEach(note => {
    const columnKey = note.column || 'null';
    if (groupedByColumn[columnKey]) {
      groupedByColumn[columnKey].notes.push(note);
    }
  });

  Object.values(groupedByColumn).forEach(group => {
    if (group.notes.length > 0) {
      markdown += `## ${group.title}\n\n`;

      group.notes.forEach(note => {
        markdown += `### ${note.title}\n\n`;
        markdown += `${note.content}\n\n`;

        if (note.is_archived) {
          markdown += `*[Archivada]*\n\n`;
        }

        markdown += `---\n\n`;
      });
    }
  });

  const blob = new Blob([markdown], { type: 'text/markdown' });
  const filename = `qargo-notes-${new Date().toISOString().split('T')[0]}.md`;
  downloadFile(blob, filename);
};
