const sqlRequestAllImagesRoute=`SELECT * FROM userImages
                                WHERE userId=?`;
exports.sqlRequestAllImagesRoute= sqlRequestAllImagesRoute;
////////////////////////////////////////////////////////////////////////////////
const sqlRequestImageHistoryRoute=`SELECT * FROM userImages
                                    WHERE userId=?
                                    ORDER BY imageUploadDate DESC
                                    LIMIT 3`;
exports.sqlRequestImageHistoryRoute= sqlRequestImageHistoryRoute;
////////////////////////////////////////////////////////////////////////////////
sqlRequestUploadRoute=`INSERT INTO userImages(
                                                userId,
                                                imagePath,
                                                imageTitle,
                                                imageDescription,
                                                imageUploadDate
                                            )
                        VALUES(?,?,?,?, NOW())`;
exports.sqlRequestUploadRoute= sqlRequestUploadRoute;
////////////////////////////////////////////////////////////////////////////////
const sqlRequestChangeProfilPictureRoute=`UPDATE profilPicture
                                            SET imageId=?
                                            WHERE userId=?`;
exports.sqlRequestChangeProfilPictureRoute= sqlRequestChangeProfilPictureRoute;
