function stt(audioBlob) {
  // Create a FormData object and append the audioBlob to it
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio.ogg"); // Use audioFile as the field name

  // Send the FormData object with the audioBlob in the request body
  fetch("http://192.168.54.19:8000/stt/", {
    method: "POST",
    body: formData,
  })
    .then(async (res) => {
      try {
        if (!res.ok) {
          throw new Error("Failed to receive data from API");
        }
        const text = await res.json();
        document.getElementById("result").innerText = text["text"];
        console.log(text["text"]);
      } catch {
        console.log("huita");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const startBtn = document.getElementById("startRecordingButton");
const stopBtn = document.getElementById("stopRecordingButton");
navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(function (stream) {
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    startBtn.addEventListener("click", function () {
      mediaRecorder.start();
      startBtn.style.display = "none";
      stopBtn.style.display = "block";
      console.log("Recording started.");
    });

    stopBtn.addEventListener("click", function () {
      mediaRecorder.stop();
      startBtn.style.display = "block";
      stopBtn.style.display = "none";
      console.log("Recording stopped.");
    });

    mediaRecorder.ondataavailable = function (event) {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = function () {
      // Create a Blob object from the collected audio chunks
      const audioBlob = new Blob(audioChunks, {
        type: "audio/ogg", // Use audio/ogg for .ogg files
      });
      const audioURL = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioURL);
      audio.controls = true;
      const existingAudio = document.querySelector(".audio");
      if (existingAudio) {
        existingAudio.parentNode.removeChild(existingAudio);
      }
      document.querySelector(".btn_container").appendChild(audio);
      audio.className = "audio";
      // Pass the audioBlob to the stt function for further processing
      stt(audioBlob);

      // Clear audioChunks for next recording
      audioChunks.length = 0;
    };
  })
  .catch(function (err) {
    if (err.name === "NotAllowedError") {
      console.log(
        "User denied microphone access. Please grant permission to record audio."
      );
      // You might want to display a user-friendly message or UI element here
    } else {
      console.error("The following getUserMedia error occurred:", err);
    }
  });
