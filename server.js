const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    // Prevent directory traversal attacks (security measure)
    if (!filePath.startsWith(path.join(__dirname, 'public'))) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        return res.end('<h1>403 - Forbidden</h1>', 'utf8');
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end('<h1>404 - File Not Found</h1>', 'utf8');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': mime.lookup(filePath) || 'application/octet-stream' });
            return res.end(content, 'utf8');
        }
    });
});

const PORT = 3000; // Change if needed
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
