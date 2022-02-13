const sqlRequestCountriesInscriptionFormRoute= `SELECT * FROM countries`;
exports.sqlRequestCountriesInscriptionFormRoute= sqlRequestCountriesInscriptionFormRoute;

////////////////////////////////////////////////////////////////////////////////

const sqlRequestTownsInscriptionFormRoute=`SELECT * FROM towns WHERE countryId=?`;
exports.sqlRequestTownsInscriptionFormRoute= sqlRequestTownsInscriptionFormRoute;

////////////////////////////////////////////////////////////////////////////////

const sqlRequestSendInscritpionFormRoute= `INSERT INTO usersProfils(
                                                                    countryId,
                                                                    townId,
                                                                    firstName,
                                                                    lastName,
                                                                    birthday,
                                                                    email,
                                                                    userName,
                                                                    password,
                                                                    adminUser,
                                                                    profilCreationDate
                                                                )
                                                                VALUES(?,?,?,?,?,?,?,?,FALSE,NOW())`;
exports.sqlRequestSendInscritpionFormRoute= sqlRequestSendInscritpionFormRoute;

const sqlRequestDefaultProfilPicture= `INSERT INTO profilPicture(userId, imageId)
                                        VALUES(?,1)`;
exports.sqlRequestDefaultProfilPicture=sqlRequestDefaultProfilPicture;

const sqlRequestNewUserId= `SELECT userId
                            FROM usersProfils
                            WHERE email=?`;
exports.sqlRequestNewUserId=sqlRequestNewUserId;
