const domain = "https://appstore-378220.wl.r.appspot.com";

const handleResponseStatus = (response, errMsg) => {
  const { status, ok } = response;

  if (status === 401) {
    // unauthorized
    localStorage.removeItem("authToken"); // web storage remove token
    window.location.reload(); // refresh page，redirect to login page
    return;
  }

  if (!ok) {
    throw Error(errMsg); // 谁调用此函数谁handle
  }
};

export const login = (credential) => {
  //construct an url
  const url = `${domain}/signin`;
  return fetch(url, {
    // some configuration of the request
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credential),
  }) // this is a promise
    .then((response) => {
      if (!response.ok) {
        throw Error("Fail to log in");
      }

      return response.text(); // this is a new promise, it is token
    })
    .then((token) => {
      localStorage.setItem("authToken", token);
      //web API provided by modern web browsers
    });
};

export const register = (credential) => {
  const url = `${domain}/signup`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credential),
  }).then((response) => {
    handleResponseStatus(response, "Fail to register");
  });
};

export const uploadApp = (data, file) => {
  // file is media file
  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/upload`;

  const { title, description, price } = data; // descructing, get those field from submitted data
  const formData = new FormData(); // use a form data here because, the field contains media file
  formData.append("title", title);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("media_file", file); // source from file

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: formData,
  }).then((response) => {
    handleResponseStatus(response, "Fail to upload app");
  });
};

export const searchApps = (query) => {
  const title = query?.title ?? "";
  const description = query?.description ?? "";

  const authToken = localStorage.getItem("authToken");
  const url = new URL(`${domain}/search`);
  url.searchParams.append("title", title); // it is a GET request, we have to build url with adding queries
  url.searchParams.append("description", description);

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    handleResponseStatus(response, "Fail to search apps");

    return response.json();
  });
};

export const checkout = (appId) => {
  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/checkout?appID=${appId}`;

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      handleResponseStatus(response, "Fail to checkout");

      return response.text(); // this is redirect url to stripe
    })
    .then((redirectUrl) => {
      window.location = redirectUrl; // redirect the page to stripe url
    });
};
