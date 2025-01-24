const axios = require('axios');

class UserService {
    async getUserInfo(accessToken) {
        try {
            const response = await axios.get('https://account-d.docusign.com/oauth/userinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data; // Contains user info
        } catch (error) {
            console.error('Error fetching user info:', error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = new UserService();