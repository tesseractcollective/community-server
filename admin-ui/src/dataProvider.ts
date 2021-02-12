const convertFileToBase64 = (file: any): Promise<any> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });

export const customDataProvider = (dataProvider: any) => {
  return (
    fetchType: string,
    resource: string,
    params: { [key: string]: any }
  ) => {
    const image = params?.data?.image;
    if (
      (fetchType === "CREATE" || fetchType === "UPDATE") &&
      resource === "pollOptions" &&
      image?.rawFile instanceof File
    ) {
      return convertFileToBase64(image.rawFile).then((picture64: any) => {
        if (picture64) {
          return dataProvider(fetchType, resource, {
            ...params,
            data: {
              ...params.data,
              image: picture64,
            },
          });
        } else {
          return dataProvider(fetchType, resource, params);
        }
      });
    }

    return dataProvider(fetchType, resource, params);
  };
};

const emptyHandleRequest = (type: string, resource: string, params: any) => {
  if (type.includes("LIST") || type.includes("MANY")) {
    return Promise.resolve({ data: [], total: 0 });
  }
  return Promise.resolve({ data: {} });
};

const dataProviderWithHandler = (
  handleRequest: (type: string, resource: string, params: any) => any
) => {
  return {
    getList: (resource: string, params: any) =>
      handleRequest("GET_LIST", resource, params),
    getOne: (resource: string, params: any) =>
      handleRequest("GET_ONE", resource, params),
    getMany: (resource: string, params: any) =>
      handleRequest("GET_MANY", resource, params),
    getManyReference: (resource: string, params: any) =>
      handleRequest("GET_MANY_REFERENCE", resource, params),
    update: (resource: string, params: any) =>
      handleRequest("UPDATE", resource, params),
    updateMany: (resource: string, params: any) =>
      handleRequest("UPDATE_MANY", resource, params),
    create: (resource: string, params: any) =>
      handleRequest("CREATE", resource, params),
    delete: (resource: string, params: any) =>
      handleRequest("DELETE", resource, params),
    deleteMany: (resource: string, params: any) =>
      handleRequest("DELETE_MANY", resource, params),
  };
};

export const emptyDataProvider = () => {
  return dataProviderWithHandler(emptyHandleRequest);
}
