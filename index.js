import http from 'node:http';
import { URL } from 'node:url';

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const targetSite = reqUrl.searchParams.get('url');

  // 1. THE SEARCH UI
  if (!targetSite) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <body style="font-family:sans-serif;text-align:center;padding-top:20vh;background:#0f172a;color:white;">
        <h1>Stealth Browser</h1>
        <p>Enter a URL to browse privately</p>
        <input type="text" id="urlInput" placeholder="https://neal.fun" style="padding:12px;width:300px;border-radius:5px;border:none;">
        <button onclick="go()" style="padding:12px;cursor:pointer;border-radius:5px;background:#3b82f6;color:white;border:none;margin-left:5px;">Launch</button>
        <script>
          function go() {
            const val = document.getElementById('urlInput').value;
            if(!val) return;
            const url = val.startsWith('http') ? val : 'https://' + val;
            window.location.href = '/?url=' + encodeURIComponent(url);
          }
        </script>
      </body>
    `);
    return;
  }

  // 2. THE PROXY LOGIC
  try {
    // We use a public bridge to bypass most school/work blocks
    const proxiedUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(targetSite);
    const response = await fetch(proxiedUrl);
    const html = await response.text();
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } catch (err) {
    res.writeHead(500);
    res.end("Error loading site: " + err.message);
  }
});

// Port 3000 is the standard for Replit/Glitch/Render
server.listen(3000, () => {
  console.log('✅ SERVER STARTED ON PORT 3000');
});
