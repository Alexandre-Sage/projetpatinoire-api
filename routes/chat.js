var express = require('express');
var router = express.Router();
var usersKeys= require("./modules/session/usersKeys");
var userSession= require("./modules/session/userSession");
var cookieParser = require('cookie-parser');
var slugify = require("slugify");
var app = express();
var multer = require('multer');
var sqlRequests= require("./sqlRequests/chatSqlRequests");
//const upload= multer({dest: "./public/images/chatImages"});


router.get("/", function(req, res, next){
    const dataBase= req.app.locals.db;
    if(userSession.authentification(usersKeys, req.signedCookies.userKey)){
        dataBase.query(sqlRequests.sqlRequestChatRoute,[usersKeys[req.signedCookies.userKey],usersKeys[req.signedCookies.userKey]], function(err, chatFlows){
            if(err) throw err;
            chatFlows.forEach((item, i) => {
                delete item.userId
                delete item.imageId
            });
            console.log(chatFlows);
            res.json(chatFlows);
        })
    }
});
module.exports = router;

router.get("/messages/:flowId", function(req, res, next){
    const dataBase= req.app.locals.db;
    if(userSession.authentification(usersKeys, req.signedCookies.userKey)){
        dataBase.query(sqlRequests.sqlRequestChatFlowRoute,[parseInt(req.params.flowId)], function(err, chatMessages){
            if(err) throw err;
            console.log(chatMessages);
            res.json(chatMessages);
        })
    }
});
module.exports = router;

router.post("/messages/send",async function(req,res,next){
    const dataBase= req.app.locals.db;
    let sucess=false;
    if(userSession.authentification(usersKeys, req.signedCookies.userKey)){
        console.log("yes");
        do {
            try{
                await dataBase.promise().query(sqlRequests.sqlRequestSendMessageRoute,[req.body.userId,req.body.flowId,req.body.content])
                sucess=true
            } catch(err){
                console.log(err);
                res.json("Une érreur c'est produite veuillez rééssayer")
            }
        } while (!sucess){
            res.json("message envoyer avec succes")
        }
    }
})
module.exports = router;
//A TESTER FETCH A sqlRequestPasswordConfirmationUpdatePasswordRoute
router.post("/newFlow/:sendingUserId/:receiverUserId",function(req,res,next){
    const dataBase=req.app.locals.db;
    let flowExisting=false;
    let sucess=false;
    let resultId;
    const sqlRequestNewFlowRoute=`INSERT INTO
                                    chatFlows(sendingUserId,
                                    receiverUserId,
                                    flowCreationDate)
                                    VALUES(?,?,NOW())`;
    const sqlRequestCheckFlowNewFlowRoute=`SELECT * FROM chatFlows`;
    dataBase.query(sqlRequestCheckFlowNewFlowRoute,async function(err, flows){
        flows.forEach((item) => {
            if(item.sendingUserId===parseInt(req.params.sendingUserId)&&item.receiverUserId===parseInt(req.params.receiverUserId)){
                res.json({
                    "validator":true,
                    "flowId": item.flowId
                })
                flowExisting=true;
            } else if (item.receiverUserId===parseInt(req.params.sendingUserId)&&item.sendingUserId===parseInt(req.params.receiverUserId)) {
                res.json({
                    "validator":true,
                    "flowId": item.flowId
                })
                flowExisting=true;
            }
        });
        if(!flowExisting){
            dataBase.query(sqlRequestNewFlowRoute,[parseInt(req.params.sendingUserId),parseInt(req.params.receiverUserId)],function(err, result){
                res.json({
                    "validator":true,
                    "flowId":result.insertId
                })
            })
        }
    })
})
