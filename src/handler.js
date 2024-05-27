const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const id = nanoid(16);
  const { title, tags, body } = request.payload;
  const createdAt = new Date().toISOString();
  const updateAt = createdAt;

  const newNotes = {
    id,
    title,
    tags,
    body,
    createdAt,
    updateAt,
  };

  notes.push(newNotes);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    return response;
  }

  const response = h.response({
    status: 'failed',
    message: 'Catatan gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.filter((item) => item.id === id)[0];

  if (note) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }
  const response = h.response({
    status: 'failed',
    message: 'Not Found',
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const createdAt = new Date().toISOString();
  const updateAt = createdAt;

  const index = notes.findIndex((item) => item.id === id);

  const newNoteData = {
    id,
    title,
    tags,
    body,
    createdAt,
    updateAt,
  };

  if (index !== -1) {
    notes[index] = {
      ...newNoteData,
    };

    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    };
  }

  const response = h.response({
    success: 'failde',
    message: 'gagal memperbarui catata. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id !== id);

  notes.splice(index, 1);

  const isSuccess = notes.filter((note) => note.id === id).length === 0;

  if (isSuccess) {
    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }

  const response = h.response({
    status: 'failed',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
