import axios from 'axios';

const port = process.env.PORT || 5000;

const http = axios.create({
  baseURL: process.env.WEBSITE_HOSTNAME || `http://localhost:${port}`,
});

export default http;
