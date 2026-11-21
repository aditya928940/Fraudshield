# 🛡️ FraudShield

**Check it before you tap.** FraudShield is a scam-message explainer built for India. Upload (or paste) a screenshot of a suspicious SMS, WhatsApp or email and it shows a colour-coded danger flag, explains the tricks the scammer is using in plain words, and tells you exactly what to do next.


## Features

- **Danger flag system**: every result gets a score out of 100 and a colour-coded flag:

  | Score | Flag | Meaning |
  |---|---|---|
  | 0–25 | 🟢 Green | Looks safe |
  | 26–50 | 🟡 Yellow | Be careful, verify first |
  | 51–75 | 🟠 Orange | High risk |
  | 76–100 | 🔴 Red | Scam alert |

- **Explains the psychology**: shows the exact lines in the message that carry fake urgency, fake authority, fake websites, greed bait and so on, in simple language.
- **Try-it demos**: four example messages, one for each flag level.
- **3 languages**: English, Hinglish and हिन्दी. The choice is remembered in the browser.
- **Voice explanations**: a speaker icon next to each explanation reads it aloud (Web Speech API).
- **Common scams library**: India-style spam messages (bank reward-points APK, courier redelivery fee, fake part-time job, Amazon Prime renewal, fake Windows popup, electricity power-cut SMS) with filter tabs.
- **Emergency steps**: what to do in the first hour if you already sent money or clicked a link (call **1930**, report on **cybercrime.gov.in**, **Sanchar Saathi**).
- **What NOT to do after a scam**: six common mistakes to avoid.
- **Privacy Guarantee** and **Terms of Service** pop-ups.

## Demo status

This repository is a **prototype**:

- There is no backend and no AI model yet. When you upload a screenshot, the page shows an **example result**, not a real analysis. The four demo buttons show the full range of flags.
- The sample scam messages are written examples modelled on common patterns. Phone numbers and links in them are masked or fake.
- Your screenshot stays in your browser. Nothing is uploaded anywhere.

## Run it locally

No build step. Just open `index.html` in a browser.

```bash
# or serve it locally
python3 -m http.server 8000
# then open http://localhost:8000
```

An internet connection is needed for the Tailwind CSS CDN and Google Fonts.

## Deploy on GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Tech stack

- Plain HTML, CSS and JavaScript in a single file
- [Tailwind CSS](https://tailwindcss.com) (CDN)
- Google Fonts: Plus Jakarta Sans, Noto Sans Devanagari, Material Symbols
- Web Speech API for voice

## Browser notes

- Voice quality depends on the voices installed on the device. Some devices have no Hindi (hi-IN) voice; the page shows a short message in that case and Hinglish or English still work.
- Works best in the latest Chrome, Edge or Safari.

## Project structure

```
fraudshield/
├── index.html              # page markup
├── css/
│   └── style.css           # custom styles (rest comes from Tailwind)
├── js/
│   ├── tailwind-config.js  # Tailwind theme: colours, fonts, spacing
│   ├── data/
│   │   ├── demos.js        # 4 demo messages + danger-score flags
│   │   ├── scams.js        # "Common Scams" cards (Indian-style samples)
│   │   └── legal.js        # Privacy Guarantee and Terms text
│   ├── i18n.js             # English / Hinglish / Hindi translations
│   └── app.js              # app logic: language, voice, results, upload, pop-ups
└── README.md
```

The scripts are plain `<script>` files loaded in this order: `demos.js`, `scams.js`, `legal.js`, `i18n.js`, `app.js`. There is no build step.

### Where to change things

- Add or edit a demo message: `js/data/demos.js`
- Change score ranges or flag colours: `FLAGS` in `js/data/demos.js`
- Add a scam card: `js/data/scams.js`
- Fix a translation: `js/i18n.js` (page text) or the data file of that feature
- Colours and fonts of the whole site: `js/tailwind-config.js`

## If you are scammed in India

- Call the Cyber Crime Helpline **1930** immediately. The first hour matters most.
- Report at [cybercrime.gov.in](https://cybercrime.gov.in).
- Report spam calls and SMS at [Sanchar Saathi](https://sancharsaathi.gov.in).

## Disclaimer

FraudShield is an educational project. A "Safe" result is not a guarantee. Always confirm with your bank's official app or the number printed on your card. It is not legal or financial advice.


---

# Level 2: real AI screenshot reading (free)

The site now reads uploaded screenshots with Google Gemini (free tier). The secret key lives only on the server (a Netlify Function), never in the browser.

```
Browser  ->  netlify/functions/analyze.js  ->  Gemini API
(js/ai.js)   (holds GEMINI_API_KEY)
```

## Setup (about 15 minutes, no money)

1. **Get a Gemini key**: open https://aistudio.google.com/apikey, sign in, click *Create API key*. Do NOT enable billing. Copy the key.
2. **Push this folder to GitHub** (the `.gitignore` keeps `.env` out; never paste the key in any file).
3. **Netlify**: sign up free at https://app.netlify.com with GitHub -> *Add new project* -> *Import from GitHub* -> pick this repo. Leave build settings as they are (`netlify.toml` handles it) -> Deploy.
4. **Add the key**: Site configuration -> Environment variables -> add `GEMINI_API_KEY` = your key. Then Deploys -> *Trigger deploy*.
5. **Test**:
   - `https://YOUR-SITE.netlify.app/.netlify/functions/analyze?health=1` should show `"keySet":true`.
   - Upload a real screenshot on the site.
   - Want to test the wiring before you have a key? Set env var `MOCK_MODE=1` (shows a clearly labelled fake result), remove it later.

## If something fails
| Message on site | Meaning / fix |
|---|---|
| "AI server is not set up" | You opened the site from GitHub Pages / a file. Use the Netlify URL. |
| "missing API key" / "key not working" | Re-check `GEMINI_API_KEY`, redeploy. |
| "model name is wrong" | Open `...analyze?models=1`, pick a name from the list, set env `GEMINI_MODEL` to it. |
| "took too long" | Netlify free functions can time out; try a smaller screenshot or retry. |
| "Too many checks" | Free Gemini limit; wait a minute. |

## Honest notes
- Free Gemini inputs may be used by Google to improve products and read by people. The privacy popup says so. Tell users to hide private details.
- AI can be wrong. Test with many real screenshots before trusting it.
- Netlify free plan has a monthly credit cap; the site pauses instead of charging.
- Other languages are translated only when the user switches to them.
- Users can also paste the message text (the "Paste Text" tab); it goes through the same function and AI.
