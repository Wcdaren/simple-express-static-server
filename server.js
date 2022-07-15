#!/usr/bin/env node

var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  errorHandler = require("errorhandler"),
  methodOverride = require("method-override"),
  hostname = process.env.HOSTNAME || "localhost",
  port = parseInt(process.env.PORT, 10) || 4567,
  publicDir = process.argv[2] || __dirname + "/public",
  path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

app.get("/", function (req, res) {
  res.sendFile(path.join(publicDir, "page/table.html"));
});
// const API_SERVICE_URL= 'http://47.110.255.92:8080'
const API_SERVICE_URL = "http://localhost:8080";
// Proxy endpoints
app.use(
  "/api",
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/api/`]: "",
    },
  })
);

app.use(methodOverride());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static(publicDir));
app.use(
  errorHandler({
    dumpExceptions: true,
    showStack: true,
  })
);

console.log(
  "Simple static server showing %s listening at http://%s:%s",
  publicDir,
  hostname,
  port
);
app.listen(port, hostname);
