import axios from "axios";

function Axios(options = {}) {
  const { headers = {} } = options;

  return axios.create({
    baseURL: "http://localhost/flight-api/",
    // baseURL: "https://apis.foureflights.com/",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}
export default Axios;
