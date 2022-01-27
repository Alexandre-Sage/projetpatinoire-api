var express = require('express');
var router = express.Router();
var usersKeys= require("./modules/session/usersKeys");
var userSession= require("./modules/session/userSession");
var cookieParser = require('cookie-parser');
var slugify = require("slugify");
var app = express();

router.get("/categories", function(req, res, next){
    const dataBase= req.app.locals.db;
    const sqlRequestForumCategoriesRoute="SELECT * FROM forumCategories";
    dataBase.query(sqlRequestForumCategoriesRoute, [], function(err, forumCategories){
        if(err) throw err;
        res.json(forumCategories);
    })
})
module.exports = router;

router.get("/topics/:categoryId", function(req, res, next){
    const dataBase= req.app.locals.db;
    console.log(req.params.categoryId);
    const sqlRequestForumCategoriesTopicsRoute= `SELECT * FROM forumTopics
                                                    WHERE categoryId=?`
    dataBase.query(sqlRequestForumCategoriesTopicsRoute,[req.params.categoryId], function(err, forumTopics){
        if(err) throw err;
        res.json(forumTopics);
    })
})
module.exports = router;

router.get("/posts/:topicId", function(req, res, next){
    const dataBase= req.app.locals.db;
    const sqlRequestPostsDisplayRoute= `SELECT * FROM forumPosts
                                        INNER JOIN forumTopics ON forumPosts.topicId
                                        INNER JOIN (SELECT userName, userId FROM usersProfils) usersProfils ON forumPosts.userId
                                        WHERE forumPosts.topicId=?
                                        AND forumTopics.topicId=forumPosts.topicId AND forumPosts.userId=usersProfils.userId`
    dataBase.query(sqlRequestPostsDisplayRoute, [req.params.topicId], function(err, forumPosts){
        if(err) throw err;
        console.log(forumPosts);
        res.json(forumPosts);
    })
})
module.exports = router;
