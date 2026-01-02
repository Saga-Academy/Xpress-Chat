import { auth, RecaptchaVerifier, signInWithPhoneNumber, db, ref, set } from "./firebase.js";

let confirmation;
const phoneInput = document.getElementById("phone");
const otpInput = document.getElementById("otp");
const avatarInput = document.getElementById("avatar");

window.recaptchaVerifier = new RecaptchaVerifier("recaptcha", { size: "invisible" }, auth);

window.sendOTP = () => {
  signInWithPhoneNumber(auth, phoneInput.value, window.recaptchaVerifier)
    .then(r => { confirmation = r; alert("Access Code Transmitted"); })
    .catch(err => alert("Transmission Failed: " + err.message));
};

window.verifyOTP = () => {
  confirmation.confirm(otpInput.value).then(res => {
    const avatar = avatarInput.value || `https://api.dicebear.com/7.x/bottts/svg?seed=${phoneInput.value}`;
    localStorage.setItem("uid", res.user.uid);
    localStorage.setItem("user", phoneInput.value);
    localStorage.setItem("avatar", avatar);
    set(ref(db, "users/" + res.user.uid), { user: phoneInput.value, avatar, online: true });
    location.href = "index.html";
  });
};
