const COOKIE = 'hk_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const PASSWORD = 'kittychungus';

function loginHtml(error = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🎀 Holiday Planner</title>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Nunito', system-ui, sans-serif;
      background: #fff4fa;
      background-image: radial-gradient(circle, #ffc4e0 1px, transparent 1px);
      background-size: 22px 22px;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: #fff;
      border-radius: 22px;
      border: 2px solid #ffd6ec;
      box-shadow: 0 8px 40px rgba(200,80,160,.15);
      padding: 44px 38px;
      width: 100%;
      max-width: 360px;
      text-align: center;
    }
    .logo { font-size: 3.2rem; margin-bottom: 10px; }
    h1 { font-size: 1.45rem; font-weight: 900; color: #5c1e4a; margin-bottom: 5px; }
    .sub { font-size: .85rem; color: #c47faa; font-weight: 700; margin-bottom: 28px; }
    input[type="password"] {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #ffd6ec;
      border-radius: 13px;
      font-size: 1rem;
      font-family: inherit;
      font-weight: 700;
      color: #5c1e4a;
      background: #fff8fc;
      outline: none;
      margin-bottom: 12px;
      transition: border-color .15s, box-shadow .15s;
    }
    input[type="password"]:focus {
      border-color: #ff90c6;
      box-shadow: 0 0 0 3px rgba(255,144,198,.18);
    }
    button {
      width: 100%;
      padding: 13px;
      background: linear-gradient(135deg, #ff6ab4, #c43d8a);
      color: #fff;
      border: none;
      border-radius: 13px;
      font-size: 1rem;
      font-weight: 900;
      cursor: pointer;
      font-family: inherit;
      transition: opacity .15s;
    }
    button:hover { opacity: .88; }
    .err { color: #d00; font-size: .83rem; font-weight: 800; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🎀</div>
    <h1>Holiday Planner</h1>
    <p class="sub">Enter the password to continue ♥</p>
    <form method="POST" action="/__login">
      <input type="password" name="password" placeholder="Password" autofocus required>
      <button type="submit">Let me in ♥</button>
      ${error ? `<p class="err">${error}</p>` : ''}
    </form>
  </div>
</body>
</html>`;
}

function isAuthed(request) {
  const cookies = request.headers.get('Cookie') || '';
  return cookies.split(';').some(c => c.trim() === `${COOKIE}=ok`);
}

export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  // Handle login form POST
  if (url.pathname === '/__login' && request.method === 'POST') {
    let password = '';
    try {
      const fd = await request.formData();
      password = fd.get('password') || '';
    } catch {
      return new Response(loginHtml('Something went wrong — try again.'), {
        status: 400, headers: { 'Content-Type': 'text/html;charset=UTF-8' },
      });
    }

    if (password === PASSWORD) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: '/',
          'Set-Cookie': `${COOKIE}=ok; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`,
        },
      });
    }

    return new Response(loginHtml('Wrong password — try again 🙈'), {
      status: 401,
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  }

  // Block all other requests if not authenticated
  if (!isAuthed(request)) {
    return new Response(loginHtml(''), {
      status: 401,
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  }

  return next();
}
