const elevenlabsLib = require("@elevenlabs/elevenlabs-js");

const elevenlabsAPI = new elevenlabsLib.ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

async function make_audio(text) {
  const audio = await elevenlabsAPI.textToSpeech.convert("Xb7hH8MSUJpSbSDYk0k2", {
    text,
    modelId: "eleven_v3",
  });

  return elevenlabsLib.stream(audio);
}

module.exports = {
  make_audio,
};
