import React from "react";
import { SimpleShowLayout } from "react-admin";
import { makeStyles } from '@material-ui/core/styles';
import { Show } from "react-admin";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
  TextInput,
  Filter,
} from "react-admin";
import CodeField from "./CodeField";

const DeviceFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search" source="type,name,token" alwaysOn />
  </Filter>
);

const useStyles = makeStyles({
  deviceRowCell: {
      maxWidth: 300,
      overflow: 'hidden',
  },
});

export const DeviceList = (props: any) => {
  const classes = useStyles();
  return (
    <List {...props} filters={<DeviceFilter />}>
      <Datagrid rowClick="show" classes={{ rowCell: classes.deviceRowCell }}>
        <TextField source="type" />
        <TextField source="name" />
        <ReferenceField source="userId" reference="users">
          <TextField source="email" />
        </ReferenceField>
        <DateField source="createdAt" showTime={true} />
        <DateField source="updatedAt" showTime={true} />
        <TextField source="token" />
      </Datagrid>
    </List>
  );
};

export const DeviceShow = (props: any) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="type" />
        <TextField source="name" />
        <CodeField source="token" />
        <ReferenceField source="userId" reference="users">
          <TextField source="email" />
        </ReferenceField>
        <DateField source="createdAt" showTime={true} />
        <DateField source="updatedAt" showTime={true} />
      </SimpleShowLayout>
    </Show>
  );
};
