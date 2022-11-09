//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

//request targeting all articles

app.route("/articles")
    .get(function(req, res) {
        Article.find({}, function(err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }

        })
    })
    .post(function(req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err) {
            if (!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function(req, res) {
        Article.deleteMany({}, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Deleted all articles successfully");
            }
        });
    });

//request targeting specific article

app.route("/articles/:articleTitle")
    .get(function(req, res) {
        Article.findOne({
            title: req.params.articleTitle
        }, function(err, foundArticle) {
            if (err) {
                res.send(err);
            } else {
                res.send(foundArticle);
            }
        });
    });






app.listen(3000, function() {
    console.log("Server started on port 3000");
});