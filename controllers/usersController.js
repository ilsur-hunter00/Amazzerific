var User = require("../models/user.js"),
    ToDo = require("../models/todo"),
    mongoose = require("mongoose");

// проверка, не существует ли уже пользователь
User.find({}, function (err, result) {
    if (err !== null) {
        console.log("Что-то идет не так");
        console.log(err);
    } else if (result.length === 0) {
        console.log("Создание тестового пользователя...");
        var exampleUser = new User({ "username": "usertest" });
        exampleUser.save(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("Тестовый пользователь сохранен");
            }
        });
    }
});

var UsersController = {};
UsersController.index = function (req, res) {
    User.find({}, function (err, users) {
        if (err !== null) {
            res.json(500, err);
        } else if (users.length === 0) {
            res.status(404).json({ "result_length": 0 });
        } else {
            res.status(200).json(users);
        }
    });
};
// Отобразить пользователя
UsersController.show = function (req, res) {
    var username = req.params.username;
    User.find({ "username": username }, function (err, result) {
        if (err) {
            res.send(500);
        } else {
            if (result.length === 0) {
                console.log("Пользователь с таким именем нет");
                res.status(200).json(null);
            } else {
                console.log("Пользователь с таким именем уже существует");
                res.status(200).json(username);
            }
        }
    });
};
// Создать нового пользователя
UsersController.create = function (req, res) {
    var newUser = new User({
        "username": req.body.username
    });
    User.find({ "username": newUser.username }, function (err, result) {
        if (err) {
            res.send(500);
        } else {
            if (result.length === 0) {
                newUser.save(function (err, result) {
                    if (err !== null) {
                        res.json(500, err);
                    } else {
                        res.status(200).json(result);
                    }
                });
            } else {
                console.log("Пользователь с таким именем уже существует");
                res.status(200).json(null);
            }

        }
    });
};
// Обновить существующего пользователя
UsersController.update = function (req, res) {
    var username = req.params.username;
    var newUsername = { $set: { username: req.body.username } };
    User.updateOne({ "username": username }, newUsername, function (err, user) {
        if (err !== null) {
            res.status(500).json(err);
        } else {
            if (user.n === 1 && user.nModified === 1 && user.ok === 1) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ "status": 404 });
            }
        }
    });
};
// Удалить существующего пользователя
UsersController.destroy = function (req, res) {
    var id = req.params.id;
    //ToDo.deleteMany({ "owner": id });
    User.deleteOne({ "_id": id }, function (err, user) {
        if (err !== null) {
            res.status(500).json(err);
        } else {
            if (user.n === 1 && user.ok === 1 && user.deletedCount === 1) {
                res.status(200).json(user);
                console.log("Удален пользователь");
                ToDo.deleteMany({ "owner": id }, (err, status) => { console.log(status); });
            } else {
                res.status(404).json({ "status": 404 });
            }
        }
    });
};
module.exports = UsersController;