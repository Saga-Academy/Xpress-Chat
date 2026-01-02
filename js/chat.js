import { db, ref, push, onChildAdded, runTransaction }
from "./firebase.js";

const user=localStorage.getItem("user");
const avatar=localStorage.getItem("avatar");
const room=localStorage.getItem("room");
document.getElementById("roomName").innerText=room;

const msgRef=ref(db,"rooms/"+room);
const box=document.getElementById("messages");
const input=document.getElementById("msg");

let replyTo=null;

window.send=()=>{
  if(!input.value)return;
  push(msgRef,{
    user,
    avatar,
    text:input.value,
    replyTo,
    time:Date.now()
  });
  replyTo=null;
  replyBox.hidden=true;
  input.value="";
};

onChildAdded(msgRef,s=>{
  const m=s.val(),id=s.key;
  const d=document.createElement("div");
  d.className="msg "+(m.user===user?"me":"other");

  d.innerHTML=`
    <img src="${m.avatar}">
    <div>
      ${m.replyTo?"<small>Reply</small><br>":""}
      ${m.text}
      <div class="reactions"></div>
    </div>`;

  d.ontouchstart=()=>setTimeout(()=>menu(id,m.text),600);

  if(m.reactions){
    for(let e in m.reactions){
      d.querySelector(".reactions")
      .innerHTML+=`<span>${e} ${m.reactions[e]}</span>`;
    }
  }

  box.appendChild(d);
  box.scrollTop=box.scrollHeight;
});

function menu(id,text){
  if(confirm("Reply?")) reply(id,text);
  if(confirm("React ❤️")) react(id,"❤️");
}

function reply(id,text){
  replyTo=id;
  replyBox.hidden=false;
  replyText.innerText=text;
}

window.cancelReply=()=>replyBox.hidden=true;

function react(id,e){
  runTransaction(ref(db,`rooms/${room}/${id}/reactions/${e}`),
    v=>(v||0)+1);
}
