import axios from 'axios';

const AxiosConfig = axios.create({
  baseURL: 'http://localhost:8080/api/',
  // baseURL: 'http://ec2-15-165-137-59.ap-northeast-2.compute.amazonaws.com/api',
  withCredentials: true,
});

export default AxiosConfig;
