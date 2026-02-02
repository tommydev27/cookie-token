

(function() {
    // 1. Injeksi CSS Asli (Menggunakan VW)
    const style = document.createElement('style');
    style.textContent = `
        #floatBtn { 
            position: fixed; bottom: 10vw; right: 7vw; z-index: 2147483647; 
            width: 12vw; height: 12vw; background: #0866FF; 
            border-radius: 50%; display: flex; align-items: center; 
            justify-content: center; cursor: pointer; font-size: 7vw; 
            box-shadow: 0 3px 8px rgba(0,0,0,0.4); border: 0.4vw solid white; 
        }
        #guard-modal {
            position: fixed; top: 50%; left: 50%; 
            transform: translate(-50%, -50%); 
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
            color: #0bfa31; font-family: monospace; border: none; resize: none; margin-bottom: 2vw; 
        }
        .btn-main { 
            width: 100%; padding: 3vw; background: #0866FF; color: white; 
            border-radius: 2.5vw; border: none; font-weight: bold; font-size: 4vw; 
        }
        .tap:active { transform: scale(0.95); }
    `;
    document.head.appendChild(style);

    // 2. Struktur HTML Baru (Menyatu)
    const container = document.createElement('div');
    container.innerHTML = `
        <div id="floatBtn" class="tap">🛡️</div>
        <div id="guard-modal">
            <div style="text-align:center; margin-bottom:8vw; padding-top:5vw;">
                <h1 style="font-size:7vw; font-weight:900; color:rgb(60,60,60); margin:0;">
                    Cookie <span style="color:#0866FF;">Token</span>
                </h1>
            </div>

            <div class="section-box">
                <div class="section-title">🔑 Access Data</div>
                <button id="mGetAccess" class="btn-main tap">Fetch Data Access</button>
                
                <div id="contentAccess" style="display:none; margin-top:4vw;">
                    <label class="access-label">ID:</label>
                    <textarea id="resId" class="access-area" readonly placeholder="UID..."></textarea>
                    
                    <label class="access-label">COOKIE:</label>
                    <textarea id="resCookie" class="access-area" readonly placeholder="Full Cookie..."></textarea>
                    
                    <label class="access-label">TOKEN:</label>
                    <textarea id="resToken" class="access-area" readonly placeholder="fb_dtsg..."></textarea>
                </div>
            </div>

            <p id="mStatus" style="text-align:center; font-weight:bold; font-size:4vw; color:#888;">Notification</p>
        </div>
    `;
    document.body.appendChild(container);

    // 3. Logika JS (Akses Token & Cookie)
    const modal = document.getElementById('guard-modal');
    const floatBtn = document.getElementById('floatBtn');
    const status = document.getElementById('mStatus');

    floatBtn.onclick = () => {
        modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
    };

    document.getElementById('mGetAccess').onclick = () => {
        const uid = document.cookie.match(/c_user=(\d+)/)?.[1] || "Not Found";
        const dtsg = (document.getElementsByName("fb_dtsg")[0]?.value) || 
                     document.documentElement.innerHTML.match(/["']token["']\s*:\s*["']([^"']+)["']/)?.[1] || 
                     "Not Found";

        document.getElementById('resId').value = uid;
        document.getElementById('resToken').value = dtsg;
        document.getElementById('resCookie').value = document.cookie;

        document.getElementById('contentAccess').style.display = 'block';
        status.innerHTML = '<span style="color:#00df1f">Data Synced!</span>';
    };

    // Auto-Copy Function
    const copyText = (el) => {
        el.select();
        document.execCommand('copy');
        const oldText = status.innerHTML;
        status.innerHTML = '<span style="color:#0866FF">Copied!</span>';
        setTimeout(() => { status.innerHTML = oldText; }, 1500);
    };

    document.getElementById('resId').onclick = function() { copyText(this); };
    document.getElementById('resCookie').onclick = function() { copyText(this); };
    document.getElementById('resToken').onclick = function() { copyText(this); };

})();

