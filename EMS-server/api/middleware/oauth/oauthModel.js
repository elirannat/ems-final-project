const oAuthService = require('./oauthService')

exports.getAccessToken = (bearerToken, cbFunc) => {
	oAuthService.getUserIDFromBearerToken(bearerToken, (tokenExist, data) => {
		if (tokenExist) {
			var userID = data.userId;
			const accessToken = {
				accessToken: data.accessToken,
				accessTokenExpiresAt: data.accessTokenExpiresAt,
				client: {},
				user: {
					_id: userID,
				}
			};
			cbFunc(userID === null, userID === null ? null : accessToken);
		} else {
			cbFunc(new Error(data));
		}
	});
};

exports.getClient = (clientId, clientSecret, cbFunc) => {
	//validate clientId and clientSecret
	oAuthService.getClient(clientId, clientSecret, cbFunc);
};

exports.saveToken = (token, client, user, cbFunc) => {
	token.client = {
		id: client.clientId
	};

	token.user = {
		username: user.email,
		id: user._id
	};
	oAuthService.saveToken(token, client.clientId, user._id, cbFunc);
};

exports.getUser = (username, password, cbFunc) => {
	//validate user
	oAuthService.login(username, password, cbFunc);
};

exports.getRefreshToken = (refreshToken, cbFunc) => {
	oAuthService.getUserIDFromRefreshToken(refreshToken, (tokenData) => {
		var userID = tokenData.userId;
		const refreshToken = {
			refreshToken: tokenData.refreshToken,
			refreshTokenExpiresAt: tokenData.refreshTokenExpiresAt,
			client: {
				id: tokenData.clientId
			},
			user: {
				_id: tokenData.userId
			}
		};
		cbFunc(userID === null, userID === null ? null : refreshToken);
	});
};

exports.revokeToken = (token, cbFunc) => {
	oAuthService.deleteRefreshToken(token.refreshToken, (tokenDeleted) => {
		cbFunc(false, tokenDeleted);
	});
};