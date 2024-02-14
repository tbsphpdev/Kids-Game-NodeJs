const { t } = require('jm-ez-l10n');
const jwt = require('jsonwebtoken');

module.exports = {
    getAuthToken(data) {
        return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '24h' });
    },
    decodeAuthToken(token){
        if (token) {
            try {
              return jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {
                return false;
            }
        }
        return false;
    }
}