import Axios from './../../../service';

export const LOGIN_URL = "admin/admin-login";
export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";

// export const ME_URL = "http://localhost/flights_apis_new/admin/profile/1";

export function login(email, password) {
  return Axios({}).post(LOGIN_URL, { email, password });
}

export function register(email, fullname, username, password) {
  return Axios({}).post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return Axios({}).post(REQUEST_PASSWORD_URL, { email });
}

// export function getUserByToken() {
//   // Authorization head should be fulfilled in interceptor.
//   return axios({}).get(ME_URL);
// }
