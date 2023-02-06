var main = function (userObjects) {
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
