import { auth, RecaptchaVerifier, signInWithPhoneNumber, db, ref, set }
from "./firebase.js";

let confirmation;

window.recaptchaVerifier = new RecaptchaVerifier(
  "recaptcha",{size:"invisible"},auth
);

window.sendOTP = () => {
  const phone = phoneInput.value;
  signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
  .then(r => { confirmation=r; alert("OTP sent"); });
};

window.verifyOTP = () => {
  confirmation.confirm(otp.value).then(res=>{
    const avatar =
      avatarInput.value ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${phoneInput.value}`;

    localStorage.setItem("uid",res.user.uid);
    localStorage.setItem("user",phoneInput.value);
    localStorage.setItem("avatar",avatar);
    localStorage.setItem("room","general");

    set(ref(db,"users/"+res.user.uid),{
      user:phoneInput.value,
      avatar,
      online:true
    });

    location.href="index.html";
  });
};

const phoneInput=document.getElementById("phone");
const otp=document.getElementById("otp");
const avatarInput=document.getElementById("avatar");
