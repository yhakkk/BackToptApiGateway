import express from 'express';
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 4000;

app.use('/service1', createProxyMiddleware({
  target: 'http://localhost:4001', 
  changeOrigin: true,
  pathRewrite: {
    '^/service1': '', 
  },
}));

app.use('/service2', createProxyMiddleware({
  target: 'http://localhost:4002',
  changeOrigin: true,
  pathRewrite: {
    '^/service2': '', 
  },
}));

app.listen(port, () => {
  console.log(`API Gateway 👂🏼 en port:${port}`);
});