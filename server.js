const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

const port = process.env.PORT || 8080;

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    let fp = path.join(root, urlPath);
    if (urlPath.endsWith("/") || urlPath === "") {
      fp = path.join(root, urlPath, "index.html");
    }

    // Blocks path traversal outside the project root.
    if (!fp.startsWith(root + path.sep)) {
      res.statusCode = 404;
      res.end("not found");
      return;
    }

    fs.readFile(fp, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end("not found");
        return;
      }
      res.setHeader("Content-Type", types[path.extname(fp)] || "text/plain; charset=utf-8");
      res.end(data);
    });
  })
  .listen(port, () => console.log("serving on http://localhost:" + port));
