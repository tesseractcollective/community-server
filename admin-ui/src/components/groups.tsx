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
    Filter,
    SimpleForm,
    ImageField,
    ImageInput,
    Create,
} from "react-admin";

function b64toBlob(
    b64Data: any,
    contentType: string = "",
    sliceSize: number = 512
  ) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
  
      byteArrays.push(byteArray);
    }
  
    return new Blob(byteArrays, { type: contentType });
  }

const formatImage = (data: any) => {
    if (typeof data !== "string") {
      return data;
    }
    const block = data.split(";"); // Split the base64 string in data and contentType
    const contentType = block[0].split(":")[1]; // Get the content type of the image
    const realData = block[1].split(",")[1]; // get the real base64 content of the file

    // Convert it to a blob to upload
    const blob: any = b64toBlob(realData, contentType);
    const preview = URL.createObjectURL(blob);
    const transformedFile = {
      rawFile: blob,
      image: preview,
    };
    return transformedFile;
  };

const useStyles = makeStyles({
    groupRowCell: {
        maxWidth: 300,
        overflow: 'hidden',
    },
});

const GroupFilter = (props: any) => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
    </Filter>
);

const GroupImageField = (props: any) => {
    if (props.record.photoUrl) {
        return <ImageField source="photoUrl" label="photo" {...props} />;
    }
    return <ImageField source="photo" label="photo" {...props} />;
}

export const GroupList = (props: any) => {
    const classes = useStyles();
    return (
        <List {...props} filters={<GroupFilter />}>
            <Datagrid rowClick="edit" classes={{ rowCell: classes.groupRowCell }}>
                <TextField source="name" />
                <TextField source="description" />
                <GroupImageField />
                <DateField source="createdAt" showTime={true} />
                <DateField source="updatedAt" showTime={true} />
                <EditButton />
            </Datagrid>
        </List>
    );
};

export const GroupEdit = (props: any) => {
    return (
        <Edit {...props}>
            <SimpleForm>
                <TextField source="id" />
                <TextInput source="name" />
                <TextInput source="description" fullWidth multiline />
                <TextInput source="photoUrl" fullWidth />
                <ImageField source="photoUrl" />
                <ImageInput source="photo" accept="image/*" format={formatImage}>
                    <ImageField source="photo" />
                </ImageInput>
                <DateField source="createdAt" showTime={true} />
                <DateField source="updatedAt" showTime={true} />
            </SimpleForm>
        </Edit>
    );
};

export const GroupCreate = (props: any) => {
    return (
        <Create {...props}>
            <SimpleForm>
                <TextInput source="name" />
                <TextInput source="description" fullWidth multiline />
                <TextInput source="photoUrl" fullWidth />
                <ImageInput source="photo" accept="image/*" format={formatImage}>
                    <ImageField source="photo" />
                </ImageInput>
            </SimpleForm>
        </Create>
    );
};