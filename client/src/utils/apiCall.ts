import axios from "axios";

const apiCall = async ({
  url,
  method,
  reqData = "",
  withCredentials = true,
}: {
  url: string;
  method: string;
  reqData?: any;
  withCredentials?: boolean;
}) => {
  try {
    const response: any = await axios({
      method,
      url: import.meta.env.VITE_SERVER_API + url,
      data: reqData,
      withCredentials: withCredentials,
    });
    console.log(response);
    return { data: response.data.data, status: response.status };
  } catch (error: any) {
    console.error(error);
    if (error.response.status === 401) {
      //logout if the status is something else
      if (!(await refreshToken())) {
        console.log("logout");
        await logout();
        return { data: error.response.data, status: 500 };
      } else {
        const new_data: any = await apiCall({
          url,
          method,
          reqData,
        });
        return { data: new_data.data, status: new_data.status };
      }
    }

    console.error(error);
    //await apiCall()
    return { data: error.response.data, status: error.status };
  }
};

export default apiCall;

export async function refreshToken() {
  const { status } = await apiCall({ url: "user/refreshToken", method: "GET" });
  return status === 200;
}

export async function logout() {
  const { status } = await apiCall({ url: "user/logout", method: "GET" });
  return status;
}