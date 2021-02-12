function login(email, password, callback) {
    console.log('login');
    const bcrypt = require('bcrypt');
    async function api(method, path, body = undefined) {
      const fetch = require('node-fetch');
      const response = await fetch(`${configuration.baseUrl}${path}`, { method, headers: { 'x-api-key': configuration.apiKey, 'Content-Type': 'application/json' }, body });
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  
    (async () => {
      try {
        const apiUser = await api('GET', `/admin/user-by-email/${encodeURIComponent(email)}?passwordHash=true`);
        if (!apiUser) {
          throw new WrongUsernameOrPasswordError(email);
        }
  
        const hash = await bcrypt.hash(password, apiUser.passwordHash.salt);
        if (hash !== apiUser.passwordHash.hash) {
          throw new WrongUsernameOrPasswordError(email);
        }
  
        const user = {
          email,
          user_id: apiUser.id,
        };
        return callback(null, user);
      } catch(error) {
        return callback(error);
      }
    })();
  }

  function create(user, callback) {
    console.log('create');
    const bcrypt = require('bcrypt');
    async function api(method, path, body = undefined) {
      const fetch = require('node-fetch');
      const response = await fetch(`${configuration.baseUrl}${path}`, { method, headers: { 'x-api-key': configuration.apiKey, 'Content-Type': 'application/json' }, body });
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  
    (async () => {
      try {
        const apiUser = await api('GET', `/admin/user-by-email/${encodeURIComponent(user.email)}`)
          .catch(error => {});
        if (apiUser) {
          return callback(new Error('the user already exists'));
        }
  
        const noPassUser = { ...user };
        delete noPassUser.password;
  
        const userToCreate = {
          email: user.email,
          auth0: noPassUser,
        };
  
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);
        const url = `/admin/users?hash=${encodeURIComponent(hash)}&salt=${encodeURIComponent(salt)}`;
        const newUser = await api('POST', url, JSON.stringify(userToCreate));
        return callback(null, {
          email: newUser.email,
          user_id: newUser.id,
          nickname: newUser.email,
        });
      } catch(error) {
        return callback(error);
      }
    })();
  }

  function verify(email, callback) {
    // This script should mark the current user's email address as verified in your database.
    console.log('verify');
    async function api(method, path, body = undefined) {
      const fetch = require('node-fetch');
      const response = await fetch(`${configuration.baseUrl}${path}`, { method, headers: { 'x-api-key': configuration.apiKey, 'Content-Type': 'application/json' }, body });
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  
    (async () => {
      try {
        const apiUser = await api('GET', `/admin/user-by-email/${encodeURIComponent(email)}`);
        const user = {
          ...apiUser,
          emailVerified: true,
        };
        await api('PUT', `/admin/users/${user.id}`, JSON.stringify(user));
        return callback(null, user);
      } catch(error) {
        return callback(`${error.message}`);
      }
    })();
  }

  function changePassword(email, newPassword, callback) {
    console.log('changePassword');
    const bcrypt = require('bcrypt');
    async function api(method, path, body = undefined) {
      const fetch = require('node-fetch');
      const response = await fetch(`${configuration.baseUrl}${path}`, { method, headers: { 'x-api-key': configuration.apiKey, 'Content-Type': 'application/json' }, body });
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  
    (async () => {
      try {
        const apiUser = await api('GET', `/admin/user-by-email/${encodeURIComponent(email)}`);
  
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(newPassword, salt);
        const url = `/admin/users/${apiUser.id}?hash=${encodeURIComponent(hash)}&salt=${encodeURIComponent(salt)}`;
        await api('PUT', url, JSON.stringify(apiUser));
        return callback(null, true);
      } catch(error) {
        return callback(error);
      }
    })();
  }

  function getByEmail(email, callback) {
    console.log('getByEmail');
    async function api(method, path, body = undefined) {
      const fetch = require('node-fetch');
      const response = await fetch(`${configuration.baseUrl}${path}`, { method, headers: { 'x-api-key': configuration.apiKey, 'Content-Type': 'application/json' }, body });
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  
    (async () => {
      try {
        const apiUser = await api('GET', `/admin/user-by-email/${encodeURIComponent(email)}`)
          .catch(error => {});
        if (!apiUser) {
          return callback(null);
        }
        const user = {
          email,
          user_id: apiUser.id,
          ...apiUser.auth0,
        };
        return callback(null, user);
      } catch(error) {
        return callback(`${error.message}`);
      }
    })();
  }

  function remove(id, callback) {
    console.log('remove');
    async function api(method, path, body = undefined) {
      const fetch = require('node-fetch');
      const response = await fetch(`${configuration.baseUrl}${path}`, { method, headers: { 'x-api-key': configuration.apiKey, 'Content-Type': 'application/json' }, body });
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  
    (async () => {
      try {
        await api('DELETE', `/admin/users/${id}`);
        return callback(null);
      } catch(error) {
        return callback(`${error.message}`);
      }
    })();
  }