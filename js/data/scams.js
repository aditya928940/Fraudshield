// "Common Scams" cards: Indian-style sample messages in 3 languages.

const SCAM_LBL = {
  en: ['Trick Used:', 'Warning Signs:', 'Golden Rule:'],
  hn: ['Chaal:', 'Warning Signs:', 'Golden Rule:'],
  hi: ['चाल:', 'चेतावनी के संकेत:', 'सुनहरा नियम:']
};
const SCAMS = [
  {
    id: 'reward', cats: 'bank sms', cat: 'Bank & UPI Fraud', icon: 'trending_up', cls: 'bg-error-container text-error',
    badge: { en: 'Very Common', hn: 'Bahut Aam', hi: 'बहुत आम' },
    title: { en: 'Bank "Reward Points" APK SMS', hn: 'Bank "Reward Points" APK SMS', hi: 'बैंक "रिवॉर्ड पॉइंट्स" APK संदेश' },
    msg: { en: `HDFC Bank: Dear Customer, your reward points worth Rs 9,840 will expire tonight. Install the app now to redeem: hdfc-rewards-app.top/redeem.apk`, hn: `HDFC Bank: Dear Customer, aapke Rs 9,840 reward points aaj raat expire ho jayenge. Abhi redeem karne ke liye app install karein: hdfc-rewards-app.top/redeem.apk`, hi: `HDFC Bank: प्रिय ग्राहक, आपके ₹9,840 के रिवॉर्ड पॉइंट्स आज रात एक्सपायर हो जाएँगे। रिडीम करने के लिए अभी ऐप इंस्टॉल करें: hdfc-rewards-app.top/redeem.apk` },
    trick: { en: 'Greed plus fear of losing points. The "app" you install can read your SMS and steal your OTPs.', hn: 'Lalach aur points khone ka darr. Jo "app" install hoti hai wo aapke SMS padh kar OTP chura sakti hai.', hi: 'लालच और पॉइंट खोने का डर। जो "ऐप" इंस्टॉल होती है वह आपके SMS पढ़कर OTP चुरा सकती है।' },
    warn: { en: 'The link ends in .apk or .top, not the bank\'s real website. It asks you to install an app from outside the Play Store.', hn: 'Link .apk ya .top par khatam hota hai, bank ki asli website par nahi. Play Store ke bahar se app install karne ko kehta hai.', hi: 'लिंक .apk या .top पर खत्म होता है, बैंक की असली वेबसाइट पर नहीं। Play Store के बाहर से ऐप इंस्टॉल करने को कहता है।' },
    rule: { en: 'A bank never sends an app through an SMS link. Install apps only from Google Play or the App Store, and check reward points inside the bank\'s own app.', hn: 'Bank kabhi SMS link se app nahi bhejta. App sirf Google Play ya App Store se install karo, aur reward points bank ki apni app mein dekho.', hi: 'बैंक कभी SMS लिंक से ऐप नहीं भेजता। ऐप सिर्फ़ Google Play या App Store से इंस्टॉल करें, और रिवॉर्ड पॉइंट बैंक के अपने ऐप में देखें।' }
  },
  {
    id: 'courier', cats: 'delivery sms', cat: 'Delivery & Package', icon: 'local_shipping', cls: 'bg-secondary-fixed text-secondary',
    badge: { en: 'Delivery', hn: 'Delivery', hi: 'डिलीवरी' },
    title: { en: 'Courier "Redelivery Fee" SMS', hn: 'Courier "Redelivery Fee" SMS', hi: 'कूरियर "रीडिलीवरी फ़ीस" संदेश' },
    msg: { en: `DELHIVERY: Your parcel is on hold because the address is incomplete. Pay Rs 12 redelivery fee or it will be returned (RTO) in 12 hours: delhivery-redeliver.xyz/pay`, hn: `DELHIVERY: Aapka parcel address incomplete hone ki wajah se hold par hai. Rs 12 redelivery fee pay karein, warna 12 ghante mein RTO ho jayega: delhivery-redeliver.xyz/pay`, hi: `DELHIVERY: अधूरे पते के कारण आपका पार्सल रोका गया है। ₹12 रीडिलीवरी फ़ीस भरें, वरना 12 घंटे में RTO हो जाएगा: delhivery-redeliver.xyz/pay` },
    trick: { en: 'Curiosity and a tiny amount. Rs 12 feels too small to be a scam, but the page steals your card or UPI details.', hn: 'Curiosity aur chhoti rakam. Rs 12 itna kam lagta hai ki scam nahi lagta, par wo page aapke card ya UPI ki details chura leta hai.', hi: 'जिज्ञासा और छोटी रकम। ₹12 इतना कम लगता है कि स्कैम नहीं लगता, पर वह पेज आपके कार्ड या UPI की जानकारी चुरा लेता है।' },
    warn: { en: 'The website is not the courier\'s real site. A "redelivery fee" is asked through a link, from a random number.', hn: 'Website courier ki asli site nahi hai. "Redelivery fee" link se maangi jaati hai, kisi random number se.', hi: 'वेबसाइट कूरियर की असली साइट नहीं है। "रीडिलीवरी फ़ीस" लिंक से माँगी जाती है, किसी अनजान नंबर से।' },
    rule: { en: 'Couriers do not collect fees through SMS links. Track your parcel with the tracking ID on the official website or your shopping app.', hn: 'Courier SMS link se fee nahi lete. Parcel ko tracking ID se official website ya shopping app mein track karo.', hi: 'कूरियर SMS लिंक से फ़ीस नहीं लेते। पार्सल को ट्रैकिंग ID से आधिकारिक वेबसाइट या शॉपिंग ऐप में ट्रैक करें।' }
  },
  {
    id: 'job', cats: 'job sms', cat: 'Job & Remote Work', icon: 'work', cls: 'bg-primary/10 text-primary',
    badge: { en: 'Fast Growing', hn: 'Tezi se Badh Raha', hi: 'तेज़ी से बढ़ रहा' },
    title: { en: 'Fake "Part-time Job" WhatsApp', hn: 'Nakli "Part-time Job" WhatsApp', hi: 'नकली "पार्ट-टाइम जॉब" व्हाट्सऐप' },
    msg: { en: `Hello! This is Pooja, HR at Naukri Partner. We liked your profile. Work from home: like YouTube videos and earn Rs 500 per task, Rs 3,000-5,000 daily. Message us on WhatsApp now: wa.me/91XXXXXXXXXX`, hn: `Hello! Main Pooja, HR Naukri Partner se. Aapki profile pasand aayi. Work from home: YouTube videos like karke Rs 500 per task, daily Rs 3,000-5,000 kamayein. Abhi WhatsApp karein: wa.me/91XXXXXXXXXX`, hi: `नमस्ते! मैं पूजा, Naukri Partner से HR। आपकी प्रोफ़ाइल पसंद आई। घर बैठे काम: YouTube वीडियो लाइक करके ₹500 प्रति टास्क, रोज़ ₹3,000-5,000 कमाएँ। अभी WhatsApp करें: wa.me/91XXXXXXXXXX` },
    trick: { en: 'Hope of easy money. They may pay a small amount first to win your trust, then ask for a big "deposit".', hn: 'Aasaan kamayi ki umeed. Pehle thoda paisa de dete hain taaki bharosa ho, phir bada "deposit" maangte hain.', hi: 'आसान कमाई की उम्मीद। पहले थोड़ा पैसा दे देते हैं ताकि भरोसा हो, फिर बड़ा "डिपॉज़िट" माँगते हैं।' },
    warn: { en: 'Pay per like or per task, then a move to WhatsApp or Telegram, then a deposit to "unlock" higher tasks.', hn: 'Har like ya task ka paisa, phir WhatsApp ya Telegram par bulana, phir bade task "unlock" karne ke liye deposit.', hi: 'हर लाइक या टास्क का पैसा, फिर WhatsApp या Telegram पर बुलाना, फिर बड़े टास्क "अनलॉक" करने के लिए डिपॉज़िट।' },
    rule: { en: 'A real employer never asks you to pay money to get a job or to do tasks. If you must pay, it is a scam.', hn: 'Asli employer job ya task ke liye kabhi paisa nahi maangta. Paisa dena pade, to scam hai.', hi: 'असली नियोक्ता नौकरी या टास्क के लिए कभी पैसे नहीं माँगता। पैसे देने पड़ें, तो स्कैम है।' }
  },
  {
    id: 'prime', cats: 'invoice', cat: 'Subscription & Invoices', icon: 'receipt_long', cls: 'bg-surface-container text-on-surface-variant',
    badge: { en: 'Invoice Spoof', hn: 'Nakli Bill', hi: 'नकली बिल' },
    title: { en: 'Amazon Prime Rs 4,999 "Renewal" Alert', hn: 'Amazon Prime Rs 4,999 "Renewal" Alert', hi: 'Amazon Prime ₹4,999 "रिन्यूअल" अलर्ट' },
    msg: { en: `AMAZON: Rs 4,999 will be charged to your account today for Prime Annual renewal. To cancel, call immediately: 1800-XXX-XXXX`, hn: `AMAZON: Aapke account se Rs 4,999 Prime Annual renewal ke liye aaj charge honge. Cancel karne ke liye turant call karein: 1800-XXX-XXXX`, hi: `AMAZON: Prime वार्षिक रिन्यूअल के लिए आज आपके खाते से ₹4,999 कट जाएँगे। रद्द करने के लिए तुरंत कॉल करें: 1800-XXX-XXXX` },
    trick: { en: 'A surprise charge makes you panic, so you call the number in the message without thinking.', hn: 'Achanak paisa katne ki baat se aap ghabra kar message wale number par bina soche call kar dete ho.', hi: 'अचानक पैसे कटने की बात से आप घबराकर संदेश वाले नंबर पर बिना सोचे कॉल कर देते हैं।' },
    warn: { en: 'The caller asks you to install AnyDesk or QuickSupport, or to enter your UPI PIN to get a "refund".', hn: 'Call karne par AnyDesk ya QuickSupport install karne ko kehte hain, ya "refund" ke liye UPI PIN daalne ko.', hi: 'कॉल करने पर AnyDesk या QuickSupport इंस्टॉल करने को कहते हैं, या "रिफ़ंड" के लिए UPI PIN डालने को।' },
    rule: { en: 'Never call a number given in a surprise bill message. Check your orders and memberships inside the official app, or your bank statement.', hn: 'Achanak aaye bill message ke number par kabhi call mat karo. Orders aur membership official app mein ya bank statement mein dekho.', hi: 'अचानक आए बिल संदेश के नंबर पर कभी कॉल न करें। ऑर्डर और मेंबरशिप आधिकारिक ऐप में या बैंक स्टेटमेंट में देखें।' }
  },
  {
    id: 'windows', cats: 'tech', cat: 'Tech Support Extortion', icon: 'computer', cls: 'bg-error-container text-error',
    badge: { en: 'Critical Alert', hn: 'Critical Alert', hi: 'गंभीर अलर्ट' },
    title: { en: 'Full-Screen "Windows Locked" Popup', hn: 'Full-Screen "Windows Locked" Popup', hi: 'फ़ुल-स्क्रीन "Windows लॉक" पॉपअप' },
    msg: { en: `MICROSOFT SECURITY ALERT: A Trojan virus has been found on your computer. Your bank passwords and photos are leaking. Do not shut down. Call Microsoft Support (Toll Free) now: 1800-XXX-XXXX`, hn: `MICROSOFT SECURITY ALERT: Aapke computer mein Trojan virus mila hai. Aapke bank password aur photos leak ho rahe hain. Computer band mat karein. Turant Microsoft Support (Toll Free) call karein: 1800-XXX-XXXX`, hi: `MICROSOFT SECURITY ALERT: आपके कंप्यूटर में ट्रोजन वायरस मिला है। आपके बैंक पासवर्ड और फ़ोटो लीक हो रहे हैं। कंप्यूटर बंद न करें। तुरंत Microsoft सपोर्ट (टोल फ़्री) को कॉल करें: 1800-XXX-XXXX` },
    trick: { en: 'Loud beeping and a locked screen scare you into calling the "support" number.', hn: 'Tez beep aur locked screen aapko darakar "support" number par call karwate hain.', hi: 'तेज़ बीप और लॉक स्क्रीन आपको डराकर "सपोर्ट" नंबर पर कॉल करवाते हैं।' },
    warn: { en: 'Microsoft never shows phone numbers in warnings. The "engineer" asks you to install AnyDesk or TeamViewer and then asks for money to "fix" it.', hn: 'Microsoft warning mein kabhi phone number nahi dikhata. "Engineer" AnyDesk ya TeamViewer install karwata hai aur phir "theek karne" ke paise maangta hai.', hi: 'Microsoft चेतावनी में कभी फ़ोन नंबर नहीं दिखाता। "इंजीनियर" AnyDesk या TeamViewer इंस्टॉल करवाता है और फिर "ठीक करने" के पैसे माँगता है।' },
    rule: { en: 'Press Ctrl+Shift+Esc (Windows) or Cmd+Option+Esc (Mac) to force close the browser. Your computer is NOT infected. Never install a remote-access app for a stranger.', hn: 'Browser band karne ke liye Ctrl+Shift+Esc (Windows) ya Cmd+Option+Esc (Mac) dabao. Aapka computer infected NAHI hai. Anjaan ke kehne par remote-access app kabhi install mat karo.', hi: 'ब्राउज़र बंद करने के लिए Ctrl+Shift+Esc (Windows) या Cmd+Option+Esc (Mac) दबाएँ। आपका कंप्यूटर संक्रमित नहीं है। अनजान के कहने पर रिमोट-एक्सेस ऐप कभी इंस्टॉल न करें।' }
  },
  {
    id: 'bijli', cats: 'sms', cat: 'Fake SMS', icon: 'bolt', cls: 'bg-secondary-fixed text-secondary',
    badge: { en: 'Fast Spreading', hn: 'Tezi se Faila', hi: 'तेज़ी से फैल रहा' },
    title: { en: 'Electricity "Power Cut Tonight" SMS', hn: 'Bijli "Aaj Raat Connection Katega" SMS', hi: 'बिजली "आज रात कनेक्शन कटेगा" संदेश' },
    msg: { en: `Dear Consumer, your electricity will be disconnected tonight at 9:30 PM because last month's bill was not updated. Contact the Electricity Officer immediately: 98XXXXXX45`, hn: `Dear Consumer, aapki bijli aaj raat 9:30 baje kaat di jayegi kyunki pichhle mahine ka bill update nahi hua. Turant Electricity Officer se sampark karein: 98XXXXXX45`, hi: `प्रिय उपभोक्ता, पिछले महीने का बिल अपडेट न होने के कारण आपकी बिजली आज रात 9:30 बजे काट दी जाएगी। तुरंत बिजली अधिकारी से संपर्क करें: 98XXXXXX45` },
    trick: { en: 'Fear of a power cut at night over a small bill. The "officer" then sends a link or asks you to install an app to "update" it.', hn: 'Raat ko bijli katne ka darr, wo bhi chhote bill par. Phir "officer" link bhejta hai ya bill "update" karne ke liye app install karwata hai.', hi: 'रात को बिजली कटने का डर, वह भी छोटे बिल पर। फिर "ऑफ़िसर" लिंक भेजता है या बिल "अपडेट" करने के लिए ऐप इंस्टॉल करवाता है।' },
    warn: { en: 'A personal mobile number to call. No consumer number, no name, no bill amount. Sent in bulk to everyone.', hn: 'Call karne ke liye personal mobile number. Na consumer number, na naam, na bill ki rakam. Sabko bulk mein bheja jaata hai.', hi: 'कॉल करने के लिए निजी मोबाइल नंबर। न कंज़्यूमर नंबर, न नाम, न बिल की रकम। सबको एक साथ भेजा जाता है।' },
    rule: { en: 'Electricity companies do not cut power through a night-time SMS with a personal number. Check your bill on the official app or website with your consumer number.', hn: 'Bijli company raat ko personal number wale SMS se connection nahi kaatti. Apna bill official app ya website par consumer number se check karo.', hi: 'बिजली कंपनी रात को निजी नंबर वाले SMS से कनेक्शन नहीं काटती। अपना बिल आधिकारिक ऐप या वेबसाइट पर कंज़्यूमर नंबर से जाँचें।' }
  }
];
