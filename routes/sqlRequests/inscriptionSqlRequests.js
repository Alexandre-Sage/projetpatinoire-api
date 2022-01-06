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
                                                                    profilCreationDate
                                                                )
                                                                VALUES(?,?,?,?,?,?,?,?,NOW())`;
exports.sqlRequestSendInscritpionFormRoute= sqlRequestSendInscritpionFormRoute;
