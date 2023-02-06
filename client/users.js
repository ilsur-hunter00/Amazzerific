var liaWithDeleteOnСlick = function (user) {
    var $userListItem = $("<li style='display: flex; justify-content: space-between'>").text(user.username),
        $userRemoveLink = $("<a style='text-decoration: none'>").attr("href", "users/" + user._id);
    $userRemoveLink.text("Удалить");
    console.log("user._id: " + user._id);
    console.log("user.username: " + user.username);
    $userRemoveLink.on("click", function () {
        $.ajax({
            "url": "users/" + user._id,
            "type": "DELETE"
        }).done(function (response) {
            //location.reload();
            $(".tabs a:first-child span").trigger("click");
        }).fail(function (err) {
            console.log("error on delete 'user'!");
        });
        return false;
    });
    $userListItem.append($userRemoveLink);
    return $userListItem;
};

var liaWithEditOnСlick = function (user) {
    var $userListItem = $("<li style='display: flex; justify-content: space-between'>").text(user.username),
        $userRemoveLink = $("<a style='text-decoration: none'>").attr("href", "users/" + user._id);
    $userRemoveLink.text("Редактировать");
    $userRemoveLink.on("click", function () {
        var newUsername = prompt("Введите новое имя пользователя",
            user.username);
        if (newUsername !== null && newUsername.trim() !== "") {
            $.ajax({
                url: "users/" + user.username,
                type: "PUT",
                data: { "username": newUsername }
            }).done(function (response) {
                //location.reload();
                $(".tabs a:nth-child(2) span").trigger("click");
            }).fail(function (err) {
            });
        }
        return false;
    });
    $userListItem.append($userRemoveLink);
    return $userListItem;
};

var main = function (userObjects) {
    "use strict";
    // var toDos = toDoObjects.map(function (toDo) {
    //     return toDo.description;
    // });
    $(".tabs a span").toArray().forEach(function (element) {
        $(element).on("click", function () {
            var $element = $(element);
            var $content;
            $(".tabs a span").removeClass("active");
            $(element).addClass("active");
            $("main .content").empty();
            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<ul>");
                $.getJSON("users.json", function (userObjects) {
                    for (var i = 0; i < userObjects.length; i++) {
                        $content.append(liaWithDeleteOnСlick(userObjects[i]));
                    }
                });
                $("main .content").append($content);
            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul>");
                $.getJSON("users.json", function (userObjects) {
                    for (var i = 0; i < userObjects.length; i++) {
                        $content.append(liaWithEditOnСlick(userObjects[i]));
                    }
                });
                $("main .content").append($content);
            } else if ($element.parent().is(":nth-child(3)")) {
                var $input = $("<input>");
                var $inputLabel = $("<p>").text("Новый пользователь");
                $input.keypress(function (e) {
                    if (e.which == 13) {
                        if ($input.val() != "") {
                            var username = $input.val();
                            // создаем новый элемент списка задач
                            var newUser = { "username": username };
                            // здесь мы отправляем быстрое сообщение на маршрут списка задач
                            $.post("users", newUser, function (response) {
                                // этот обратный вызов выполняется при ответе сервера
                                console.log("Мы отправили данные и получили ответ сервера!");
                                console.log(response);
                                // нужно отправить новый объект на клиент
                                // после получения ответа сервера
                                if (response !== null) {
                                    userObjects.push(newUser);
                                    $(".tabs a:first-child span").trigger("click");
                                } else { alert("Пользователь с таким именем уже существует"); }
                            });
                        } else { alert("Поля должны быть заполнены"); }
                    }
                });
                var $button = $("<button style='width: 36px; height: 36px; margin-left: 10px; border-radius: 5px; border: none; cursor: pointer;'>+</button>");
                $("main .content").append($inputLabel);
                $("main .content").append($input);
                $("main .content").append($button);
                $(".content button").on("click", function () {
                    if ($input.val() != "") {
                        var username = $input.val();
                        // создаем новый элемент списка задач
                        var newUser = { "username": username };
                        // здесь мы отправляем быстрое сообщение на маршрут списка задач
                        $.post("users", newUser, function (response) {
                            // этот обратный вызов выполняется при ответе сервера
                            console.log("Мы отправили данные и получили ответ сервера!");
                            console.log(response);
                            // нужно отправить новый объект на клиент
                            // после получения ответа сервера
                            if (response !== null) {
                                userObjects.push(newUser);
                                location.reload();
                                $(".tabs a:first-child span").trigger("click");
                            } else { alert("Пользователь с таким именем уже существует"); }
                        });
                    } else { alert("Поля должны быть заполнены"); }
                });
            } else if ($element.parent().is(":nth-child(4)")) {
                var $input = $("<input>");
                var $inputLabel = $("<p>").text("Имя пользователь");
                $input.keypress(function (e) {
                    if (e.which == 13) {
                        if ($input.val() != "") {
                            var username = $input.val();
                            $.ajax({
                                "url": "users/" + username,
                                "type": "GET"
                            }).done(function (response) {
                                if (response !== null) {
                                    document.location.href = "/user/" + response + "/";
                                } else {
                                    alert("Такого пользователя нет в системе");
                                }
                                //location.reload();
                            }).fail(function (err) {
                                console.log("error on delete 'user'!");
                            });
                            return false;

                        } else { alert("Поля должны быть заполнены"); }
                    }
                });
                var $button = $("<button style='height: 36px; margin-left: 10px; border-radius: 5px; border: none; cursor: pointer;'>Войти</button>");
                $("main .content").append($inputLabel);
                $("main .content").append($input);
                $("main .content").append($button);
                $(".content button").on("click", function () {
                    if ($input.val() != "") {
                        var username = $input.val();
                        $.ajax({
                            "url": "users/" + username,
                            "type": "GET"
                        }).done(function (response) {
                            if (response !== null) {
                                document.location.href = "/user/" + response + "/";
                            } else {
                                alert("Такого пользователя нет в системе");
                            }
                            //location.reload();
                        }).fail(function (err) {
                            console.log("error on delete 'user'!");
                        });
                        return false;

                    } else { alert("Поля должны быть заполнены"); }
                });
            }
            return false;
        });
    });
    $(".tabs a:first-child span").trigger("click");
}
$(document).ready(function () {
    $.getJSON("users.json", function (userObjects) {
        main(userObjects);
    });
});
