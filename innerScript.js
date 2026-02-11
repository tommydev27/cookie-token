
    // 1. Tombol Melayang
const floatBtn = document.createElement('div');
floatBtn.id = "fb-root-btn";
floatBtn.innerHTML = `<img src="${chrome.runtime.getURL('images/icon.png')}" style="width:100%; height:100%; object-fit:cover; display:block;">`;

floatBtn.style.cssText = `
    position: fixed;
    bottom: 5vh;
    right: 5vw;
    width: 14vw; 
    height: 14vw;
    z-index: 2147483647;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 1vw 4vw rgba(0,0,0,0.3);
border: 1vw solid white;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
    /* Penghilang efek highlight/biru saat diklik di HP */
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    touch-action: manipulation;
`;
document.body.appendChild(floatBtn);

// 2. Iframe Panel
const panel = document.createElement('iframe');
panel.src = chrome.runtime.getURL('popup.html');
panel.style.cssText = `
    position: fixed;
    bottom: 2vh;
    width: 95vw; 
    height: 95vh;
    z-index: 2147483646;
    border: none;
    border-radius: 5vw;
    box-shadow: 0 2vw 10vw rgba(0,0,0,0.5);
    display: none;
    background: white;
    transition: all 0.3s ease;
    -webkit-tap-highlight-color: transparent;
`;
document.body.appendChild(panel);

// 3. Kontrol Buka/Tutup
floatBtn.onclick = (e) => {
    e.preventDefault();
    const isHidden = panel.style.display === "none";
    panel.style.display = isHidden ? "block" : "none";
    floatBtn.style.transform = isHidden ? "scale(0.9)" : "scale(1)";
};
