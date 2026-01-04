export const esc=(s)=>(s||"").toString().replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
export const money=(n,currency="CAD")=>Number(n||0).toLocaleString(undefined,{style:"currency",currency});
export function parseHash(){
  const raw=window.location.hash||"#/login";
  const [pathPart,queryPart]=raw.replace(/^#/,"").split("?");
  const path=pathPart||"/login";
  const params=new URLSearchParams(queryPart||"");
  return {path,params};
}
export function getRefFromHash(){ return parseHash().params.get("ref")||""; }
export function saveRefFromUrl(){ const r=getRefFromHash(); if(r) localStorage.setItem("ref", r); }
export function getSavedRef(){ return localStorage.getItem("ref")||""; }
export function setAffiliateCode(code){ localStorage.setItem("affiliateCode", code); }
export function getAffiliateCode(){ return localStorage.getItem("affiliateCode")||""; }
export function generateAffiliateCode(fullName=""){
  const base=(fullName||"AFFILIATE").trim().toUpperCase().replace(/[^A-Z0-9]+/g,"-").replace(/^-+|-+$/g,"");
  const short=(base.split("-")[0]||"AFFILIATE").slice(0,8);
  const rnd=Math.floor(1000+Math.random()*9000);
  return `CHB-${short}-${rnd}`;
}
export function copyText(txt){ return navigator.clipboard.writeText(txt); }
