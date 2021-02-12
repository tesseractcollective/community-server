import React from "react";
import { makeStyles } from '@material-ui/core';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Edit,
  EditButton,
  TextInput,
  SelectInput,
  Filter,
  SimpleForm,
} from "react-admin";

const roles = [
  { id: 'user', name: 'user' },
  { id: 'admin', name: 'admin' },
];


const useStyles = makeStyles({
  deviceRowCell: {
      maxWidth: 300,
      overflow: 'hidden',
  },
});

const UserFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search" source="email" alwaysOn />
  </Filter>
);

export const UserList = (props: any) => {
  return (
    <List {...props} filters={<UserFilter />}>
      <Datagrid rowClick="edit">
        <TextField source="email" />
        <TextField source="role" />
        <DateField source="createdAt" showTime={true} />
        <DateField source="updatedAt" showTime={true} />
        <EditButton />
      </Datagrid>
    </List>
  );
};

export const UserEdit = (props: any) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextField source="id" />
        <TextField source="email" />
        <DateField source="createdAt" showTime={true} />
        <DateField source="updatedAt" showTime={true} />
        <SelectInput source="role" choices={roles} />
        <UserDeviceList />
      </SimpleForm>
    </Edit>
  );
};

export const UserDeviceList = (props: any) => {
  const classes = useStyles();
  const overrides = {
    basePath: "/devices",
    resource: "devices",
    hasList: true,
    hasEdit: false,
    hasShow: true,
    hasCreate: false,
  };

  return (
    <List
      {...props}
      {...overrides}
      filter={{ userId: props.record.id }}
    >
      <Datagrid rowClick="show" optimized classes={{ rowCell: classes.deviceRowCell }}>
        <TextField source="type" />
        <TextField source="name" />
        <DateField source="createdAt" showTime={true} />
        <DateField source="updatedAt" showTime={true} />
        <TextField source="token" />
      </Datagrid>
    </List>
  );
};
