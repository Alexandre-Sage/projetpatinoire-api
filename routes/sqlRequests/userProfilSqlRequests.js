const emailCheckSqlRequestConnexionRoute=`SELECT email
                                            FROM usersProfils`;
exports.emailCheckSqlRequestConnexionRoute= emailCheckSqlRequestConnexionRoute;
///////////////////////////////////////////////////////////////////////////////

const userProfilSqlRequestConnexionRoute=`SELECT userId
                                            FROM usersProfils
                                            WHERE email=?`;
exports.userProfilSqlRequestConnexionRoute= userProfilSqlRequestConnexionRoute;
///////////////////////////////////////////////////////////////////////////////

const passwordSqlRequestConnexionRoute=`SELECT password
                                        FROM usersProfils
                                        WHERE email=?`;
exports.passwordSqlRequestConnexionRoute= passwordSqlRequestConnexionRoute;
////////////////////////////////////////////////////////////////////////////////

const sqlHistoryRequestConnexionRoute=`SELECT * FROM forumPosts
                                        INNER JOIN forumTopics
                                        ON forumPosts.topicId = forumTopics.topicId
                                        WHERE forumPosts.userId=?`
exports.sqlHistoryRequestConnexionRoute= sqlHistoryRequestConnexionRoute;
////////////////////////////////////////////////////////////////////////////////

const userProfilSqlRequestUserProfilRoute=`SELECT * FROM profilPicture
                                            INNER JOIN usersProfils ON usersProfils.userId
                                            INNER JOIN userImages ON userImages.imageId
                                            INNER JOIN towns ON usersProfils.townId
                                            WHERE profilPicture.userId=?
                                            AND profilPicture.userId=usersProfils.userId
                                            AND profilPicture.imageId=userImages.imageId
                                            AND usersProfils.townId=towns.townId`
exports.userProfilSqlRequestUserProfilRoute=userProfilSqlRequestUserProfilRoute;
