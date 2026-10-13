const express = require("express"); 
const mongoose = require("mongoose"); 
const { Books } = require("./models/model"); 

const PORT = 5000; 
const app = express(); 

app.use(express.json()); 

mongoose.connect("mongodb://localhost:27017/books") 
  .then(() => { console.log("Успешное подключение к БД"); }) 
  .catch((error) => { 
    console.error("Ошибка подключения к БД:", error.message); 
    process.exit(1); 
  }); 

app.get("/allbooks", async (req, res)=>{ 
  try { 
    const books = await Books.find(); 
    res.json(books);
  } catch(error){ 
    res.status(500).send("Ошибка получения данных: " + error.message); 
  } 
}); 



app.get("/book/:id", async (req, res) => { 
    try { 
      const book = await Books.findOne({ _id: req.params.id }); 
      if (!book) {
        return res.status(404).send("Книга не найдена");
      }
      res.json(book); 
    } catch(error) { 
      res.status(500).send("Ошибка получения данных: " + error.message); 
    } 
  });
  


app.post("/addbook", async (req, res)=>{ 
  const { name, author, genre, price } = req.body;
  console.log(req.body); 
  try {
   
    const newBook = await Books.create({ name, author, genre, price }); 
    res.status(201).send("Книга добавлена"); 
  } catch(error){ 
    res.status(500).send("Ошибка при добавлении книги: " + error.message); 
  } 
});

app.put("/book/:id", async (req, res)=>{ 
  const {id} = req.params;
  const {name, author, genre, price} = req.body;
  try { 
    if (!mongoose.Types.ObjectId.isValid(id)) { 
      return res.status(404).send("Товар не найден!"); 
    } 
    const updatebook = await Books.findByIdAndUpdate( 
      id, 
      {name, author, genre, price}, 
      {new: true} 
    ); 
    if (!updatebook) { 
      return res.status(404).send("Товар не найден!"); 
    } 
    res.json({ message: "Книга успешно обновлена", books: updatebook});
  } catch(error){ 
    console.error("Ошибка обновления данных:", error); 
    res.status(500).json({ message: "Ошибка сервера" }); 
  } 
});

app.patch("/book/:id", async (req, res)=>{ 
  const { id } = req.params; 
  try { 
    if (!mongoose.Types.ObjectId.isValid(id)) { 
      return res.status(404).send("Товар не найден!"); 
    } 
    const patchbooks = await Books.findByIdAndUpdate( 
      id, 
      { $set: req.body }, 
      { new: true } 
    ); 
    if (!patchbooks) { 
      return res.status(404).send("Книга не найдена!"); 
    } 
    res.json({message: "Книга частично обновлёна", product: patchbooks});
  } catch (error) { 
    console.error("Ошибка обновления данных:", error); 
    res.status(500).json({ message: "Ошибка сервера" }); 
  } 
}); 


app.delete("/books/:id", async (req, res)=>{ 
  try { 
    const {id} = req.params; 
    

    if (!mongoose.Types.ObjectId.isValid(id)) { 
      return res.status(404).send("Книга не найдена!"); 
    }

  
    const books = await Books.findByIdAndDelete(id); 
    
    if(!books){ 
      return res.status(404).send("Такой книги не существует!"); 
    } 
    

    res.send("Книга успешно удалена!"); 
  } catch(error){ 
    console.log("Ошибка при удалении книги!"); 
    res.status(500).send("Ошибка при удалении книги: " + error.message); 
  } 
}); 



app.listen(PORT, ()=>{ 
  console.log("Успешное подключение к серверу на порту: " + PORT); 
});

