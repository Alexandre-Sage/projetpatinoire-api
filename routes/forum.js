var express = require('express');
var router = express.Router();
var usersKeys= require("./modules/session/usersKeys");
var userSession= require("./modules/session/userSession");
var cookieParser = require('cookie-parser');
var slugify = require("slugify");
var app = express();
var multer = require('multer');
var sqlRequests= require("./sqlRequests/forumSqlRequests");
const upload= multer({dest: "./public/images/forumImages"});

router.get("/categories", function(req, res, next){
    const dataBase= req.app.locals.db;

    dataBase.query(sqlRequests.sqlRequestForumCategoriesRoute, [], function(err, forumCategories){
        if(err) throw err;
        res.json(forumCategories);
    })
})
module.exports = router;

router.get("/topics/:categoryId", function(req, res, next){
    const dataBase= req.app.locals.db;
    console.log(req.params.categoryId);
    dataBase.query(sqlRequests.sqlRequestForumCategoriesTopicsRoute,[req.params.categoryId], function(err, forumTopics){
        if(err) throw err;
        res.json(forumTopics);
    })
})
module.exports = router;

router.get("/posts/:topicId", function(req, res, next){
    const dataBase= req.app.locals.db;
    dataBase.query(sqlRequests.sqlRequestPostsDisplayRoute, [req.params.topicId], function(err, forumPosts){
        if(err) throw err;
        console.log(forumPosts);
        res.json(forumPosts);
    })
})
module.exports = router;

//Route permettant de créer les nouveaux sujet
router.post("/topic/new/:categoryId", upload.single("image"), async function(req, res, next){
    const dataBase= req.app.locals.db;
    console.log(req.body);
    //Post sans image
    if(userSession.authentification(usersKeys, req.signedCookies.userKey) && req.body.firstTopicPost && req.body.topicTitle && !req.file){
        console.log("without image");
        dataBase.query(sqlRequests.sqlRequestNewTopicRoute,[parseInt(req.params.categoryId),usersKeys[req.signedCookies.userKey],req.body.topicTitle], function(err, result){
            const newTopicId= result.insertId;
            dataBase.query(sqlRequests.sqlRequestNewTopicRouteFirstPost,[newTopicId, usersKeys[req.signedCookies.userKey], req.body.firstTopicPost], function(err, resultTwo){
                res.json({
                    "topicId": newTopicId,
                    "message":`Votre nouveaux sujet à bien été ajouter`
                })
            })
        })
    //Passage avec image
    } else if(userSession.authentification(usersKeys, req.signedCookies.userKey) && req.body.firstTopicPost && req.body.topicTitle && req.file){
        console.log("with image");
        dataBase.query(sqlRequests.sqlRequestNewTopicRoute,[parseInt(req.params.categoryId),usersKeys[req.signedCookies.userKey],req.body.topicTitle], function(err, result){
            const newTopicId= result.insertId;
            dataBase.query(sqlRequests.sqlRequestNewTopicRouteFirstPostWithImage,[newTopicId, usersKeys[req.signedCookies.userKey], req.body.firstTopicPost, req.file.path], function(err, resultTwo){
                res.json({
                    "topicId": newTopicId,
                    "message":`Votre nouveaux sujet à bien été ajouter`
                })
            })
        })
    } else if(!req.body.firstTopicPost){
        res.json({
            "message": "Vous devez obligatoirement ajouter un premier post a votre sujet"
        })
    } else if(!req.body.topicTitle){
        res.json({
            "message":"Vous devez obligatoirement donner un titre a votre sujet"
        })
    } else{
        res.json({
            "message":"Vous devez vous connecter pour ajouter un nouveauc sujet"
        })
    }
})
module.exports = router;

//Route permettant de créer les nouveaux post
router.post("/post/new/:topicId", upload.single("image"), async function(req, res, next){
    const dataBase= req.app.locals.db
    let sucess= false;
    console.log(req.file);
    let sqlRequest;

    if(userSession.authentification(usersKeys, req.signedCookies.userKey) && !req.file && req.body.postContent){
        do{
            try{
                await dataBase.promise().query(sqlRequests.sqlRequestNewPostRoute,[req.params.topicId,usersKeys[req.signedCookies.userKey],req.body.postContent])
                sucess=true;
            } catch(err){
                console.log(err);
            }
        } while(!sucess){
            res.json({
                "message":"Votre post a été ajouter avec succès",
                "validator": true
            })
        }
    } else if(userSession.authentification(usersKeys, req.signedCookies.userKey) && req.file && req.body.postContent){
        do{
            try{
                await dataBase.promise().query(sqlRequests.sqlRequestNewPostRouteWithImage,[req.params.topicId,usersKeys[req.signedCookies.userKey],req.body.postContent, req.file.path])
                sucess=true;
            } catch(err){
                console.log(err);
            }
        } while(!sucess){
            res.json({
                "message":"Votre post a été ajouter avec succès",
                "validator": true
            })
        }
    } else{
        res.json({
            "message": "Vous devez vous connecter avant de poster.",
            "validator": false
        })
    }
})
module.exports = router;
