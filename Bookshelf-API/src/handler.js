const { nanoid } = require('nanoid'); // pemanggilan modul nano ID
let bookshelf = []; // array untuk objek bookshelf

const addBookHandler = (request, h) => { // fungsi untuk menambah buku
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) { // kondisi ketika nama buku tidak terdapat
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400); // respon kode buku gagal ditambah
    return response;
  }

  if (readPage > pageCount) { // kondisi ketika readPage lebih besar dari pageCount
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response; // respon kode read page lebih besar dari page count
  }

  const id = nanoid(16); // deklarasi variabel id untuk nanoID
  const finished = pageCount === readPage; // algoritma finish
  const insertedAt = new Date().toISOString(); // algoritma untuk insert date = update date
  const updatedAt = insertedAt;

  const getBook = { // variabel yang diperlukan untuk getBook
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  bookshelf.push(getBook); // algoritma untuk bookshelf mendapatkan variabel getBook

  const whileSuccess = bookshelf.filter((book) => book.id === id).length > 0;
  if (whileSuccess) { // kondisi ketika buku berhasil ditambah
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201); // kokde respon buku berhasil
    return response;
  }

  const response = h.response({ // respon buku gagal ditambah
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => { // algoritma fumgsi mendapat semua buku
  const { reading, finished, name,author } = request.params;

  let scannedBooks = bookshelf;

  if (reading) {
    const gettingValue = reading === '1';
    scannedBooks = scannedBooks.filter((book) => book.reading === gettingValue);
  }

  if (finished) {
    const endedValue = finished === '1';
    scannedBooks = scannedBooks.filter((book) => book.finished === endedValue);
  }

  if (name) {
    scannedBooks = scannedBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (author) {
    scannedBooks = scannedBooks.filter((book) => book.author.toLowerCase().includes(author.toLowerCase()));
  }

  const moderatedBooks = scannedBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }));

  const response = h.response({
    status: 'success',
    data: {
      books: moderatedBooks
    }
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => { // algoritma untuk mendapat buku bedasarkan ID
  const { bookId } = request.params;

  const paper = bookshelf.find((b) => b.id === bookId);

  if (paper) {
    const response = h.response({
      status: 'success',
      data: {
        book: {
          id: paper.id,
          name: paper.name,
          year: paper.year,
          author: paper.author,
          summary: paper.summary,
          publisher: paper.publisher,
          pageCount: paper.pageCount,
          readPage: paper.readPage,
          finished: paper.pageCount === paper.readPage,
          reading: paper.reading,
          insertedAt: paper.insertedAt,
          updatedAt: paper.updatedAt,
        },
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};


const editBookByIdHandler = (request, h) => { // algoritma untuk update isi buku
  const { bookId } = request.params;

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const sum = bookshelf.findIndex((book) => book.id === bookId);

  if (sum !== -1) {
    bookshelf[sum] = {
      ...bookshelf[sum],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt: new Date().toISOString(),
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => { // algoritma untuk menghapus buku bedasarkan ID buku
  const { bookId } = request.params;

  const index = bookshelf.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    bookshelf.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { // module yg dapat di export
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};