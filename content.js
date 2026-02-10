(function() {
    // 1. Injeksi CSS untuk UI yang bersih
    const style = document.createElement('style');
    style.textContent = `
        #floatBtn { position: fixed; bottom: 20px; right: 20px; z-index: 999999; width: 55px; height: 55px; background: #0866FF; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        #grab-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #ffffff; z-index: 999998; display: none; padding: 20px; box-sizing: border-box; font-family: sans-serif; overflow-y: auto; }
        .box-data { background: #f0f2f5; padding: 12px; border-radius: 10px; margin-bottom: 15px; border: 1px solid #ddd; }
        label { font-weight: bold; font-size: 14px; color: #444; display: block; margin-bottom: 5px; }
        textarea { width: 100%; height: 90px; border: 1px solid #ccc; border-radius: 6px; padding: 10px; font-family: monospace; font-size: 12px; resize: none; background: #fff; box-sizing: border-box; cursor: pointer; }
        .btn-action { width: 100%; padding: 15px; background: #0866FF; color: #fff; border: none; border-radius: 8px; font-weight: bold; font-size: 16px; cursor: pointer; margin-bottom: 20px; }
        #toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: #333; color: #fff; padding: 10px 25px; border-radius: 30px; display: none; z-index: 999999; font-size: 14px; }
    `;
    document.head.appendChild(style);

    // 2. Struktur HTML
    const ui = document.createElement('div');
    ui.innerHTML = `
        <div id="floatBtn">🚀</div>
        <div id="grab-modal">
            <h2 style="text-align:center; color:#0866FF; margin-top:10px;">FB DATA EXTRACTOR</h2>
            <button class="btn-action" id="runFetch">AMBIL DATA SEKARANG</button>
            
            <div class="box-data">
                <label>Cookie (Full):</label>
                <textarea id="outCookie" readonly placeholder="Klik Ambil Data..."></textarea>
            </div>
            <div class="box-data">
                <label>Access Token (EAAG):</label>
                <textarea id="outEAAG" readonly placeholder="Wajib jalankan di business.facebook.com"></textarea>
            </div>
            <div style="padding: 10px; font-size: 16px;">
                <strong>Facebook ID:</strong> <span id="outUID" style="color:#0866FF;">-</span>
            </div>
        </div>
        <div id="toast">Disalin!</div>
    `;
    document.body.appendChild(ui);

    const modal = document.getElementById('grab-modal');
    const floatBtn = document.getElementById('floatBtn');
    const toast = document.getElementById('toast');

    floatBtn.onclick = () => modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';

    function showToast(msg) {
        toast.innerText = msg;
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 2000);
    }

    // 3. Logika Ekstraksi Data
    document.getElementById('runFetch').onclick = function() {
        // Ambil Cookie dan UID
        const cookieData = document.cookie;
        const uidMatch = cookieData.match(/c_user=(\d+)/);
        const uid = uidMatch ? uidMatch[1] : "Gagal mengambil UID";
        
        document.getElementById('outCookie').value = cookieData;
        document.getElementById('outUID').innerText = uid;

        // Ambil Token EAAG dari Source Code
        const htmlSource = document.documentElement.innerHTML;
        const eaagMatch = htmlSource.match(/(EAAG[a-zA-Z0-9]+)/);
        
        if (eaagMatch) {
            document.getElementById('outEAAG').value = eaagMatch[1];
            showToast("Data Berhasil Diperbarui");
        } else {
            document.getElementById('outEAAG').value = "Gagal: Buka tab business.facebook.com terlebih dahulu.";
            showToast("Token Tidak Ditemukan");
        }
    };

    // Fungsi Klik untuk Copy otomatis
    ['outCookie', 'outEAAG'].forEach(id => {
        const area = document.getElementById(id);
        area.onclick = function() {
            if (!this.value || this.value.includes("Gagal")) return;
            this.select();
            document.execCommand('copy');
            showToast("📋 Berhasil Disalin ke Clipboard");
        };
    });
})();
