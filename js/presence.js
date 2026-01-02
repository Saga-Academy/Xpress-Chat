import { db, ref, onValue, remove, set }
from "./firebase.js";

const uid=localStorage.getItem("uid");
const user=localStorage.getItem("user");
const avatar=localStorage.getItem("avatar");

const uRef=ref(db,"users/"+uid);

window.addEventListener("beforeunload",()=>{
  remove(uRef);
});

set(uRef,{user,avatar,online:true});

const list=document.getElementById("onlineUsers");
const count=document.getElementById("onlineCount");

onValue(ref(db,"users"),snap=>{
  list.innerHTML="";
  let c=0;
  snap.forEach(s=>{
    const u=s.val();
    if(u.online){
      c++;
      list.innerHTML+=`
        <div class="user">
          <img src="${u.avatar}">
          <div>${u.user.slice(-4)}</div>
        </div>`;
    }
  });
  count.innerText=`Online: ${c}`;
});
