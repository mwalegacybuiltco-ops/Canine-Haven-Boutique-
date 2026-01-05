import { parseHash, saveRefFromUrl } from "./utils.js";
import { render, afterRender } from "./views.js";

const view = document.getElementById("view");
const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("backdrop");
const menuBtn = document.getElementById("menuBtn");
const closeMenuBtn = document.getElementById("closeMenuBtn");

function closeSidebar(){
  sidebar?.classList.remove("open");
  backdrop?.classList.add("hidden");
}
function openSidebar(){
  sidebar?.classList.add("open");
  backdrop?.classList.remove("hidden");
}

menuBtn?.addEventListener("click", openSidebar);
closeMenuBtn?.addEventListener("click", closeSidebar);
backdrop?.addEventListener("click", closeSidebar);
document.querySelectorAll(".sidelink").forEach(a=> a.addEventListener("click", closeSidebar));

let deferredPrompt = null;
const installBtn = document.getElementById("installBtn");
window.addEventListener("beforeinstallprompt", (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  installBtn?.classList.remove("hidden");
});
installBtn?.addEventListener("click", async ()=>{
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn?.classList.add("hidden");
});

if ("serviceWorker" in navigator){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  });
}

function route(){
  saveRefFromUrl();
  const { path, params } = parseHash();
  view.innerHTML = render(path, params);
  afterRender(path);
}

/** ✅ FORCE LOGIN FIRST **/
if (!location.hash || location.hash === "#/" || location.hash === "#") {
  location.hash = "#/login";
}

window.addEventListener("hashchange", route);
route();
