import React, { useEffect } from "react";
import buildHasuraProvider from "ra-data-hasura-graphql";
import { Admin, Resource, Loading } from "react-admin";
import ApolloClient from 'apollo-boost';
import { useAuth0 } from "@auth0/auth0-react";

import { customDataProvider, emptyDataProvider } from "./dataProvider";
import authProvider from "./authProvider";
import { UserEdit, UserList } from "./components/users";
import { DeviceList, DeviceShow } from "./components/devices";
import { theme } from "./theme";
import { GroupCreate, GroupEdit, GroupList } from "./components/groups";

const hasuraUrl = process.env.REACT_APP_HASURA_URL;

const App = () => {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();
  const customAuthProvider = authProvider({
    isAuthenticated,
    loginWithRedirect,
    logout,
    user,
  });
  const [dataProvider, setDataProvider] = React.useState<any>(undefined);

  console.log('isLoading', isLoading);
  console.log('user', user);
  console.log('isAuthenticated', isAuthenticated);
  console.log('error', error);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
    if (isAuthenticated) {
      getAccessTokenSilently().then(async (token: string) => {
        const client = new ApolloClient({
          uri: hasuraUrl,
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const dp = await buildHasuraProvider({ client });
        setDataProvider(() => customDataProvider(dp));
      }).catch(tokenError => {
        console.log(tokenError);
      });
    } 
  }, [isLoading, isAuthenticated, loginWithRedirect]);
  
  if (isLoading || !isAuthenticated || !dataProvider) {
    return <Loading loadingPrimary="Loading" loadingSecondary="" />
  }

  return (
    <Admin 
      dataProvider={dataProvider}
      authProvider={customAuthProvider}
      theme={theme}
    >
      <Resource 
        name="users"
        list={UserList}
        edit={UserEdit}
      />
      <Resource 
        name="groups"
        list={GroupList}
        edit={GroupEdit}
        create={GroupCreate}
      />
      <Resource 
        name="devices"
        list={DeviceList}
        show={DeviceShow}
      />
    </Admin>
  );
};

export default App;
