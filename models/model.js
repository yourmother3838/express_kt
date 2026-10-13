const mongoose = require("mongoose")

const booksSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: [true, "Название не заполнено!"],
        trim: true
    },

    author:{
        type: String, 
        required: [true, "Автор не указан!"],
        trim: true
    },
    genre:{
        type: String, 
        required: [true, "Жанр не указан!"],
        trim: true
    },
    price:{
        type: Number, 
        required: [true, "Цена не указана!"],
        min:0
    }
})

const Books = mongoose.model("Books", booksSchema);
module.exports = { Books };