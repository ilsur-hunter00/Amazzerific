var express = require("express"),
    http = require("http"),
    mongoose = require("mongoose"), 
    usersController = require("./controllers/usersController"),
    toDosController = require("./controllers/todosController"),
    ToDo = require("./models/todo"),
    app = express();
// toDos = [
//     {
//     "description" : "Купить продукты",
//     "tags" : [ "шопинг", "рутина" ]
//     },
//     {
//     "description" : "Сделать несколько новых задач",
//     "tags" : [ "писательство", "работа" ]
//     },
//     {
//     "description" : "Подготовиться к лекции в понедельник",
//     "tags" : [ "работа", "преподавание" ]
//     },
//     {
//     "description" : "Ответить на электронные письма",
//     "tags" : [ "работа" ]
//     },
//     {
//     "description" : "Вывести Грейси на прогулку в парк",
//     "tags" : [ "рутина", "питомцы" ]
//     },
//     {
//     "description" : "Закончить писать книгу",
//     "tags" : [ "писательство", "работа" ]
//     }
// ];
try {
    mongoose.connect('mongodb://localhost:27017/amazeriffic', {useNewUrlParser: true, useUnifiedTopology: true});
} catch (err) {
    console.log("Ошибка");
}

http.createServer(app).listen(3000);


app.use(express.static((__dirname + "/client")));
// этот маршрут замещает наш файл
// todos.json в примере из части 5
app.get("/todos.json", function (req, res) {
    ToDo.find({}, function (err, toDos) {
        if (err !== null) {
            // объект не был передан
            console.log(err);
            res.json({ "message": "объект не был передан!" });
        } else { res.json(toDos); }
    });
});
    
// командуем Express принять поступающие
// объекты JSON
app.use(express.urlencoded({extended: true}));
app.post("/todos", function (req, res) {
    console.log(req.body);
    var newToDo = new ToDo({
        "description":req.body.description,
        "tags":req.body.tags
    });
    newToDo.save(function (err, result) {
        if (err !== null) {
            console.log(err);
            res.send("ERROR");
        } else {
            
            ToDo.find({}, function (err, result) {
                if (err !== null) {
                // элемент не был сохранен
                    res.send("ERROR");
                }
                res.json(result);
            });
        }
    });
});

app.use('/', express.static((__dirname + "/client")));
app.use('/user/:username', express.static(__dirname + '/client'));

app.get("/users.json", usersController.index);
app.post("/users", usersController.create);
app.get("/users/:username", usersController.show);
app.put("/users/:username", usersController.update);
app.delete("/users/:id", usersController.destroy);

app.get("/user/:username/todos.json", toDosController.index);
app.post("/user/:username/todos", toDosController.create);
app.put("/user/:username/todos/:id", toDosController.update);
app.delete("/user/:username/todos/:id", toDosController.destroy);

app.put("/todos/:id", toDosController.update);
app.delete("/todos/:id", toDosController.destroy);