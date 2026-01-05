import { CONFIG } from "./config.js";
import { PRODUCTS } from "./products.js";
import { esc, money, parseHash, saveRefFromUrl, getSavedRef, generateAffiliateCode, setAffiliateCode, getAffiliateCode, copyText } from "./utils.js";

function heroCard(){
  return `
  <div class="card">
    <div class="row spread">
      <div>
        <div class="badge">🐾 Canine Haven Boutique</div>
        <div class="h1" style="margin-top:10px">Premium dog couture, custom logo drops, and a simple affiliate system.</div>
        <div class="p">Square checkout links for purchases. Affiliates share their app link and earn commissions with clean tracking.</div>
        <div class="pills" style="margin-top:10px">
          <span class="pill">Gold • Black • Purple</span>
          <span class="pill">Installable PWA</span>
          <span class="pill">Powered by LegacyBuilt Tech</span>
        </div>
      </div>
    </div>
    <div style="margin-top:12px" class="iframeWrap">
     <img src="./assets/hero-malinois.png" alt="Belgian Malinois" style="width:100%;height:auto;display:block">
    </div>
  </div>`;
}

function productCard(p){
  const squareOk = (p.squareLink||"").startsWith("http");
  const storeOk  = (p.storeLink||"").startsWith("http");
  return `
  <div class="card product">
    <img src="${esc(p.image||"")}" alt="${esc(p.name)}">
    <div class="row spread" style="margin-top:10px">
      <div class="h2">${esc(p.emoji||"🐾")} ${esc(p.name)}</div>
      <div class="price">${money(p.price, CONFIG.currency)}</div>
    </div>
    <div class="p">${esc(p.description||"")}</div>
    <div class="pills" style="margin-top:10px">
      <span class="pill">${esc(p.category||"")}</span>
      <span class="pill">Square checkout</span>
    </div>
    <div class="row" style="margin-top:12px">
      <button class="btn btnGold" data-buy="${esc(p.id)}" ${squareOk ? "" : "disabled"}>Buy</button>
      <button class="ghost" data-view="${esc(p.id)}" ${storeOk ? "" : "disabled"}>View</button>
    </div>
    ${!squareOk ? `<div class="p" style="margin-top:10px;color:rgba(212,175,55,.85)">Admin: paste a Square payment link into <b>js/products.js</b> for this item.</div>` : ""}
  </div>`;
}

function shopView(params){
  const cat = params.get("cat") || "";
  const filtered = cat ? PRODUCTS.filter(p=> (p.category||"") === cat) : PRODUCTS;
  const title = cat ? `Shop: ${esc(cat)}` : "Shop: All products";
  return `
    ${heroCard()}
    <div class="card" style="margin-top:12px">
      <div class="row spread">
        <div class="h1">${title}</div>
        <a class="ghost" href="#/join">Join</a>
      </div>
      <div class="p">Tap <b>Buy</b> to open Square checkout in a secure tab (most stable method inside a PWA).</div>
    </div>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(230px,1fr));margin-top:12px">
      ${filtered.map(productCard).join("")}
    </div>
  `;
}

function loginView(){
  return `
    <div class="loginScreen">
      <div class="loginWrap">
        <img src="assets/login-screen.png" alt="Login" class="loginImg">

        <button class="hotspot hsCustomer" data-login="customer" aria-label="Customer"></button>
        <button class="hotspot hsAffiliate" data-login="affiliate" aria-label="Affiliate"></button>
        <button class="hotspot hsProducts" data-login="shop" aria-label="Products"></button>
      </div>
    </div>
  `;
}
function iframeEmbed(url){
  if (!url || !url.startsWith("http")){
    return `<div class="notice">Paste your Google Form embed <b>src</b> into <b>js/config.js</b> to show the form here.</div>`;
  }
  return `<div class="iframeWrap"><iframe src="${esc(url)}" loading="lazy"></iframe></div>`;
}

function joinView(){
  const ref = getSavedRef();
  return `
    <div class="card">
      <div class="row spread">
        <div class="h1">Join</div>
        <span class="badge">${ref ? `Referral detected: ${esc(ref)}` : "No referral detected"}</span>
      </div>
      <div class="p">Choose customer or affiliate. Forms submit to <b>your Google Sheets</b>.</div>
      <div class="row" style="margin-top:12px">
        <button class="btn" data-join="customer">I’m a Customer</button>
        <button class="btn btnGold" data-join="affiliate">I’m an Affiliate</button>
      </div>
      <hr>
      <div id="joinFormHost"></div>
    </div>
  `;
}

function starterPackView(){
  return `
    <div class="card">
      <div class="row spread">
        <div class="h1">Affiliate Starter Pack</div>
        <span class="badge">$140 activation</span>
      </div>
      <div class="pills" style="margin-top:10px">
        <span class="pill">Affiliate access + code</span>
        <span class="pill">Promo kit + prompts</span>
        <span class="pill">Catalog + link vault</span>
        <span class="pill">Support + payouts</span>
      </div>
      <div class="row" style="margin-top:12px">
        <button class="btn btnGold" data-pay-starter>Pay $140 Starter Pack</button>
        <a class="ghost" href="#/join">Open Affiliate Form</a>
      </div>
      <div class="p" style="margin-top:10px">Square payment links open in a secure tab and won’t break the PWA.</div>
    </div>
  `;
}

function affiliateView(){
  const myCode = getAffiliateCode();
  const ref = getSavedRef();
  return `
    <div class="card">
      <div class="row spread">
        <div class="h1">My Affiliate Link</div>
        <span class="badge">${myCode ? "Code saved" : "No code yet"}</span>
      </div>
      <div class="p">Generate your code once, then copy your app link and share it.</div>
      <label>Your name (for code generation)</label>
      <input class="input" id="affName" placeholder="Example: Jess Smith">
      <div class="row" style="margin-top:10px">
        <button class="btn" data-gen-code>Generate My Code</button>
        <button class="ghost" disabled title="Sponsor is stored automatically from ref link">Sponsor: ${esc(ref||"—")}</button>
      </div>
      <hr>
      <div class="card">
        <div class="row spread">
          <div class="h2" id="myCodeText">${esc(myCode || "—")}</div>
          <button class="ghost" data-copy-code ${myCode ? "" : "disabled"}>Copy</button>
        </div>
        <div class="p" style="margin-top:8px">Your App Share Link</div>
        <div class="row spread" style="gap:8px;margin-top:8px;flex-wrap:wrap">
          <div class="pill" id="myLinkText" style="max-width:100%;overflow-wrap:anywhere">${esc(myCode ? `${location.origin}${location.pathname}#/login?ref=${myCode}` : "—")}</div>
          <button class="btn btnGold" data-copy-link ${myCode ? "" : "disabled"}>Copy Link</button>
        </div>
      </div>
    </div>
  `;
}

function startHereView(){
  return `
    <div class="card">
      <div class="h1">Affiliate Start Here ✅</div>
      <div class="p">Clarity → conversations → commissions. No spam. No pressure.</div>
      <hr>
      <div class="grid">
        <div class="card"><div class="h2">1) Get your link</div><div class="p">Go to <b>My Link</b>, generate your code, and copy your app link.</div></div>
        <div class="card"><div class="h2">2) Post once</div><div class="p">Post your dog + one product. CTA: “Want the Canine Haven app link?”</div></div>
        <div class="card"><div class="h2">3) Start 5 conversations</div><div class="p">Ask: “Are you shopping for dog gear, or curious about earning too?”</div></div>
        <div class="card"><div class="h2">4) Build a team (optional)</div><div class="p">Share your link with someone who loves dogs. Their sponsor is tracked.</div></div>
      </div>
    </div>
  `;
}

function trainingView(){
  return `
    <div class="card">
      <div class="h1">Training 🎓</div>
      <div class="p">Branding, automation, sales, marketing, attraction marketing — taught in plain language.</div>
      <hr>
      <div class="grid">
        <div class="card"><div class="h2">Branding</div><div class="p">Branding is what people understand about you in 3 seconds. Keep it simple: dog life + boutique + link.</div><div class="p"><b>Prompt:</b> “I share Canine Haven because ____.”</div></div>
        <div class="card"><div class="h2">Automation</div><div class="p">Automation isn’t spam. It’s steps working without you babysitting them (app + links + forms + checkout).</div><div class="p"><b>Mantra:</b> “We don’t automate people. We automate steps.”</div></div>
        <div class="card"><div class="h2">Sales</div><div class="p">Sales = helping someone decide. Ask questions, then share the app link.</div></div>
        <div class="card"><div class="h2">Marketing</div><div class="p">Marketing = visibility. If your dog is in the post, it counts. Consistency beats perfection.</div></div>
        <div class="card"><div class="h2">Attraction Marketing</div><div class="p">Show up long enough that the right people ask. CTA: “Want the app link?”</div></div>
      </div>
    </div>
  `;
}

function fourCornersView(){
  return `
    <div class="card">
      <div class="h1">Four Corners 🧭</div>
      <div class="p">Your daily method to keep momentum without overwhelm.</div>
      <hr>
      <div class="grid">
        <div class="card"><div class="h2">1) Add new people</div><div class="p">5–10 a day: dog accounts, local pages, groups.</div></div>
        <div class="card"><div class="h2">2) Start conversations</div><div class="p">Reply to comments + DMs. Ask questions. Don’t pitch.</div></div>
        <div class="card"><div class="h2">3) Post with intention</div><div class="p">Dog + product + benefit + “Want the app link?”</div></div>
        <div class="card"><div class="h2">4) Engage like a human</div><div class="p">Thank people, react, celebrate wins, show up consistently.</div></div>
      </div>
    </div>
  `;
}

function teamView(){
  const myCode = getAffiliateCode();
  const myLink = myCode ? `${location.origin}${location.pathname}#/login?ref=${myCode}` : "";
  return `
    <div class="card">
      <div class="h1">Team Builder 🐺</div>
      <div class="p">If someone joins using your link, your sponsor code is captured and recorded in your sheet.</div>
      <hr>
      <div class="card">
        <div class="h2">Your recruit link</div>
        <div class="pill" style="margin-top:10px;overflow-wrap:anywhere">${esc(myLink || "Generate your code in My Link first.")}</div>
        <div class="row" style="margin-top:10px">
          <button class="btn btnGold" data-copy-team ${myCode ? "" : "disabled"}>Copy recruit link</button>
        </div>
      </div>
      <div class="card" style="margin-top:12px">
        <div class="h2">DM script</div>
        <div class="p">“Hey! I’m using the Canine Haven Boutique app for cute dog gear. I also earn commissions sharing it. Want the app link?”</div>
      </div>
    </div>
  `;
}

function payoutsView(){
  return `
    <div class="card">
      <div class="h1">Payouts 💰</div>
      <hr>
      <div class="grid">
        <div class="card"><div class="h2">Schedule</div><div class="p">Bi-weekly payouts (every other Friday).</div></div>
        <div class="card"><div class="h2">Minimum threshold</div><div class="p">$50 minimum. Under $50 rolls over automatically.</div></div>
        <div class="card"><div class="h2">How you get paid</div><div class="p">PayPal or e-transfer (based on the details you submit).</div></div>
        <div class="card"><div class="h2">Rule</div><div class="p">Payments must clear before commissions are paid. Accuracy > rushed payouts.</div></div>
      </div>
    </div>
  `;
}

function statsView(){
  const url = CONFIG.affiliateStatsUrl;
  return `
    <div class="card">
      <div class="row spread">
        <div class="h1">Stats 📊</div>
        <span class="badge">Read-only</span>
      </div>
      <div class="p">Open the stats page (Looker Studio or published sheet). Filter by your affiliate code.</div>
      <div class="row" style="margin-top:12px">
        <button class="btn btnGold" data-open-stats ${url && url.startsWith("http") ? "" : "disabled"}>View My Stats</button>
      </div>
      ${(!url || !url.startsWith("http")) ? `<div class="p" style="margin-top:10px;color:rgba(212,175,55,.85)">Admin: paste your stats link into <b>js/config.js</b>.</div>` : ""}
    </div>
  `;
}

function communityView(){
  const url = CONFIG.facebookGroupUrl;
  return `
    <div class="card">
      <div class="h1">Community 👥</div>
      <div class="p">Facebook is for support, wins, questions, and accountability. The app is your systems hub.</div>
      <div class="row" style="margin-top:12px">
        <button class="btn btnGold" data-open-group ${url && url.startsWith("http") ? "" : "disabled"}>Open Facebook Group</button>
      </div>
      ${(!url || !url.startsWith("http")) ? `<div class="p" style="margin-top:10px;color:rgba(212,175,55,.85)">Admin: paste your group link into <b>js/config.js</b>.</div>` : ""}
    </div>
  `;
}

export function render(path, params){
  saveRefFromUrl();
  switch(path){
    case "/login": return loginView();
    case "/shop": return shopView(params);
    case "/join": return joinView();
    case "/starterpack": return starterPackView();
    case "/affiliate": return affiliateView();
    case "/start-here": return startHereView();
    case "/training": return trainingView();
    case "/four-corners": return fourCornersView();
    case "/team": return teamView();
    case "/payouts": return payoutsView();
    case "/stats": return statsView();
    case "/community": return communityView();
    default: return shopView(params);
  }
}

export function afterRender(path){
  const topbar = document.getElementById("topbar");
  const footerEl = document.getElementById("footer");
  if (path === "/login"){
    topbar?.classList.add("hidden");
    footerEl?.classList.add("hidden");
  } else {
    topbar?.classList.remove("hidden");
    footerEl?.classList.remove("hidden");
  }

  document.querySelectorAll("[data-login]").forEach(el=>{
    el.addEventListener("click", ()=>{
      const mode = el.getAttribute("data-login");
      if (mode === "shop") location.hash = "#/shop";
      if (mode === "customer") location.hash = "#/join";
      if (mode === "affiliate") location.hash = "#/join";
    });
  });

  document.querySelectorAll("[data-join]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const which = btn.getAttribute("data-join");
      const host = document.getElementById("joinFormHost");
      if (!host) return;
      host.innerHTML = iframeEmbed(which === "customer" ? CONFIG.customerFormEmbedUrl : CONFIG.affiliateFormEmbedUrl);
      host.scrollIntoView({behavior:"smooth", block:"start"});
    });
  });

  document.querySelectorAll("[data-buy]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-buy");
      const p = PRODUCTS.find(x=>x.id===id);
      if (p?.squareLink?.startsWith("http")) window.open(p.squareLink, "_blank", "noopener,noreferrer");
    });
  });

  document.querySelectorAll("[data-view]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-view");
      const p = PRODUCTS.find(x=>x.id===id);
      if (p?.storeLink?.startsWith("http")) window.open(p.storeLink, "_blank", "noopener,noreferrer");
    });
  });

  document.querySelector("[data-pay-starter]")?.addEventListener("click", ()=>{
    const link = CONFIG.starterPackSquarePayLink;
    if (link && link.startsWith("http")) window.open(link, "_blank", "noopener,noreferrer");
    else alert("Admin: paste your starter pack Square payment link into js/config.js");
  });

  document.querySelector("[data-gen-code]")?.addEventListener("click", ()=>{
    const name = (document.getElementById("affName")?.value || "").trim();
    const code = generateAffiliateCode(name);
    setAffiliateCode(code);
    document.getElementById("myCodeText").textContent = code;
    document.getElementById("myLinkText").textContent = `${location.origin}${location.pathname}#/login?ref=${code}`;
    alert("Saved! Your affiliate code is now stored on this device.");
  });

  document.querySelector("[data-copy-code]")?.addEventListener("click", async ()=>{
    const code = getAffiliateCode();
    if (!code) return;
    await copyText(code);
    alert("Copied your affiliate code.");
  });

  document.querySelector("[data-copy-link]")?.addEventListener("click", async ()=>{
    const code = getAffiliateCode();
    if (!code) return;
    const link = `${location.origin}${location.pathname}#/login?ref=${code}`;
    await copyText(link);
    alert("Copied your app referral link.");
  });

  document.querySelector("[data-copy-team]")?.addEventListener("click", async ()=>{
    const code = getAffiliateCode();
    if (!code) return;
    const link = `${location.origin}${location.pathname}#/login?ref=${code}`;
    await copyText(link);
    alert("Copied your recruit link.");
  });

  document.querySelector("[data-open-stats]")?.addEventListener("click", ()=>{
    const url = CONFIG.affiliateStatsUrl;
    if (url && url.startsWith("http")) window.open(url, "_blank", "noopener,noreferrer");
  });

  document.querySelector("[data-open-group]")?.addEventListener("click", ()=>{
    const url = CONFIG.facebookGroupUrl;
    if (url && url.startsWith("http")) window.open(url, "_blank", "noopener,noreferrer");
  });
}
