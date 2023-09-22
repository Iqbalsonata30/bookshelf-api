const { nanoid } = require("nanoid")
const books = require("./books")


const saveBookHandler = (req, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload
    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }

    const id = nanoid(16);
    const finished = readPage === pageCount
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }

    books.push(newBook)

    const isSuccess = books.filter((b) => b.id === id).length > 0
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
}

const getAllBooksHandler = () => ({
    status: "success",
    data: {
        books: books.map((b) => ({ id: b.id, name: b.name, publisher: b.publisher }))
    }

})

const getBookByIdHandler = (req, h) => {
    const { bookId } = req.params
    const book = books.filter((b) => b.id == bookId)[0]
    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
}

const editBookByIdHandler = (req, h) => {
    const { bookId } = req.params;
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = req.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        if (name === undefined) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);

            return response;
        }

        if (pageCount < readPage) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);

            return response;
        }

        const finished = (pageCount === readPage);

        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,
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
}

const deleteBookByIdHandler = (req, h) => {
    const { bookId } = req.params;

    const index = books.findIndex((note) => note.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
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
}

module.exports = { saveBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
