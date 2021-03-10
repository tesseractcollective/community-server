function setRoleToUser(user, context, callback) {
    console.log('setRoleToUser');
    console.log('user', JSON.stringify(user));

    const query = `query getRoleForEmail($email: String!) {
        users(where: {email: {_eq: $email}}) {
          id
          email
          role
        }
    }`;
    const variables = { "email": user.email };
    request.post({
        url: configuration.hasuraGraphqlUrl,
        headers: { 'content-type': 'application/json', 'x-hasura-admin-secret': configuration.hasuraAdminSecret },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    }, function (error, response, body) {
        if (error) {
            return callback(error);
        }
        console.log(body);
        const responseJson = JSON.parse(body);
        if (responseJson.data) {
            const hasuraUser = responseJson.data.users[0];
            const namespace = "https://hasura.io/jwt/claims";
            const allowedRoles = hasuraUser.role === 'admin' ? ['admin', 'user'] : [hasuraUser.role];
            const claims = {
                'x-hasura-default-role': hasuraUser.role,
                'x-hasura-allowed-roles': allowedRoles,
                'x-hasura-user-id': hasuraUser.id
            };
            context.accessToken[namespace] = claims;
            context.idToken[namespace] = claims;
            callback(null, user, context);
        }
				
    });
}

function addHasuraUser(user, context, callback) {
    console.log('addHasuraUser');
    const query = `mutation($nickname: String, $email: String) {
      insert_users(objects: [{
        name: $nickname, email: $email
      }], on_conflict: {constraint: users_email_key, update_columns: [name]}
      ) {
        affected_rows
      }
    }`;
    const variables = { "nickname": user.nickname, email: user.email };
    request.post({
        url: configuration.hasuraGraphqlUrl,
        headers: { 'content-type': 'application/json', 'x-hasura-admin-secret': configuration.hasuraAdminSecret },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    }, function (error, response, body) {
        if (error) {
            return callback(error);
        }
        console.log(body);
        callback(null, user, context);
    });
}

function emailVerified(user, context, callback) {
    if (!user.email_verified) {
        return callback(new UnauthorizedError('Please verify your email before logging in.'));
    } else {
        return callback(null, user, context);
    }
}

