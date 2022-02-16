/*SELECT * FROM chatFlows

INNER JOIN (SELECT userName AS sendingUserName, userId  FROM usersProfils) AS sendingUser ON sendingUserId=sendingUser.userId
INNER JOIN (SELECT userId ,imageId AS sendingUserImageId FROM profilPicture) AS sendingUserImage ON sendingUserId= sendingUserImage.userId
INNER JOIN (SELECT imageId ,imagePath as sendingUserPath FROM userImages) AS sendingUserImagePath ON sendingUserImageId=sendingUserImagePath.imageId

INNER JOIN (SELECT userName AS receiverUserName , userId FROM usersProfils) AS receiverUser ON receiverUser.userId=receiverUserId
INNER JOIN (SELECT userId ,imageId AS receiverUserImageId FROM profilPicture) AS receiverUserImage ON receiverUserId=receiverUserImage.userId
INNER JOIN userImages AS receiverUserImagePath ON receiverUserImagePath.imageId=receiverUserImageId

WHERE sendingUserId=1  AND sendingUserId=sendingUser.userId AND sendingUserId=sendingUserImage.userId AND receiverUserId=receiverUser.userId AND receiverUserId=receiverUserImage.userId OR receiverUserId=1 AND sendingUserId=sendingUser.userId AND receiverUserId=receiverUserImage.userId AND receiverUserId=receiverUser.userId AND sendingUserId=sendingUserImage.userId*/


/*SELECT * FROM chatFlows

INNER JOIN (SELECT userName AS sendingUserName, userId  FROM usersProfils) AS sendingUser ON sendingUserId=sendingUser.userId
INNER JOIN (SELECT userId ,imageId AS sendingUserImageId FROM profilPicture) AS sendingUserImage ON sendingUserId= sendingUserImage.userId
INNER JOIN (SELECT imageId ,imagePath as sendingUserPath FROM userImages) AS sendingUserImagePath ON sendingUserImageId=sendingUserImagePath.imageId

INNER JOIN (SELECT userName AS receiverUserName , userId FROM usersProfils) AS receiverUser ON receiverUser.userId=receiverUserId
INNER JOIN (SELECT userId ,imageId AS receiverUserImageId FROM profilPicture) AS receiverUserImage ON receiverUserId=receiverUserImage.userId
INNER JOIN userImages AS receiverUserImagePath ON receiverUserImagePath.imageId=receiverUserImageId

WHERE sendingUserId=1  AND sendingUserId=sendingUser.userId AND sendingUserId=sendingUserImage.userId AND receiverUserId=receiverUser.userId AND receiverUserId=receiverUserImage.userId OR receiverUserId=1 AND sendingUserId=sendingUser.userId AND receiverUserId=receiverUserImage.userId AND receiverUserId=receiverUser.userId AND sendingUserId=sendingUserImage.userId*/

/*SELECT * FROM chatFlows
                                INNER JOIN (SELECT userName AS sendingUserName, userId AS sendUserId FROM  usersProfils)
                                    AS sendingUser
                                ON sendingUserId
                                INNER JOIN (SELECT userName AS receiverUserName , userId AS receivingUserId FROM usersProfils)
                                    AS receiverUser
                                ON receiverUserId
                                WHERE sendingUserId=?
                                    AND sendingUserId=sendUserId
                                    AND receiverUserId=receivingUserId
                                OR receiverUserId=?
                                    AND sendingUserId=sendUserId
                                    AND receiverUserId=receivingUserId*/

const sqlRequestChatRoute=`SELECT * FROM chatFlows

INNER JOIN (SELECT userName AS sendingUserName, userId  FROM usersProfils) AS sendingUser ON sendingUserId=sendingUser.userId
INNER JOIN (SELECT userId ,imageId AS sendingUserImageId FROM profilPicture) AS sendingUserImage ON sendingUserId= sendingUserImage.userId
INNER JOIN (SELECT imageId ,imagePath as sendingUserPath FROM userImages) AS sendingUserImagePath ON sendingUserImageId=sendingUserImagePath.imageId

INNER JOIN (SELECT userName AS receiverUserName , userId FROM usersProfils) AS receiverUser ON receiverUser.userId=receiverUserId
INNER JOIN (SELECT userId ,imageId AS receiverUserImageId FROM profilPicture) AS receiverUserImage ON receiverUserId=receiverUserImage.userId
INNER JOIN (SELECT imageId, imagePath AS receiverPath FROM userImages) AS receiverUserImagePath ON receiverUserImagePath.imageId=receiverUserImageId

WHERE sendingUserId=?  AND sendingUserId=sendingUser.userId AND sendingUserId=sendingUserImage.userId AND receiverUserId=receiverUser.userId AND receiverUserId=receiverUserImage.userId OR receiverUserId=? AND sendingUserId=sendingUser.userId AND receiverUserId=receiverUserImage.userId AND receiverUserId=receiverUser.userId AND sendingUserId=sendingUserImage.userId`
exports.sqlRequestChatRoute=sqlRequestChatRoute;

const sqlRequestChatFlowRoute=`SELECT * FROM chatMessages
                                INNER JOIN (SELECT userName, userId FROM usersProfils) usersProfils
                                ON chatMessages.userId
                                WHERE flowId=?
                                AND chatMessages.userId=usersProfils.userId
                                ORDER BY messageSendingDate DESC`
exports.sqlRequestChatFlowRoute=sqlRequestChatFlowRoute;

const sqlRequestSendMessageRoute= `INSERT INTO chatMessages(
                                        userId,
                                        flowId,
                                        content,
                                        messageSendingDate
                                    )
                                    VALUES(?,?,?,NOW())`
exports.sqlRequestSendMessageRoute=sqlRequestSendMessageRoute;
