# 🛡️ FraudShield

**Check it before you tap.** FraudShield is a scam-message explainer built for India. Upload a screenshot, or paste the text, of a suspicious SMS, WhatsApp message or email. An AI reads it, shows a colour-coded danger flag, explains the tricks in plain words, and **speaks the explanation aloud in a natural voice** in English, Hinglish or Hindi.

> Built for a college hackathon (ElevenLabs track). It is an educational project. Results come from an AI and can be wrong. See [Disclaimer](#disclaimer).

## Why a voice?

Many scam victims are elderly people or first-time smartphone users who find long English messages hard to read. FraudShield tells them in their own language, out loud: what the scammer is trying to do, and what to do next.

## How ElevenLabs is used

- Every speaker icon (each explanation point, the steps, the rule to remember, and "Listen to everything") calls **ElevenLabs text-to-speech** through `netlify/functions/speak.js` (served by `server.js`).
- The model is `eleven_flash_v2_5` (fast and low-cost, supports Hindi). The voice and model can be changed with environment variables.
- Short lines are grouped into larger pieces for a smoother voice, the next piece is pre-loaded while one plays, and audio is cached in the browser so replaying costs **no** extra credits.
- The ElevenLabs key stays on the server. It is never sent to the browser.
- If ElevenLabs is unavailable (no key, no credits, network), the page falls back to the device's own voice and shows a short notice.

## Features

- **Two ways to check**: upload or paste a **screenshot**, or use the **Paste Text** tab to paste the message itself.
- **Real AI analysis**: Google Gemini (free tier) reads the message and returns a danger score, the suspicious lines, an explanation and next steps.
- **Danger flag system**: every result gets a score out of 100 and a colour-coded flag:

  | Score | Flag | Meaning |
  |---|---|---|
  | 0–25 | 🟢 Green | Looks safe |
  | 26–50 | 🟡 Yellow | Be careful, verify first |
  | 51–75 | 🟠 Orange | High risk |
  | 76–100 | 🔴 Red | Scam alert |

- **Voice by ElevenLabs**: listen to the whole explanation or any single part.
- **Explains the psychology**: points out the exact lines that carry fake urgency, fake authority, fake links, greed bait and so on.
- **3 languages**: English, Hinglish and हिन्दी. The choice is remembered. The AI answers in one language and translates others only when you switch (saves free quota).
- **Try-it demos**: four ready-made examples, one per flag level. They run in your browser and do not use the AI.
- **Common scams library**: India-style sample scams (bank KYC/APK, courier fee, fake job, Prime renewal, fake Windows popup, electricity SMS) with filter tabs.
- **Emergency steps** and **What NOT to do** after a scam (call **1930**, report on **cybercrime.gov.in**, **Sanchar Saathi**).
- **Privacy** and **Terms** pop-ups.
- **Clear errors**: rate limit, timeout, "not a message", server not set up, each with a Retry button. A fake result is never shown as real.

## How it works

```
Browser (index.html, js/app.js, js/ai.js)
   │ screenshot (compressed) or pasted text            │ explanation text
   ▼                                                   ▼
/.netlify/functions/analyze                     /.netlify/functions/speak
(holds GEMINI_API_KEY)                          (holds ELEVENLABS_API_KEY)
   │                                                   │
   ▼                                                   ▼
Google Gemini  → JSON result → result card      ElevenLabs TTS → mp3 → played in browser
```

Both functions are run by `server.js` on **Render**. (The folder is called `netlify/functions` and the URLs start with `/.netlify/functions/` only because of the file layout; nothing needs Netlify.) The keys live only in Render's environment variables, never in the browser or this repository.

## Setup

### 1. Get the keys

- **Gemini**: <https://aistudio.google.com/apikey> → *Create API key*. Do **not** enable billing.
- **ElevenLabs**: elevenlabs.io → *Profile → API keys* → *Create key*. Give it **Text to Speech: Access** (and optionally **Voices: Read** to list voices). Everything else can stay on "No Access". Keep "Auto-disable if leaked" on and "Restrict by IP" off.

Copy each key immediately (it is shown only once) and paste it only into Render's environment variables.

### 2. Put this folder on GitHub

The `.gitignore` keeps `.env` out. Never paste a key into any file in the repo.

### 3. Deploy on Render

`server.js` is a tiny Node server (no packages) that serves the site and runs the same two functions. Create a **New Web Service** from your GitHub repo:

| Field | Value |
|---|---|
| Language | Node |
| Branch | main |
| Root Directory | (leave empty) |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance type | Free |
| Health Check Path | `/healthz` |

Under **Environment Variables** add the ones in the table below (also set `AI_TIMEOUT_MS=25000`; Render has no 10-second function limit), then click **Deploy web service**. After changing a variable, Render redeploys automatically.

On Render's free plan the service **sleeps after about 15 minutes without visitors** and takes up to a minute to wake. Open the site once before a demo.

### Environment variables

| Name | Required | What it does |
|---|---|---|
| `GEMINI_API_KEY` | yes | Your Gemini key |
| `ELEVENLABS_API_KEY` | yes, for the AI voice | Your ElevenLabs key |
| `ELEVEN_VOICE_ID` | no | Which voice to use (see [Change the voice](#change-the-voice)) |
| `ELEVEN_MODEL` | no | Default `eleven_flash_v2_5`. Use `eleven_multilingual_v2` for higher quality (uses more credits) |
| `GEMINI_MODEL` | no | Default `gemini-flash-lite-latest` |
| `AI_TIMEOUT_MS` | no | Max wait for Gemini. Default `9500`; use `25000` on Render |
| `MOCK_MODE` | no | `1` returns a clearly labelled **fake** analysis, to test the setup without a key. Remove afterwards |
| `ALLOWED_ORIGIN` | no | Which website may call the functions. Default `*` |

See `.env.example`. Use a local `.env` only for testing, and never upload it.

### 4. Check that it works

Replace `YOUR-SITE` with your site address:

- `https://YOUR-SITE/.netlify/functions/analyze?health=1` → should show `"keySet":true`
- `https://YOUR-SITE/.netlify/functions/speak?health=1` → should show `"keySet":true`
- Open the site, check a message, then press a speaker icon.

Other helper links: `analyze?models=1` lists Gemini models your key can use; `speak?voices=1` lists the ElevenLabs voices on your account.

## Change the voice

1. Find a voice ID: open `https://YOUR-SITE/.netlify/functions/speak?voices=1`, or in elevenlabs.io open **Voices**, add one to *My Voices* and choose **Copy Voice ID**. For Hindi and Hinglish pick a multilingual voice and listen first.
2. Add the environment variable `ELEVEN_VOICE_ID` with that ID in Render (*Environment* tab → *Add Environment Variable* → Save).
3. Open `.../speak?health=1`; the `voice` field should show the new ID.

Some library voices are not available through the API on the free ElevenLabs plan. If a voice stays silent (the site then uses the device voice), choose one from *My Voices* or a built-in voice.

## If something goes wrong

| Message on the site | What to do |
|---|---|
| "AI server is not set up on this website" | You opened the site from a file or GitHub Pages. Use your Render address (`...onrender.com`). |
| "missing API key" / "key is not working" | Check `GEMINI_API_KEY` in Render's *Environment* tab and save (Render redeploys). |
| "model name is wrong" | Open `analyze?models=1`, pick a name, set it as `GEMINI_MODEL` in Render. |
| "took too long" | Retry or use a smaller screenshot. Make sure `AI_TIMEOUT_MS=25000` is set. If the site was asleep, the first check can be slow. |
| "Too many checks" | Free Gemini limit reached. Wait a minute. |
| "does not look like a message" | The image was not a message or chat. Upload the message screenshot. |
| "AI voice is not available right now" | ElevenLabs key missing, wrong permission (needs *Text to Speech*), or out of credits. The device voice is used instead. |

## Run it locally

```bash
cp .env.example .env                  # put your keys inside .env (never upload it)
node --env-file=.env server.js        # needs Node 20.6 or newer; opens http://localhost:10000
```

On an older Node, or on Windows PowerShell, set the keys for one session instead:
`$env:GEMINI_API_KEY="..."; $env:ELEVENLABS_API_KEY="..."; node server.js`

## Project structure

```
fraudshield/
├── index.html                  # page markup
├── server.js                   # tiny Node server (used on Render / locally)
├── package.json                # tells Render how to start
├── .env.example                # example settings
├── .gitignore                  # keeps .env and keys out of GitHub
├── netlify/functions/
│   ├── analyze.js              # Gemini: reads the message, scores it, validates the answer
│   └── speak.js                # ElevenLabs: text in, voice (mp3) out
├── css/style.css               # custom styles
└── js/
    ├── tailwind-config.js      # Tailwind theme
    ├── data/
    │   ├── demos.js            # 4 demo messages + danger-score flags
    │   ├── scams.js            # Common Scams cards
    │   └── legal.js            # Privacy and Terms text
    ├── i18n.js                 # English / Hinglish / Hindi text
    ├── ai.js                   # browser side: shrinks image, calls analyze
    └── app.js                  # tabs, language, voice playback, results, pop-ups
```

Where to change things:
- Demo messages and flag colours: `js/data/demos.js`
- Scam cards: `js/data/scams.js`
- How the AI judges messages (prompt and scoring rules): `RUBRIC` in `netlify/functions/analyze.js`
- Voice settings (stability, speed): `voice_settings` in `netlify/functions/speak.js`
- Translations: `js/i18n.js`
- Site colours and fonts: `js/tailwind-config.js`

## Tech stack

Plain HTML, CSS and JavaScript (no build step) · [Tailwind CSS](https://tailwindcss.com) via CDN · Node (`server.js`) · Google Gemini API · ElevenLabs text-to-speech API.

## Privacy and honest notes

- Uploaded screenshots and pasted text are sent to Google's Gemini AI to be read. This site does not store them. On Google's **free** tier, inputs may be used to improve Google products and may be reviewed by people, so **hide card numbers, OTPs and personal details before uploading or pasting**.
- When you press a speaker icon, the explanation text (written by the AI) is sent to ElevenLabs to create the audio.
- The demo buttons never leave your browser, except that listening to them also uses ElevenLabs.
- AI can be wrong. A "Safe" result is not a guarantee. Test with many real messages before relying on it.
- Free plans have limits (Gemini requests, ElevenLabs credits, Render free instance). When they run out the site shows an error or uses the device voice instead of charging you.
- The device-voice fallback depends on voices installed on the device. Some devices have no Hindi voice.

## If you are scammed in India

- Call the Cyber Crime Helpline **1930** immediately. The first hour matters most.
- Report at [cybercrime.gov.in](https://cybercrime.gov.in).
- Report spam calls and SMS at [Sanchar Saathi](https://sancharsaathi.gov.in).

## Disclaimer

FraudShield is an educational project. Results are generated by AI and may be wrong. Always confirm with your bank's official app or the number printed on your card. It is not legal or financial advice.
