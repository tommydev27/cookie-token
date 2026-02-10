(function() {
    // 1. CSS UI (Premium Dark/Light Mode)
    const style = document.createElement('style');
    style.textContent = `
        #floatBtn { position: fixed; bottom: 5%; right: 5%; z-index: 999999; width: 60px; height: 60px; background: #0866FF; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid #fff; }
        #grab-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #fff; z-index: 999998; display: none; padding: 20px; box-sizing: border-box; font-family: sans-serif; overflow-y: auto; }
        .box { background: #f0f2f5; padding: 15px; border-radius: 10px; margin-bottom: 15px; border: 1px solid #ddd; }
        label { font-weight: bold; font-size: 14px; color: #555; display: block; margin-bottom: 5px; }
        textarea { width: 100%; height: 80px; border: 1px solid #ccc; border-radius: 5px; padding: 8px; font-family: monospace; font-size: 12px; resize: none; background: #fff; box-sizing: border-box; }
        .btn-get { width: 100%; padding: 15px; background: #0866FF; color: #fff; border: none; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer; margin-bottom: 20px; }
        #notif { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #333; color: #fff; padding: 10px 20px; border-radius: 5px; display: none; z-index: 999999; }
    `;
    document.head.appendChild(style);

    // 2. HTML Structure
    const ui = document.createElement('div');
    ui.innerHTML = `
        <div id="floatBtn">🚀</div>
        <div id="grab-modal">
            <h2 style="text-align:center; color:#0866FF;">FB Grabber Pro</h2>
            <button class="btn-get" id="doFetch">FETCH DATA SEKARANG</button>
            
            <div class="box">
                <label>Cookie :</label>
                <textarea id="outCookie" readonly></textarea>
            </div>
            <div class="box">
                <label>Token (EAAG) :</label>
                <textarea id="outEAAG" readonly placeholder="Klik Fetch..."></textarea>
            </div>
            <div class="box">
                <label>Token (EAAB/DTSG) :</label>
                <textarea id="outEAAB" readonly placeholder="Klik Fetch..."></textarea>
            </div>
            <p style="font-weight:bold;">Facebook ID: <span id="outUID" style="color:#0866FF;">-</span></p>
        </div>
        <div id="notif">Copied!</div>
    `;
    document.body.appendChild(ui);

    const modal = document.getElementById('grab-modal');
    const floatBtn = document.getElementById('floatBtn');
    
    floatBtn.onclick = () => modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';

    // 3. Logic Fetch Data yang Beneran
    document.getElementById('doFetch').onclick = async function() {
        this.innerText = "Processing...";
        
        // Ambil Cookie & UID Langsung
        const cookie = document.cookie;
        const uid = cookie.match(/c_user=(\d+)/)?.[1] || "Gagal ambil UID";
        
        document.getElementById('outCookie').value = cookie;
        document.getElementById('outUID').innerText = uid;

        // Ambil Token EAAG (Cara paling tembus)
        try {
            const fb_dtsg = document.getElementsByName('fb_dtsg')[0]?.value || document.documentElement.innerHTML.match(/["']token["']\s*:\s*["']([^"']+)["']/)?.[1];
            document.getElementById('outEAAB').value = fb_dtsg || "DTSG tidak ditemukan";

            // Mencoba ambil EAAG dari internal Business Suite
            const response = await fetch('https://business.facebook.com/business_locations');
            const text = await response.text();
            const tokenEAAG = text.match(/(EAAG[a-zA-Z0-9]+)/)?.[1];
            
            document.getElementById('outEAAG').value = tokenEAAG || "EAAG Gagal (Harus di tab business.facebook.com)";
        } catch (e) {
            document.getElementById('outEAAG').value = "Error: Buka tab business.facebook.com dulu!";
        }
        
        this.innerText = "FETCH DATA SEKARANG";
        copyAlert("Data Berhasil Disinkron!");
    };

    // Fungsi Copy Otomatis
    function copyAlert(msg) {
        const n = document.getElementById('notif');
        n.innerText = msg;
        n.style.display = 'block';
        setTimeout(() => n.style.display = 'none', 2000);
    }

    const areas = ['outCookie', 'outEAAG', 'outEAAB'];
    areas.forEach(id => {
        document.getElementById(id).onclick = function() {
            if(!this.value) return;
            this.select();
            document.execCommand('copy');
            copyAlert("📋 Berhasil Disalin!");
        };
    });
})();
