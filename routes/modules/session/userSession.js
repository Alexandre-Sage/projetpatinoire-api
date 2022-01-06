var crypto = require("crypto");

function authentification(tokensList, userToken){
    if(tokensList[userToken]){
        return true;
    } else {
        return false;
    }
}
exports.authentification= authentification;

function hidePassword(password){
    const sha256= crypto.createHash("sha256");
    const hide= sha256.update(password).digest('base64');
    return hide;
}
exports.hidePassword= hidePassword;

function generateAuthToken(){
    return crypto.randomBytes(30).toString('hex');
};
exports.generateAuthToken= generateAuthToken;
