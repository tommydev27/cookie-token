(function() {
    const style = document.createElement('style');
    style.textContent = `
        #fb-grab-wrap { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #fff; z-index: 999999; padding: 20px; box-sizing: border-box; font-family: sans-serif; overflow-y: auto; }
        .input-group { margin-bottom: 15px; }
        label { display: block; font-weight: bold; margin-bottom: 5px; font-size: 14px; color: #333; }
        textarea { width: 100%; height: 100px; border: 1px solid #ccc; border-radius: 4px; padding: 8px; font-family: monospace; font-size: 12px; background: #f9f9f9; resize: none; box-sizing: border-box; }
        .btn-fetch { width: 100%; padding: 12px; background: #0866FF; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; margin-bottom: 20px; font-size: 16px; }
        #notif-toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #333; color: #fff; padding: 10px 20px; border-radius: 5px; display: none; }
    `;
    document.head.appendChild(style);

    const ui = document.createElement('div');
    ui.id = 'fb-grab-wrap';
    ui.innerHTML = `
        <button class="btn-fetch" id="grabAction">FETCH DATA SEKARANG</button>
        <div class="input-group">
            <label>Cookie :</label>
            <textarea id="outCookie" readonly></textarea>
        </div>
        <div class="input-group">
            <label>Token EAAG :</label>
            <textarea id="outEAAG" readonly></textarea>
        </div>
        <div class="input-group">
            <label>Token EAAB :</label>
            <textarea id="outEAAB" readonly></textarea>
        </div>
        <div style="font-weight:bold; margin-top:10px;">Facebook id : <span id="outUID"></span></div>
        <div id="notif-toast">Disalin!</div>
    `;
    document.body.appendChild(ui);

    function showToast() {
        const toast = document.getElementById('notif-toast');
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 1500);
    }

    document.getElementById('grabAction').onclick = function() {
        const cookie = document.cookie;
        const uid = cookie.match(/c_user=(\d+)/)?.[1] || "-";
        
        document.getElementById('outCookie').value = cookie;
        document.getElementById('outUID').innerText = uid;

        // Ambil Token langsung dari variabel global FB atau source
        const html = document.documentElement.innerHTML;
        const eaag = html.match(/(EAAG[a-zA-Z0-9]+)/)?.[1] || "Tidak ditemukan";
        const eaab = html.match(/(EAAB[a-zA-Z0-9]+)/)?.[1] || "Tidak ditemukan";

        document.getElementById('outEAAG').value = eaag;
        document.getElementById('outEAAB').value = eaab;
    };

    // Fitur klik untuk copy
    ['outCookie', 'outEAAG', 'outEAAB'].forEach(id => {
        document.getElementById(id).onclick = function() {
            this.select();
            document.execCommand('copy');
            showToast();
        };
    });
})();
