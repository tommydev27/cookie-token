(function() {
    // 1. Injeksi CSS (UI Responsif & Glow Effect)
    const style = document.createElement('style');
    style.textContent = `
        #floatBtn { 
            position: fixed; bottom: 10vw; right: 7vw; z-index: 2147483647; 
            width: 14vw; height: 14vw; background: #0866FF; 
            border-radius: 50%; display: flex; align-items: center; 
            justify-content: center; cursor: pointer; font-size: 6vw; 
            box-shadow: 0 4px 15px rgba(8,102,255,0.5); border: 0.5vw solid white; 
        }
        #guard-modal {
            position: fixed; top: 0; left: 0; 
            width: 100vw; height: 100vh; background: #f0f2f5; 
            z-index: 2147483646; padding: 5vw; box-sizing: border-box; 
            display: none; overflow-y: auto; font-family: -apple-system, sans-serif;
        }
        .section-box { background: white; padding: 4vw; border-radius: 3vw; margin-bottom: 4vw; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .section-title { font-size: 4.5vw; font-weight: bold; color: #1c1e21; margin-bottom: 4vw; border-left: 1vw solid #0866FF; padding-left: 2vw; }
        .access-label { font-size: 3.2vw; font-weight: bold; color: #65676b; display: block; margin-bottom: 1.5vw; }
        
        .access-area { 
            width: 100%; height: 18vw; font-size: 3vw; border-radius: 2vw; 
            padding: 3vw; box-sizing: border-box; background: #f5f6f7; 
            color: #050505; border: 1px solid #ddd; resize: none; margin-bottom: 3vw; 
            font-family: 'Courier New', monospace !important; word-break: break-all;
        }

        .btn-main { 
            width: 100%; padding: 4vw; background: #0866FF; color: white; 
            border-radius: 2vw; border: none; font-weight: bold; font-size: 4vw; 
            transition: 0.3s;
        }
        .btn-main:active { background: #0055d4; transform: scale(0.98); }
        #mStatus { position: sticky; bottom: 2vw; background: rgba(0,0,0,0.8); color: white; padding: 2vw; border-radius: 10vw; text-align: center; display: none; }
    `;
    document.head.appendChild(style);

    // 2. Struktur HTML
    const container = document.createElement('div');
    container.innerHTML = `
        <div id="floatBtn">🚀</div>
        <div id="guard-modal">
            <div style="text-align:center; margin-bottom:6vw; padding-top:2vw;">
                <h1 style="font-size:8vw; font-weight:900; color:#0866FF; margin:0;">FB <span style="color:#1c1e21;">Grabber</span></h1>
                <p style="font-size:3vw; color:#65676b;">Click box to copy data</p>
            </div>

            <div class="section-box">
                <div class="section-title">Account Data</div>
                <button id="mGetAccess" class="btn-main">GET ACCESS TOKEN (EAAG)</button>
                
                <div id="contentAccess" style="display:none; margin-top:5vw;">
                    <label class="access-label">USER ID (UID):</label>
                    <textarea id="resId" class="access-area" readonly placeholder="Click Fetch..."></textarea>
                    
                    <label class="access-label">COOKIE FULL:</label>
                    <textarea id="resCookie" class="access-area" readonly placeholder="Click Fetch..."></textarea>
                    
                    <label class="access-label">ACCESS TOKEN (EAAG):</label>
                    <textarea id="resToken" class="access-area" readonly placeholder="Buka business.facebook.com dulu!" style="height:30vw; color:#d33;"></textarea>
                </div>
            </div>
            <div id="mStatus">Notification</div>
        </div>
    `;
    document.body.appendChild(container);

    // 3. Logika JS
    const modal = document.getElementById('guard-modal');
    const floatBtn = document.getElementById('floatBtn');
    const status = document.getElementById('mStatus');

    floatBtn.onclick = () => {
        modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
    };

    // Fungsi Notifikasi
    function showNotif(msg, color = "white") {
        status.innerHTML = `<span style="color:${color}">${msg}</span>`;
        status.style.display = 'block';
        setTimeout(() => { status.style.display = 'none'; }, 2000);
    }

    document.getElementById('mGetAccess').onclick = async () => {
        // Ambil UID & Cookie
        const uid = document.cookie.match(/c_user=(\d+)/)?.[1] || "LOGIN DULU BOS";
        document.getElementById('resId').value = uid;
        document.getElementById('resCookie').value = document.cookie;
        
        // Ambil Token EAAG (Logic Spesifik Business Suite)
        try {
            const resp = await fetch('https://business.facebook.com/content_management');
            const text = await resp.text();
            const tokenMatch = text.match(/(EAAG[a-zA-Z0-9]+)/);
            
            if (tokenMatch) {
                document.getElementById('resToken').value = tokenMatch[1];
                document.getElementById('resToken').style.color = "#008a1e";
                showNotif("✅ Data Berhasil Diambil!", "#00df1f");
            } else {
                document.getElementById('resToken').value = "GAGAL! Buka tab business.facebook.com dulu baru klik tombol ini.";
                document.getElementById('resToken').style.color = "red";
                showNotif("❌ Token Tidak Ditemukan", "red");
            }
        } catch (e) {
            document.getElementById('resToken').value = "Error: Pastikan berada di domain Facebook.";
            showNotif("⚠️ Terjadi Kesalahan", "orange");
        }

        document.getElementById('contentAccess').style.display = 'block';
    };

    // Fungsi Klik Langsung Copy
    const setupCopy = (id) => {
        const el = document.getElementById(id);
        el.onclick = function() {
            if (!this.value || this.value.includes("Error")) return;
            this.select();
            document.execCommand('copy');
            showNotif("📋 Berhasil Disalin!");
        };
    };

    setupCopy('resId');
    setupCopy('resCookie');
    setupCopy('resToken');

})();
