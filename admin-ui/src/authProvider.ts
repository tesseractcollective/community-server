interface AuthProviderProps {
  isAuthenticated: boolean;
  loginWithRedirect: any;
  logout: any;
  user: any;
}

export const auth0Config = {
  domain: "identity.crowdpoint.tech",
  clientId: "6iTqUbj8EDCFi2711sLQVVfS8SNdPWv1",
  audience: "https://identity.crowdpoint.tech",
}

export default ({
  isAuthenticated,
  loginWithRedirect,
  logout,
  user,
}: AuthProviderProps) => ({
  login: (params: any) => {
    console.log('login', params);
    return loginWithRedirect(params);
  },
  logout: () => {
    console.log('logout');
    if (isAuthenticated) {
      return logout({ returnTo: window.location.origin });
    }
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () => {
    console.log('checkAuth', 'isAuthenticated', isAuthenticated);
    return Promise.resolve();
    // if (isAuthenticated) {
    //   return Promise.resolve();
    // }
    // return Promise.reject();
  },
  getPermissions: () => Promise.reject('Unknown method'),
  getIdentity: () =>
    Promise.resolve({
      id: user.id,
      fullName: user.name,
      avatar: user.picture,
    }),
});