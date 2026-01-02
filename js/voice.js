let recorder, audioChunks = [];

navigator.mediaDevices.getUserMedia({ audio:true }).then(stream=>{
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = e => audioChunks.push(e.data);

  recorder.onstop = () => {
    const blob = new Blob(audioChunks, { type:'audio/webm' });
    audioChunks = [];
    const url = URL.createObjectURL(blob);
    push(msgRef, { user, voice:url });
  };
});

recordBtn.onclick = () => recorder.start();
stopBtn.onclick = () => recorder.stop();
