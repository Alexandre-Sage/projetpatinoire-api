const sqlRequestChatRoute=`SELECT * FROM chatFlows
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
                                    AND receiverUserId=receivingUserId`
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
