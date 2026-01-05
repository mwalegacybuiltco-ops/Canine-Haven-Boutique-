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

function route(){
  saveRefFromUrl();
  const { path, params } = parseHash();
  view.innerHTML = render(path, params);
  afterRender(path);

  // affiliate-only visibility
  const role = localStorage.getItem("role") || "customer";
  const affiliateMenu = document.getElementById("affiliateMenu");
  if (affiliateMenu) affiliateMenu.style.display = role === "affiliate" ? "" : "none";
}

// FORCE LOGIN FIRST
if (!location.hash || location.hash === "#/" || location.hash === "#") {
  location.hash = "#/login";
}

window.addEventListener("hashchange", route);
route();


window.addEventListener("hashchange", route);
route();

