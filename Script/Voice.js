const DATA = {
    text: "In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros."
}

$.ajax({
    type: "POST",
    url: '/audio',
    data: DATA,
    success: (data) => {
        
    }
})

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient();
const audio = await elevenlabs
  .textToSpeech.convert("NOpBlnGInO9m6vDvFkFC", {
    text: "In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. [sarcastically] Not the “burn it all down” kind... [giggles] but he was gentle, wise, with eyes like old stars. [whispers] Even the birds fell silent when he passed.",
    modelId: "eleven_v3",
    languageCode: "en",
  });