const emailCheckSqlRequestConnexionRoute=`SELECT email
                                            FROM usersProfils`;
exports.emailCheckSqlRequestConnexionRoute= emailCheckSqlRequestConnexionRoute;
///////////////////////////////////////////////////////////////////////////////

const userProfilSqlRequestConnexionRoute=`SELECT userId, userName
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
                                        WHERE forumPosts.userId=?
                                        ORDER BY postCreationDate DESC
                                        LIMIT 10`;
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
////////////////////////////////////////////////////////////////////////////////

const sqlRequestUpdateProfilRoute= `UPDATE usersProfils
                                    SET userName=?,
                                        email=?,
                                        firstName=?,
                                        LastName=?,
                                        homeSpot=?,
                                        birthday=?,
                                        countryId=?,
                                        townId=?
                                    WHERE userId=?`
exports.sqlRequestUpdateProfilRoute=sqlRequestUpdateProfilRoute;

const sqlRequestPasswordConfirmationUpdatePasswordRoute=`SELECT password
                                                            FROM usersProfils
                                                            WHERE userId=?`
exports.sqlRequestPasswordConfirmationUpdatePasswordRoute=sqlRequestPasswordConfirmationUpdatePasswordRoute;

const sqlRequestUpdatePasswordRoute=`UPDATE usersProfils
                                        SET password=?
                                        WHERE userId=?`
exports.sqlRequestUpdatePasswordRoute=sqlRequestUpdatePasswordRoute;
