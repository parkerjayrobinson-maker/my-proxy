import http from 'node:http';

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const targetSite = reqUrl.searchParams.get('url');

  // Home Page
  if (!targetSite) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <body style="font-family:sans-serif;text-align:center;padding-top:20vh;background:#000;color:white;">
        <h1>Cloud Browser</h1>
        <input type="text" id="urlInput" placeholder="https://google.com" style="padding:10px;width:300px;">
        <button onclick="go()">Launch</button>
        <script>
          function go() {
            const v = document.getElementById('urlInput').value;
            window.location.href = '/?url=' + encodeURIComponent(v.includes('://') ? v : 'https://' + v);
          }
        </script>
      </body>
    `);
    return;
  }

  // The Proxy Logic (Server-Side)
  try {
    console.log("Fetching:", targetSite);
    const response = await fetch(targetSite, {
      headers: { 'User-Agent': 'Mozilla/5.0' } // Pretend to be a real browser
    });
    
    const html = await response.text();
    
    // Send the HTML back to your device
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } catch (e) {
    res.end("Could not load site: " + e.message);
  }
});

// Port 10000 is Render's default, but 3000 works too
server.listen(process.env.PORT || 3000, () => {
  console.log('✅ PROXY ACTIVE');
});
