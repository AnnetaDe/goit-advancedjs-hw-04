import{i as y,S as b}from"./assets/vendor-363aca01.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const n of t.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}})();const L=a=>{const s="3024031-50bf2ca6b1e9bc3513f045fb3",o=new URLSearchParams({key:s,q:a,image_type:"photo",orientation:"horizontal",safesearch:"true"});console.log(o.toString());const i=`https://pixabay.com/api/?${o.toString()}`;return console.log(i),fetch(i).then(e=>{if(!e.ok)throw new Error(e.status);return e.json()})},u=document.querySelector(".search-form"),c=document.querySelector(".picture-and-data-list"),l=document.querySelector(".loader"),v=a=>{a.preventDefault();const s=a.target.elements.picture_search.value.trim();if(s===""){c.innerHTML="",a.target.reset(),y.error({title:"Error",message:"Please enter a search query",position:"topCenter"});return}l.classList.add("is-visible"),L(s).finally(()=>{l.classList.remove("is-visible")}).then(o=>{const i=o.hits.map(r=>({linkWeb:r.webformatURL,linkBig:r.largeImageURL,tags:r.tags,likes:r.likes,views:r.views,comments:r.comments,downloads:r.downloads}));function e({linkWeb:r,linkBig:d,tags:m,likes:f,views:p,comments:h,downloads:g}){return`
   <li class="picture-and-data-item">
   <div class="img-container">
            <a  class="image-link" href="${d}"><img class="image" src="${r}" alt="${m}" />
            </div>
            <ul class="under-picture-list">
                <li class="under-picture-info-item">Likes <span class="data-received">${f}</span></li>
                <li class="under-picture-info-item">Views <span class="data-received">${p}</span></li>
                <li class="under-picture-info-item">Comments <span class="data-received">${h}</span></li>
                <li class="under-picture-info-item">Downloads <span class="data-received">${g}</span></li>
            </ul>
        </li> 
        </a>`}c.innerHTML="";const t=i.map(e).join("");c.insertAdjacentHTML("beforeend",t),u.reset(),new b(".image-link",{focus:!0,captionsData:"alt",captionDelay:250}).show()}).catch(o=>{console.log(o)})};u.addEventListener("submit",v);
//# sourceMappingURL=commonHelpers.js.map
