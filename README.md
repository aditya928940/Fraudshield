# 🛡️ FraudShield

**Check it before you tap.** FraudShield is a scam-message explainer built for India. Upload a screenshot, or paste the text, of a suspicious SMS, WhatsApp message or email. An AI reads it and shows a colour-coded danger flag, explains the tricks the scammer is using in plain words, and tells you what to do next.

> Built as a college hackathon project for educational purposes. Results come from an AI and can be wrong. See [Disclaimer](#disclaimer).

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

- **Explains the psychology**: points out the exact lines that carry fake urgency, fake authority, fake links, greed bait and so on, in simple language.
- **Try-it demos**: four ready-made examples, one per flag level. They run in your browser and do not use the AI.
- **3 languages**: English, Hinglish and हिन्दी. The choice is remembered. The AI answers in one language and translates others only when you switch (saves the free quota).
- **Voice explanations**: a speaker icon next to each explanation reads it aloud (Web Speech API).
- **Common scams library**: India-style sample scams (bank KYC/APK, courier fee, fake job, Prime renewal, fake Windows popup, electricity SMS) with filter tabs.
- **Emergency steps** and **What NOT to do** after a scam (call **1930**, report on **cybercrime.gov.in**, **Sanchar Saathi**).
- **Privacy** and **Terms** pop-ups.
- **Clear errors**: rate limit, timeout, "not a message", server not set up, each with a Retry button. A fake result is never shown as real.

## How it works

```
Browser (index.html, js/app.js, js/ai.js)
        │  screenshot (compressed) or pasted text
        ▼
Netlify Function  netlify/functions/analyze.js   ← holds the secret GEMINI_API_KEY
        │
        ▼
Google Gemini API  →  JSON result  →  shown as the result card
```

The API key lives **only** on the server (a Netlify environment variable). It is never in the browser or in this repository.

## Setup (about 15 minutes, no cost)

1. **Get a Gemini key**: go to <https://aistudio.google.com/apikey>, sign in and click **Create API key**. Do **not** enable billing. Copy the key.
2. **Put this folder on GitHub.** The `.gitignore` keeps `.env` out. Never paste your key into any file in the repo.
3. **Deploy on Netlify**: sign up free at <https://app.netlify.com> with GitHub, choose **Add new project → Import from GitHub**, pick this repo and deploy. The settings in `netlify.toml` are picked up automatically.
4. **Add the key**: *Project configuration → Environment variables* → add `GEMINI_API_KEY` with your key (tick "Contains secret values"). Then go to **Deploys → Trigger deploy → Deploy project without cache**. A variable only takes effect on a **new** deploy.
5. **Test**:
   - Open `https://YOUR-SITE.netlify.app/.netlify/functions/analyze?health=1`. You should see `"keySet":true`.
   - Open the site, then upload a screenshot or use **Paste Text**.

### Environment variables

| Name | Required | What it does |
|---|---|---|
| `GEMINI_API_KEY` | yes | Your Gemini key |
| `GEMINI_MODEL` | no | Model name. Default `gemini-flash-lite-latest` |
| `MOCK_MODE` | no | Set to `1` to return a clearly labelled **fake** result (to test the setup without a key). Remove it afterwards |
| `AI_TIMEOUT_MS` | no | Max wait for the AI. Default `9500` |
| `ALLOWED_ORIGIN` | no | Which website may call the function. Default `*` |

See `.env.example`. Only use a local `.env` for testing, and never upload it.

### Helper links (add to your site address)

- `/.netlify/functions/analyze?health=1` shows whether the key is set and which model is used.
- `/.netlify/functions/analyze?models=1` lists the models your key can use.


## Voice by ElevenLabs

The speaker buttons use **ElevenLabs** text-to-speech for a natural voice in English, Hinglish and Hindi. The browser sends the explanation text to `netlify/functions/speak.js`, which calls ElevenLabs with a secret key and returns an mp3. Short lines are grouped, the next part is pre-loaded while one plays, and replays come from a cache (no extra credits). If ElevenLabs is unavailable, the page falls back to the device's own voice.

| Env variable | Required | What it does |
|---|---|---|
| `ELEVENLABS_API_KEY` | yes (for the AI voice) | Your ElevenLabs key |
| `ELEVEN_VOICE_ID` | no | Voice to use. Default: a built-in ElevenLabs voice. List yours at `/.netlify/functions/speak?voices=1` |
| `ELEVEN_MODEL` | no | Default `eleven_flash_v2_5` (fast, cheap, supports Hindi) |

Check it: `/.netlify/functions/speak?health=1` should show `"keySet":true`.

## Deploy on Render 

`server.js` is a tiny Node server (no packages) that serves the site and runs the same two functions. Create a **New Web Service** from your GitHub repo and use:

| Field | Value |
|---|---|
| Language | Node |
| Branch | main |
| Root Directory | (leave empty) |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance type | Free |
| Health Check Path | `/healthz` |

Environment variables: `GEMINI_API_KEY`, `ELEVENLABS_API_KEY` (and optionally `AI_TIMEOUT_MS=25000`, `ELEVEN_VOICE_ID`). Render has no 10-second function limit, so the longer timeout is safe.

Note: on Render's free plan the service **sleeps after about 15 minutes without visitors** and takes up to a minute to wake. Open the site once before a demo.

## If something goes wrong

| Message on the site | What to do |
|---|---|
| "AI server is not set up on this website" | You opened the site from a file or GitHub Pages. Use the Netlify address. |
| "missing API key" / "key is not working" | Check `GEMINI_API_KEY`, then redeploy without cache. |
| "model name is wrong" | Open `?models=1`, pick a name from the list, set it as `GEMINI_MODEL`, redeploy. |
| "took too long" | Free Netlify functions have a short time limit. Retry or use a smaller screenshot. |
| "Too many checks" | Free Gemini limit reached. Wait a minute. |
| "does not look like a message" | The image was not a message or chat. Upload the message screenshot. |

## Run it locally

The demos and page work by simply opening `index.html`, but the AI needs the Netlify function. To test it locally:

```bash
npm install -g netlify-cli
cp .env.example .env      # then put your key inside .env
netlify dev               # opens http://localhost:8888
```

## Project structure

```
fraudshield/
├── index.html                  # page markup
├── netlify.toml                # tells Netlify where the function is
├── .env.example                # example settings (copy to .env locally)
├── .gitignore                  # keeps .env and keys out of GitHub
├── netlify/functions/
│   └── analyze.js              # server: calls Gemini, validates the answer
├── css/style.css               # custom styles
└── js/
    ├── tailwind-config.js      # Tailwind theme
    ├── data/
    │   ├── demos.js            # 4 demo messages + danger-score flags
    │   ├── scams.js            # Common Scams cards
    │   └── legal.js            # Privacy and Terms text
    ├── i18n.js                 # English / Hinglish / Hindi text
    ├── ai.js                   # browser side: shrinks image, calls the function
    └── app.js                  # app logic: tabs, language, voice, results, pop-ups
```

Where to change things:
- Demo messages and flag colours: `js/data/demos.js`
- Scam cards: `js/data/scams.js`
- How the AI judges messages (the prompt and scoring rules): `RUBRIC` in `netlify/functions/analyze.js`
- Translations: `js/i18n.js`
- Site colours and fonts: `js/tailwind-config.js`

## Tech stack

Plain HTML, CSS and JavaScript (no build step) · [Tailwind CSS](https://tailwindcss.com) via CDN · Netlify Functions (Node) · Google Gemini API · Web Speech API.

## Privacy and honest notes

- Uploaded screenshots and pasted text are sent to Google's Gemini AI to be read. This site does not store them. On Google's **free** tier, inputs may be used to improve Google products and may be reviewed by people, so **hide card numbers, OTPs and personal details before uploading or pasting**.
- The demo buttons never leave your browser.
- AI can be wrong. A "Safe" result is not a guarantee. Test with many real messages before relying on it.
- The Netlify free plan has a monthly usage cap. When it is reached the site pauses instead of charging you.
- Browser voice depends on the voices installed on the device. Some devices have no Hindi voice.

## If you are scammed in India

- Call the Cyber Crime Helpline **1930** immediately. The first hour matters most.
- Report at [cybercrime.gov.in](https://cybercrime.gov.in).
- Report spam calls and SMS at [Sanchar Saathi](https://sancharsaathi.gov.in).

## Disclaimer

FraudShield is an educational project. Results are generated by AI and may be wrong. Always confirm with your bank's official app or the number printed on your card. It is not legal or financial advice.
