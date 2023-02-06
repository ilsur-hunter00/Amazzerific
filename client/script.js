var organizeByTags = function (toDoObjects) {
    // создание пустого массива для тегов
    var tags = [];
    // перебираем все задачи toDos
    toDoObjects.forEach(function (toDo) {
        // перебираем все теги для каждой задачи
        toDo.tags.forEach(function (tag) {
            // убеждаемся, что этого тега
            // еще нет в массиве
            if (tags.indexOf(tag) === -1) {
                tags.push(tag);
            }
        });
    });
    console.log(tags);

    var tagObjects = tags.map(function (tag) {
        // здесь мы находим все задачи,
        // содержащие этот тег
        var toDosWithTag = [];
        toDoObjects.forEach(function (toDo) {
            // проверка, что результат
            // indexOf is *не* равен -1
            if (toDo.tags.indexOf(tag) !== -1) {
                toDosWithTag.push(toDo.description);
            }
        });
        // мы связываем каждый тег с объектом, который
        // содержит название тега и массив
        return { "name": tag, "toDos": toDosWithTag };
    });
    console.log(tagObjects);
    return tagObjects;
};

var liaWithEditOnСlick = function (todo) {
    var $todoListItem = $("<li>").text(todo.description),
        $todoRemoveLink = $("<a>").attr("href", "todos/" + todo._id);
    $todoRemoveLink.text("Редактировать");
    $todoRemoveLink.on("click", function () {
        var newDescription = prompt("Введите новое наименование для задачи",
            todo.description);
        if (newDescription !== null && newDescription.trim() !== "") {
            $.ajax({
                url: "todos/" + todo._id,
                type: "PUT",
                data: { "description": newDescription }
            }).done(function (response) {
                //location.reload();
                $(".tabs a:nth-child(2) span").trigger("click");
            }).fail(function (err) {
            });
        }
        return false;
    });
    $todoListItem.append($todoRemoveLink);
    return $todoListItem;
};

var liaWithDeleteOnСlick = function (todo) {
    var $todoListItem = $("<li>").text(todo.description),
        $todoRemoveLink = $("<a>").attr("href", "todos/" + todo._id);
    $todoRemoveLink.text("Удалить");
    console.log("todo._id: " + todo._id);
    console.log("todo.description: " + todo.description);
    $todoRemoveLink.on("click", function () {
        $.ajax({
            "url": "todos/" + todo._id,
            "type": "DELETE"
        }).done(function (response) {
            $(".tabs a:first-child span").trigger("click");
        }).fail(function (err) {
            console.log("error on delete 'todo'!");
        });
        return false;
    });
    $todoListItem.append($todoRemoveLink);
    return $todoListItem;
};

var main = function (toDoObjects) {
    "use strict";
    var toDos = toDoObjects.map(function (toDo) {
        return toDo.description;
    });
    $(".tabs a span").toArray().forEach(function (element) {
        $(element).on("click", function () {
            var $element = $(element);
            var $content;
            $(".tabs a span").removeClass("active");
            $(element).addClass("active");
            $("main .content").empty();
            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<ul>");
                for (var i = toDos.length - 1; i > -1; i--) {
                    $content.append($("<li>").text(toDos[i]));
                }
                $("main .content").append($content);
            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul>");
                toDos.forEach(function (todo) {
                    $content.append($("<li>").text(todo));
                });
                $("main .content").append($content);
            } else if ($element.parent().is(":nth-child(3)")) {
                console.log("Щелчок по вкладке Теги");
                organizeByTags(toDoObjects);
                var organizedByTag = organizeByTags(toDoObjects);
                organizedByTag.forEach(function (tag) {
                    var $tag = $("div").addClass("tag"),
                        $tagName = $("<h3>").addClass("tags-h3").text(tag.name),
                        $content = $("<ul>");
                    tag.toDos.forEach(function (description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });
                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });
            } else if ($element.parent().is(":nth-child(4)")) {
                var $input = $("<input>");
                var $inputLabel = $("<p>").text("Новая задача");
                var $tagInput = $("<input>");
                $tagInput.keypress(function (e) {
                    if (e.which == 13) {
                        if ($input.val() != "" && $tagInput.val() != "") {
                            var description = $input.val();
                            var tags = $tagInput.val().split(",");
                            // создаем новый элемент списка задач
                            var newToDo = { "description": description, "tags": tags };
                            // здесь мы отправляем быстрое сообщение на маршрут списка задач
                            $.post("todos", newToDo, function (response) {
                                // этот обратный вызов выполняется при ответе сервера
                                console.log("Мы отправили данные и получили ответ сервера!");
                                console.log(response);
                                // нужно отправить новый объект на клиент
                                // после получения ответа сервера
                                toDoObjects.push(newToDo);
                                //обновление toDos
                                toDos = toDoObjects.map(function (toDo) {
                                    return toDo.description;
                                });
                                $(".tabs a:first-child span").trigger("click");
                            });
                        } else { alert("Поля должны быть заполнены"); }
                    }
                });
                var $tagLabel = $("<p>").text("Тэги: ");
                var $button = $("<button class='addButton'>+</button>");
                $("main .content").append($inputLabel);
                $("main .content").append($input);
                $("main .content").append($tagLabel);
                $("main .content").append($tagInput);
                $("main .content").append($button);
                $(".content button").on("click", function () {
                    if ($input.val() != "" && $tagInput.val() != "") {
                        var description = $input.val();
                        var tags = $tagInput.val().split(",");
                        // создаем новый элемент списка задач
                        var newToDo = { "description": description, "tags": tags };
                        // здесь мы отправляем быстрое сообщение на маршрут списка задач
                        $.post("todos", newToDo, function (response) {
                            // этот обратный вызов выполняется при ответе сервера
                            console.log("Мы отправили данные и получили ответ сервера!");
                            console.log(response);
                            // нужно отправить новый объект на клиент
                            // после получения ответа сервера
                            toDoObjects.push(newToDo);
                            //обновление toDos
                            toDos = toDoObjects.map(function (toDo) {
                                return toDo.description;
                            });
                            $(".tabs a:first-child span").trigger("click");
                        });
                    } else { alert("Поля должны быть заполнены"); }

                });
            }
            return false;
        });
    });
    $(".tabs a:first-child span").trigger("click");
}
$(document).ready(function () {
    $.getJSON("todos.json", function (toDoObjects) {
        main(toDoObjects);
    });
});
