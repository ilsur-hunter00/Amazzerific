var ToDo = require("../models/todo"),
    User = require("../models/user"),
    mongoose = require("mongoose");

var ToDosController = {};
ToDosController.index = function (req, res) {
    var username = req.params.username || null,
        respondWithToDos;
    respondWithToDos = function (query) {
        ToDo.find(query, function (err, toDos) {
            if (err !== null) {
                res.json(500, err);
            } else {
                res.status(200).json(toDos);
            }
        });
    };
    if (username !== null) {
        User.find({ "username": username }, function (err, result) {
            if (err !== null) {
                res.json(500, err);
            } else if (result.length === 0) {
                res.status(404).json({ "result_length": 0 });
            } else {
                respondWithToDos({ "owner": result[0]._id });
            }
        });
    } else {
        respondWithToDos({});
    }
};

ToDosController.create = function (req, res) {
    var username = req.params.username || null,
        newToDo = new ToDo({
            "description": req.body.description,
            "tags": req.body.tags
        });
    User.find({ "username": username }, function (err, result) {
        if (err) {
            res.send(500);
        } else {
            if (result.length === 0) {
                newToDo.owner = null;
            } else {
                newToDo.owner = result[0]._id;
            }
            newToDo.save(function (err, result) {
                if (err !== null) {
                    res.json(500, err);
                } else {
                    res.status(200).json(result);
                }
            });
        }
    });

};

ToDosController.update = function (req, res) {
    var id = req.params.id;
    var newDescription = { $set: { description: req.body.description } };
    ToDo.updateOne({ "_id": id }, newDescription, function (err, todo) {
        if (err !== null) {
            res.status(500).json(err);
        } else {
            if (todo.n === 1 && todo.nModified === 1 && todo.ok === 1) {
                res.status(200).json(todo);
            } else {
                res.status(404).json({ "status": 404 });
            }
        }
    });
};
// ?????????????? ?????????????????????????? ????????????????????????
ToDosController.destroy = function (req, res) {
    var id = req.params.id;
    ToDo.deleteOne({ "_id": id }, function (err, todo) {
        if (err !== null) {
            res.status(500).json(err);
        } else {
            if (todo.n === 1 && todo.ok === 1 && todo.deletedCount === 1) {
                res.status(200).json(todo);
            } else {
                res.status(404).json({ "status": 404 });
            }
        }
    });
};
module.exports = ToDosController;