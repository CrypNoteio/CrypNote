import axios from "axios";
import qs from "qs";

const instance = axios.create({});
instance.defaults.headers.put['Content-Type'] = 'application/json; charset=UTF-8';


export function postData(url,params) {
  return axios({
    method: 'post',
    url: url,
    data: qs.stringify(params),
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  }).then((res) => res.data)
  .catch((error) => {
    return Promise.reject(error?.response?.data);
  });
}




