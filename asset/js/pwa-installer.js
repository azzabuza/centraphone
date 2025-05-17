let deferredPrompt;

// GET EVEN PWA INSTALLATION
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const downloadButton = document.getElementById("downloadApp");
  const buttonIcon = document.getElementById("buttonIcon");
  const buttonText = document.getElementById("buttonText");

  // DEVICE DETECTION
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android/i.test(userAgent)) {
    buttonIcon.innerHTML = `<svg class="line" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="none" stroke="currentColor">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 3.71v16.58a.7 .7 0 0 0 1.05 .606l14.622 -8.42a.55 .55 0 0 0 0 -.953l-14.622 -8.419a.7 .7 0 0 0 -1.05 .607z" /><path d="M15 9l-10.5 11.5" /><path d="M4.5 3.5l10.5 11.5" />
</svg>`;
    buttonText.innerText = "Install for Android";
  } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    buttonIcon.innerHTML = `<svg class="line" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="none" stroke="currentColor">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8.286 7.008c-3.216 0 -4.286 3.23 -4.286 5.92c0 3.229 2.143 8.072 4.286 8.072c1.165 -.05 1.799 -.538 3.214 -.538c1.406 0 1.607 .538 3.214 .538s4.286 -3.229 4.286 -5.381c-.03 -.011 -2.649 -.434 -2.679 -3.23c-.02 -2.335 2.589 -3.179 2.679 -3.228c-1.096 -1.606 -3.162 -2.113 -3.75 -2.153c-1.535 -.12 -3.032 1.077 -3.75 1.077c-.729 0 -2.036 -1.077 -3.214 -1.077z" /><path d="M12 4a2 2 0 0 0 2 -2a2 2 0 0 0 -2 2" />
</svg>`;
    buttonText.innerText = "Install for iOS";
  } else {
    buttonIcon.innerHTML = `<svg class="line" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="none" stroke="currentColor">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10z" /><path d="M7 20h10" /><path d="M9 16v4" /><path d="M15 16v4" />
</svg>`;
    buttonText.innerText = "Install for Desktop";
  }

  // SHOW BUTTON
  downloadButton.style.display = "block";

  // CLICK TO INSTALLATION
  downloadButton.addEventListener("click", () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        console.log("User choice:", choiceResult.outcome);
        deferredPrompt = null;
      });
    }
  });
});
