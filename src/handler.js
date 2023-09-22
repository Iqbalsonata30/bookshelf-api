const { nanoid } = require("nanoid")
const books = require("./books")


const saveBookHandler = (req, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload
    const id = nanoid(16);
    const finished = false
    if (pageCount === readPage) {
        finished = true
    }
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }

    books.push(newBook)
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

module.exports = { saveBookHandler, getAllBooksHandler, getBookByIdHandler }
