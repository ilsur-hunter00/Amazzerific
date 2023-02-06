var toDoObjects = [
    {
        "description": "покупки",
        "tags": ["Купить продукты"]
        },
        {
        "description": "рутина",
        "tags": ["Купить продукты", "Вывести Грейси на прогулку в парк"]
        },
        {
        "description": "писательство",
        "tags": ["Сделать несколько новых задач", "Закончить писать книгу"]
        },
        {
        "description": "работа",
        "tags": ["Сделать несколько новых задач", "Подготовиться к лекции в понедельник","Ответить на электронные письма", "Закончить писать книгу"]
        },
        {
        "description": " преподавание",
        "tags": ["Подготовиться к лекции в понедельник"]
        },
        {
        "description": "питомцы",
        "tags": ["Вывести Грейси на прогулку в парк "]
    }
];

var organizeByTags = function (toDoObjects) {

    var tags = [];

    toDoObjects.forEach(function (toDo) {
        toDo.tags.forEach(function (tag) {

        if (tags.indexOf(tag) === -1) {
            tags.push(tag);
        }
        });
    });
    console.log(tags);
    var tagObjects = tags.map(function (tag) {

        var toDosWithTag = [];
        toDoObjects.forEach(function (toDo) {
            if (toDo.tags.indexOf(tag) !== -1) {
                toDosWithTag.push(toDo.description);
            }
        });

        return { "name": tag, "toDos": toDosWithTag };
    });
    console.log(tagObjects);
};
    
var main = function () {
    
    organizeByTags(toDoObjects);
};  
$(document).ready(main);
    