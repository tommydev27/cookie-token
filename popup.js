// 1. Fungsi Modal
function showModal(message, callback) {
    const modal = document.getElementById('customModal');
    modal.querySelector('p:nth-child(2)').textContent = message;
    modal.style.display = 'block';
    document.getElementById('btnOke').onclick = () => {
        modal.style.display = 'none';
        if (callback) callback();
    };
    document.getElementById('btnBatal').onclick = () => modal.style.display = 'none';
}

// 2. Fungsi Ambil Token (LOGIKA ORI: Handle Redirect & Clean Regex)
async function fetchToken(url, regex, targetId, name) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: "fetchFB", url: url }, (response) => {
            if (response && response.data) {
                const text = response.data;
                
                // Cek Redirect ala Ori
                if (text.includes("window.location.replace")) {
                    const redirectMatch = text.match(/replace\(\"(.*?)\"\)/);
                    if (redirectMatch) {
                        let nextUrl = redirectMatch[1].replace(/\\/g, "");
                        if (nextUrl.startsWith("/")) nextUrl = "https://business.facebook.com" + nextUrl;
                        return resolve(fetchToken(nextUrl, regex, targetId, name));
                    }
                }

                const match = text.match(regex) || text.match(/EAAG[a-zA-Z0-9]+/gi) || text.match(/EAAB[a-zA-Z0-9]+/gi);
                const result = match ? match[0].replace(/[^a-zA-Z0-9]/g, "") : "";
                document.getElementById(targetId).value = result || `${name} tidak ditemukan.`;
                resolve(result);
            } else {
                document.getElementById(targetId).value = `Error ${name}`;
                resolve("");
            }
        });
    });
}

// 3. Tombol Utama Get Data
document.getElementById('btnGetAccessToken').addEventListener('click', async () => {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab || !tab.url.includes("facebook.com")) {
            showModal("Buka tab Facebook dulu!", null);
            loading.style.display = 'none';
            return;
        }

        // Ambil Cookie & ID (Logika m() di Ori)
        chrome.cookies.getAll({ domain: "facebook.com" }, (cookies) => {
            const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
            document.getElementById('cookieResult').value = cookieStr;
            const cUser = cookies.find(c => c.name === "c_user");
            if (cUser) document.getElementById('fb_id').innerText = "ID: " + cUser.value;
        });

        // Ambil EAAG & EAAB secara paralel (Logika d() di Ori)
        await Promise.all([
            fetchToken("https://business.facebook.com/content_management", /EAAGNO[a-zA-Z0-9]+|EAAG[a-zA-Z0-9]+/, 'tokenResult', 'EAAG'),
            fetchToken("https://adsmanager.facebook.com/adsmanager/manage/campaigns", /EAAB[a-zA-Z0-9]+/, 'tokenResult2', 'EAAB')
        ]);

    } catch (err) {
        console.error(err);
    } finally {
        loading.style.display = 'none';
    }
});

// 4. Copy & Download (Logika standar modif kamu)
const setupCopy = (btnId, targetId) => {
    document.getElementById(btnId).onclick = () => {
        const el = document.getElementById(targetId);
        el.select();
        document.execCommand('copy');
        const btn = document.getElementById(btnId);
        btn.innerText = "✓ Copied!";
        setTimeout(() => btn.innerText = "Copy", 1500);
    };
};
setupCopy('copyCookie', 'cookieResult');
setupCopy('copyEAAG', 'tokenResult');
setupCopy('copyEAAB', 'tokenResult2');

document.getElementById('btnDownload').addEventListener('click', () => {
    const content = `DATA FACEBOOK\n${document.getElementById('fb_id').innerText}\n\nCOOKIE:\n${document.getElementById('cookieResult').value}\n\nEAAG:\n${document.getElementById('tokenResult').value}\n\nEAAB:\n${document.getElementById('tokenResult2').value}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FB_Data_${Date.now()}.txt`;
    a.click();
});

// 5. Logout (Logika b() di Ori)
document.getElementById('btncookielogout').addEventListener('click', () => {
    showModal("Logout dan bersihkan cookie?", () => {
        chrome.cookies.getAll({ domain: "facebook.com" }, (cookies) => {
            cookies.forEach(c => {
                chrome.cookies.remove({ url: "https://www.facebook.com", name: c.name });
            });
            chrome.tabs.create({ url: 'https://www.facebook.com/login' });
        });
    });
});
