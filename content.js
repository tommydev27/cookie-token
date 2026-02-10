(function() {
    const style = document.createElement('style');
    style.textContent = `
        #fixed-ui { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #f0f2f5; z-index: 999999; padding: 20px; font-family: sans-serif; overflow-y: auto; }
        .card { background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 15px; }
        label { font-weight: bold; display: block; margin-bottom: 5px; color: #1c1e21; }
        textarea { width: 100%; height: 80px; border: 1px solid #ddd; border-radius: 5px; padding: 10px; font-family: monospace; font-size: 12px; resize: none; background: #fafafa; }
        .btn-blue { width: 100%; padding: 15px; background: #0866FF; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 16px; margin-bottom: 20px; }
    `;
    document.head.appendChild(style);

    const ui = document.createElement('div');
    ui.id = 'fixed-ui';
    ui.innerHTML = `
        <h2 style="text-align:center;">FB DATA GRABBER PRO</h2>
        <button class="btn-blue" id="startGrab">FETCH DATA SEKARANG</button>
        <div class="card">
            <label>Cookie :</label>
            <textarea id="c" readonly></textarea>
        </div>
        <div class="card">
            <label>Token (EAAG) :</label>
            <textarea id="tg" readonly placeholder="Menunggu..."></textarea>
        </div>
        <div class="card">
            <label>Token (EAAB) :</label>
            <textarea id="tb" readonly placeholder="Menunggu..."></textarea>
        </div>
        <p><b>Facebook ID:</b> <span id="uid" style="color:#0866FF;">-</span></p>
    `;
    document.body.appendChild(ui);

    document.getElementById('startGrab').onclick = async function() {
        this.innerText = "SABAR, LAGI NARIK...";
        const cookie = document.cookie;
        const uid = cookie.match(/c_user=(\d+)/)?.[1] || "Gagal";
        document.getElementById('c').value = cookie;
        document.getElementById('uid').innerText = uid;

        // JALUR EAAG (Business Suite)
        try {
            const rG = await fetch('https://business.facebook.com/business_locations');
            const tG = await rG.text();
            const eaag = tG.match(/(EAAG\w+)/)?.[1] || "EAAG Gagal (Buka business.facebook.com dulu)";
            document.getElementById('tg').value = eaag;
        } catch(e) { document.getElementById('tg').value = "Error CORS"; }

        // JALUR EAAB (Ads Manager)
        try {
            const rB = await fetch('https://www.facebook.com/adsmanager/manage/campaigns');
            const tB = await rB.text();
            const eaab = tB.match(/(EAAB\w+)/)?.[1] || "EAAB Tidak ditemukan";
            document.getElementById('tb').value = eaab;
        } catch(e) { document.getElementById('tb').value = "Error CORS"; }

        this.innerText = "FETCH DATA SEKARANG";
    };

    // Klik langsung copy
    ['c', 'tg', 'tb'].forEach(id => {
        document.getElementById(id).onclick = function() {
            this.select();
            document.execCommand('copy');
            alert('Copied!');
        };
    });
})();
