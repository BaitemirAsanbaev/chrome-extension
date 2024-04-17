async function stt(audioBlob) {
  const bearerToken =
    "e4b038f10b807136fe0c6dfa339a1bd576eca77dfc9cd2ee88a4a289c00e387688ae8b49055300bed5ffb735d18594772784c2e66840bb794c24fdf77ebac3d9";
  const formData = new FormData();
  formData.append("audio", audioBlob);
  try {
    const resp = await fetch("https://asr.ulut.kg/api/receive_data", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    if (!resp.ok) {
      throw new Error(`HTTP error! Status: ${resp.status}`);
    }

    const data = await resp.json(); // Extract JSON response data
    console.log(data); // Log the response data

    console.log({
      headers: {
        Authorization: "Bearer " + bearerToken,
      },
    });
  } catch (error) {
    console.error("Error:", error); // Log the actual error
  }
}

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(function (stream) {
    // Create a MediaRecorder instance
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    // Start recording when the user clicks a button
    document
      .getElementById("startRecordingButton")
      .addEventListener("click", function () {
        mediaRecorder.start();
        console.log("Recording started.");
      });

    // Stop recording when the user clicks a button
    document
      .getElementById("stopRecordingButton")
      .addEventListener("click", function () {
        mediaRecorder.stop();
        console.log("Recording stopped.");
      });

    // Save the recorded audio when the MediaRecorder has data available
    mediaRecorder.ondataavailable = function (event) {
      audioChunks.push(event.data);
    };

    // When recording is stopped, create a new Blob and play the recorded audio
    mediaRecorder.onstop = function () {
      const audioBlob = new Blob(audioChunks, { type: "audio/ogg; codecs=opus" });
      const audioURL = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioURL);
      audio.controls = true;
      document.body.appendChild(audio);

      // Pass the audioBlob to the STT function
      stt(audioBlob);
    };
  })
  .catch(function (err) {
    if (err.name === "NotAllowedError") {
      // Handle permission denied error
      console.log(
        "User denied microphone access. Please grant permission to record audio."
      );
      // Display a message to the user informing them about the permission issue
      // Provide an option for the user to retry accessing the microphone
    } else {
      // Handle other errors
      console.log("The following getUserMedia error occurred: " + err);
    }
  });
