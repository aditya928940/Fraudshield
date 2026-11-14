// Demo messages (English / Hinglish / Hindi) and the danger-score flags.
// score decides the flag: 0-25 green, 26-50 yellow, 51-75 orange, 76-100 red

// score decides the flag: 0-25 green, 26-50 yellow, 51-75 orange, 76-100 red
// q = quote from the message for each point (empty string = no quote)
// f = 3 info cards [label, value, small text], x = points [name, explanation], s = steps, r = golden rule
const DEMOS = [
  {
    id: 'bank_real', score: 7, emoji: '🏦', file: 'sample_real_bank_alert.png',
    lbl: { en: `Normal Bank Alert`, hn: `Normal Bank Alert`, hi: `सामान्य बैंक अलर्ट` },
    msg: `Rs 450.00 debited from A/c XX1234 on 14-Nov-26 at CAFE SUNRISE via UPI. Not you? Call the bank number printed on your card.`,
    fi: ['link', 'schedule'],
    q: [`Rs 450.00 debited from A/c XX1234`, `A/c XX1234`, `Call the bank number printed on your card`],
    en: {
      ti: `Normal bank transaction alert`,
      f: [[`No link`, `No link in the message`, `Nothing to tap`], [`No rush`, `Plain information`, `Doesn't force you to act`], [`What to do`, `Check your app`, `Unknown payment? Call the number on your card`]],
      x: [[`No link to tap`, `The message only tells you what happened. Scam messages almost always want you to tap a link.`], [`Partial account number`, `Banks show only the last digits (like XX1234). Scammers ask for the full number.`], [`Safe advice`, `It tells you to call the number on your card, not a number inside the message. A real bank says exactly this.`]],
      s: [`If you made this payment, there is nothing to do.`, `If you did not, call the number on the back of your card.`, `Still: never share your OTP or PIN with anyone.`],
      r: `A real bank message only informs you. It never asks for your OTP, PIN or a click.`
    },
    hn: {
      ti: `Normal bank transaction alert`,
      f: [[`Koi link nahi`, `Message mein koi link nahi`, `Tap karne ko kuch nahi`], [`Koi jaldi nahi`, `Seedhi jaankari`, `Aapko kuch karne par majboor nahi karta`], [`Kya karein`, `Apni app dekho`, `Payment anjaan lage to card ke number par call karo`]],
      x: [[`Tap karne wala link nahi`, `Message sirf batata hai ki kya hua. Scam message lagbhag hamesha link par tap karwana chahte hain.`], [`Account number adhura`, `Bank sirf aakhri digit dikhata hai (jaise XX1234). Scammer poora number maangte hain.`], [`Sahi salah`, `Ye card par likhe number par call karne ko kehta hai, message ke andar ke number par nahi. Asli bank yahi kehta hai.`]],
      s: [`Ye payment aapne ki thi to kuch karne ki zaroorat nahi.`, `Aapne nahi ki, to card ke peeche likhe number par call karo.`, `Phir bhi: OTP ya PIN kisi ko mat batao.`],
      r: `Asli bank message sirf jaankari deta hai. Wo OTP, PIN ya click kabhi nahi maangta.`
    },
    hi: {
      ti: `सामान्य बैंक लेन-देन अलर्ट`,
      f: [[`कोई लिंक नहीं`, `संदेश में कोई लिंक नहीं`, `टैप करने को कुछ नहीं`], [`कोई जल्दबाज़ी नहीं`, `सीधी जानकारी`, `आपको कुछ करने पर मजबूर नहीं करता`], [`क्या करें`, `अपना ऐप देखें`, `पेमेंट अनजान लगे तो कार्ड के नंबर पर कॉल करें`]],
      x: [[`टैप करने वाला लिंक नहीं`, `संदेश सिर्फ़ बताता है कि क्या हुआ। स्कैम संदेश लगभग हमेशा लिंक पर टैप करवाना चाहते हैं।`], [`खाता नंबर अधूरा`, `बैंक सिर्फ़ आखिरी अंक दिखाता है (जैसे XX1234)। स्कैमर पूरा नंबर माँगते हैं।`], [`सही सलाह`, `यह कार्ड पर लिखे नंबर पर कॉल करने को कहता है, संदेश के अंदर के नंबर पर नहीं। असली बैंक यही कहता है।`]],
      s: [`यह पेमेंट आपने की थी तो कुछ करने की ज़रूरत नहीं।`, `आपने नहीं की, तो कार्ड के पीछे लिखे नंबर पर कॉल करें।`, `फिर भी: OTP या PIN किसी को न बताएँ।`],
      r: `असली बैंक संदेश सिर्फ़ जानकारी देता है। वह OTP, PIN या क्लिक कभी नहीं माँगता।`
    }
  },
  {
    id: 'recruiter', score: 36, emoji: '🧑‍💼', file: 'sample_unknown_recruiter.png',
    lbl: { en: `Unknown Recruiter`, hn: `Anjaan Recruiter`, hi: `अनजान रिक्रूटर` },
    msg: `Hello, this is Priya from TechNova HR. We liked your profile. Interview is tomorrow 11 AM on Google Meet. Please send your resume to technova.hr2024@gmail.com`,
    fi: ['mail', 'help'],
    q: [`technova.hr2024@gmail.com`, `We liked your profile`, `Interview is tomorrow 11 AM`],
    en: {
      ti: `Unknown recruiter message`,
      f: [[`Personal email`, `technova.hr2024@gmail.com`, `Companies usually use their own email`], [`Few details`, `No job title`, `Which role? Which team?`], [`What to do`, `Verify first`, `Check the company's careers page`]],
      x: [[`Gmail address`, `A real HR person usually writes from the company email, like name@company.com. A Gmail address is not proof of a scam, but it is worth checking.`], [`Missing details`, `No job title, no team, no job link. Real recruiters usually say which role it is for.`], [`Very quick interview`, `A next-day interview with no screening can happen, but scammers also rush you so you don't verify.`]],
      s: [`Search the company and its careers page. Does this job exist?`, `Ask for the job title and the official email, and check this person on LinkedIn.`, `Do not send Aadhaar, PAN or bank details at this stage, and never pay any fee.`, `If it feels wrong, ignore it. A real recruiter will understand.`],
      r: `Verify first. A real job never needs payment or your bank details before hiring.`
    },
    hn: {
      ti: `Anjaan Recruiter ka message`,
      f: [[`Personal email`, `technova.hr2024@gmail.com`, `Company aksar apni email use karti hai`], [`Kam details`, `Job title nahi`, `Kaun sa role? Kaun si team?`], [`Kya karein`, `Pehle verify karo`, `Company ka careers page dekho`]],
      x: [[`Gmail address`, `Asli HR aksar company email se likhta hai, jaise name@company.com. Gmail address scam ka saboot nahi hai, par check karna chahiye.`], [`Details kam hain`, `Na job title, na team, na job link. Asli recruiter aksar batata hai ki kis role ke liye hai.`], [`Bahut jaldi interview`, `Agle din interview bina screening ke ho sakta hai, par scammer bhi jaldi karwate hain taaki aap verify na karo.`]],
      s: [`Company aur uska careers page search karo. Kya ye job sach mein hai?`, `Job title aur official email maango, aur is insaan ko LinkedIn par check karo.`, `Is stage par Aadhaar, PAN ya bank details mat bhejo aur koi fee kabhi mat do.`, `Galat lage to ignore karo. Asli recruiter samajh jaayega.`],
      r: `Pehle verify karo. Asli job mein hiring se pehle paisa ya bank details kabhi nahi lagte.`
    },
    hi: {
      ti: `अनजान रिक्रूटर का संदेश`,
      f: [[`निजी ईमेल`, `technova.hr2024@gmail.com`, `कंपनियाँ अक्सर अपना ईमेल इस्तेमाल करती हैं`], [`कम जानकारी`, `जॉब टाइटल नहीं`, `कौन सा रोल? कौन सी टीम?`], [`क्या करें`, `पहले जाँचें`, `कंपनी का करियर पेज देखें`]],
      x: [[`Gmail पता`, `असली HR अक्सर कंपनी ईमेल से लिखता है, जैसे name@company.com। Gmail पता स्कैम का सबूत नहीं है, पर जाँचना चाहिए।`], [`जानकारी कम है`, `न जॉब टाइटल, न टीम, न जॉब लिंक। असली रिक्रूटर अक्सर बताता है कि किस रोल के लिए है।`], [`बहुत जल्दी इंटरव्यू`, `अगले दिन इंटरव्यू बिना स्क्रीनिंग के हो सकता है, पर स्कैमर भी जल्दी करवाते हैं ताकि आप जाँच न करें।`]],
      s: [`कंपनी और उसका करियर पेज खोजें। क्या यह जॉब सच में है?`, `जॉब टाइटल और आधिकारिक ईमेल माँगें, और इस व्यक्ति को LinkedIn पर जाँचें।`, `इस स्तर पर आधार, PAN या बैंक की जानकारी न भेजें और कोई फ़ीस कभी न दें।`, `गलत लगे तो अनदेखा करें। असली रिक्रूटर समझ जाएगा।`],
      r: `पहले जाँचें। असली नौकरी में भर्ती से पहले पैसे या बैंक की जानकारी कभी नहीं लगती।`
    }
  },
  {
    id: 'card', score: 62, emoji: '💳', file: 'sample_credit_limit_link.png',
    lbl: { en: `Credit Limit Link`, hn: `Credit Limit ka Link`, hi: `क्रेडिट लिमिट लिंक` },
    msg: `Dear Customer, aapke credit card ki limit Rs 2,00,000 badh gayi hai. Abhi activate karein: bit.ly/3xLimitUp`,
    fi: ['link_off', 'card_giftcard'],
    q: [`bit.ly/3xLimitUp`, `limit Rs 2,00,000 badh gayi hai`, `Dear Customer`],
    en: {
      ti: `Credit limit short-link message`,
      f: [[`Hidden short link`, `bit.ly/3xLimitUp`, `A short link hides where it really goes`], [`Too good to be true`, `"Limit increased"`, `You didn't ask for it`], [`What to do`, `Don't tap the link`, `Check the offer in your bank app`]],
      x: [[`Hidden short link`, `A short link hides the real website. A bank would use its own named link or its app.`], [`Free-gift bait`, `A higher limit feels like a reward, so people tap fast. Banks show such offers inside their app, not through random SMS links.`], [`Generic greeting`, `"Dear Customer" with no name and no last 4 digits of your card. Real bank messages usually have them.`]],
      s: [`Do not tap the link.`, `Open your bank's official app and see if the offer is really there.`, `Never enter card number, CVV or OTP on a page opened from an SMS.`, `Block the sender and report on Sanchar Saathi.`],
      r: `If you didn't ask for it, a "free" bank upgrade sent through a link is not real.`
    },
    hn: {
      ti: `Credit Limit ka Short Link`,
      f: [[`Chhupa short link`, `bit.ly/3xLimitUp`, `Short link chhupa deta hai ki asli site kaun si hai`], [`Bahut achha lagne wala`, `"Limit badh gayi"`, `Aapne maangi hi nahi thi`], [`Kya karein`, `Link mat kholo`, `Offer bank ki app mein dekho`]],
      x: [[`Chhupa short link`, `Short link asli website chhupa deta hai. Bank apne naam wala link ya apni app use karta hai.`], [`Free gift ka chara`, `Limit badhna inaam jaisa lagta hai, isliye log jaldi tap kar dete hain. Bank aise offer apni app mein dikhata hai, random SMS link se nahi.`], [`Generic greeting`, `"Dear Customer" aur na naam, na card ke aakhri 4 digit. Asli bank message mein aksar ye hote hain.`]],
      s: [`Link par tap mat karo.`, `Bank ki official app kholo aur dekho ki sach mein koi offer hai ya nahi.`, `SMS se khule page par card number, CVV ya OTP kabhi mat daalo.`, `Sender ko block karo aur Sanchar Saathi par report karo.`],
      r: `Jo aapne maanga nahi, link se aaya "free" bank upgrade asli nahi hota.`
    },
    hi: {
      ti: `क्रेडिट लिमिट का शॉर्ट लिंक`,
      f: [[`छिपा शॉर्ट लिंक`, `bit.ly/3xLimitUp`, `शॉर्ट लिंक छिपा देता है कि असली साइट कौन सी है`], [`बहुत अच्छा लगने वाला`, `"लिमिट बढ़ गई"`, `आपने माँगी ही नहीं थी`], [`क्या करें`, `लिंक न खोलें`, `ऑफ़र बैंक के ऐप में देखें`]],
      x: [[`छिपा शॉर्ट लिंक`, `शॉर्ट लिंक असली वेबसाइट छिपा देता है। बैंक अपने नाम वाला लिंक या अपना ऐप इस्तेमाल करता है।`], [`मुफ़्त तोहफ़े का चारा`, `लिमिट बढ़ना इनाम जैसा लगता है, इसलिए लोग जल्दी टैप कर देते हैं। बैंक ऐसे ऑफ़र अपने ऐप में दिखाता है, किसी अनजान SMS लिंक से नहीं।`], [`सामान्य अभिवादन`, `"Dear Customer" और न नाम, न कार्ड के आखिरी 4 अंक। असली बैंक संदेश में अक्सर ये होते हैं।`]],
      s: [`लिंक पर टैप न करें।`, `बैंक का आधिकारिक ऐप खोलें और देखें कि सच में कोई ऑफ़र है या नहीं।`, `SMS से खुले पेज पर कार्ड नंबर, CVV या OTP कभी न डालें।`, `भेजने वाले को ब्लॉक करें और संचार साथी पर रिपोर्ट करें।`],
      r: `जो आपने माँगा नहीं, लिंक से आया "मुफ़्त" बैंक अपग्रेड असली नहीं होता।`
    }
  },
  {
    id: 'bank', score: 96, emoji: '💬', file: 'sample_bank_kyc_sms.png',
    lbl: { en: `Fake Bank KYC SMS`, hn: `Nakli Bank KYC SMS`, hi: `नकली बैंक KYC SMS` },
    msg: `BANK ALERT: Aapka account aaj raat 12 baje block ho jayega. KYC turant update karein: sbi-kyc-update.top/login`,
    fi: ['link_off', 'hourglass_top'],
    q: [`aaj raat 12 baje block ho jayega`, `BANK ALERT`, `sbi-kyc-update.top/login`],
    en: {
      ti: `Fake bank KYC message`,
      f: [[`Fake website`, `sbi-kyc-update.top`, `Real bank sites end in .co.in or .bank.in`], [`Fake rush`, `"Blocked tonight at 12"`, `A trick to make you panic`], [`What to do`, `Don't open the link`, `Block it, then report to 1930 or Sanchar Saathi`]],
      x: [[`Fake rush`, `The scammer wants you to act before you think. A real bank never gives a 12-hour threat for KYC.`], [`Fake authority`, `Writing "BANK ALERT" in capital letters is easy for anyone. Check the sender and the link name, not the heading.`], [`Fake website`, `This link ends in ".top" and opens a copy of the bank site. Whatever you type there goes straight to the scammer.`]],
      s: [`Do not tap the link. If you already did, type nothing.`, `Open your bank's official app, or call the number on the back of your card.`, `Never share OTP, PIN, CVV or password, not even with someone who says they are from the bank.`, `Block the sender and report on Sanchar Saathi (sancharsaathi.gov.in). If money is gone, call 1930 right away. The first hour matters most.`],
      r: `A bank never asks for KYC, OTP or PIN through an SMS link.`
    },
    hn: {
      ti: `Nakli Bank KYC message`,
      f: [[`Nakli website`, `sbi-kyc-update.top`, `Asli bank ki site .co.in ya .bank.in par hoti hai`], [`Fake jaldi`, `"Aaj raat 12 baje block"`, `Aapko ghabrane ka trick`], [`Kya karein`, `Link mat kholo`, `Block karo aur 1930 / Sanchar Saathi par report karo`]],
      x: [[`Fake jaldi`, `Scammer chahta hai ki aap sochne se pehle hi kar do. Asli bank KYC ke liye kabhi 12 ghante ki dhamki nahi deta.`], [`Fake authority`, `"BANK ALERT" CAPITAL letters mein likhna koi bhi kar sakta hai. Heading nahi, sender ka number aur link ka naam dekho.`], [`Nakli website`, `Ye link ".top" par khatam hota hai aur bank jaisi copy site kholta hai. Wahan jo bhi type karoge, seedha scammer ke paas jayega.`]],
      s: [`Link par tap mat karo. Agar kar diya, to kuch bhi type mat karo.`, `Bank ki official app kholo ya card ke peeche likhe number par call karo.`, `OTP, PIN, CVV ya password kisi ko mat batao, bank wale ko bhi nahi.`, `Sender ko block karo aur Sanchar Saathi (sancharsaathi.gov.in) par report karo. Paisa chala gaya ho to turant 1930 par call karo. Pehla ghanta sabse zaroori hai.`],
      r: `Bank kabhi SMS link se KYC, OTP ya PIN nahi maangta.`
    },
    hi: {
      ti: `नकली बैंक KYC संदेश`,
      f: [[`नकली वेबसाइट`, `sbi-kyc-update.top`, `असली बैंक की साइट .co.in या .bank.in पर खत्म होती है`], [`झूठी जल्दबाज़ी`, `"आज रात 12 बजे बंद"`, `आपको घबराने की चाल`], [`क्या करें`, `लिंक न खोलें`, `ब्लॉक करें और 1930 / संचार साथी पर रिपोर्ट करें`]],
      x: [[`झूठी जल्दबाज़ी`, `स्कैमर चाहता है कि आप सोचने से पहले ही कर दें। असली बैंक KYC के लिए कभी 12 घंटे की धमकी नहीं देता।`], [`झूठा अधिकार`, `"BANK ALERT" बड़े अक्षरों में लिखना कोई भी कर सकता है। हेडिंग नहीं, भेजने वाले का नंबर और लिंक का नाम देखें।`], [`नकली वेबसाइट`, `यह लिंक ".top" पर खत्म होता है और बैंक जैसी नकली साइट खोलता है। वहाँ जो भी लिखेंगे, सीधे स्कैमर के पास जाएगा।`]],
      s: [`लिंक पर टैप न करें। अगर कर दिया है, तो कुछ भी टाइप न करें।`, `बैंक का आधिकारिक ऐप खोलें या कार्ड के पीछे लिखे नंबर पर कॉल करें।`, `OTP, PIN, CVV या पासवर्ड किसी को न बताएँ, बैंक वाले को भी नहीं।`, `भेजने वाले को ब्लॉक करें और संचार साथी (sancharsaathi.gov.in) पर रिपोर्ट करें। पैसा चला गया हो तो तुरंत 1930 पर कॉल करें। पहला घंटा सबसे ज़रूरी है।`],
      r: `बैंक कभी SMS लिंक से KYC, OTP या PIN नहीं माँगता।`
    }
  }
];

// ---------- FLAGS: danger score range -> colour + wording ----------
const FLAGS = [
  { key: 'safe', min: 0, max: 25, color: '#15803d', soft: '#dcfce7', bar: '#22c55e', icon: 'verified_user',
    flag: { en: 'Green Flag', hn: 'Green Flag', hi: 'हरा झंडा' },
    short: { en: 'Looks Safe', hn: 'Safe Lagta Hai', hi: 'सुरक्षित लगता है' },
    sub: { en: 'No scam signs found. If you are still unsure, check in the official app.', hn: 'Scam ke koi signs nahi mile. Phir bhi shak ho to official app mein check karo.', hi: 'स्कैम के कोई संकेत नहीं मिले। फिर भी शक हो तो आधिकारिक ऐप में जाँचें।' } },
  { key: 'caution', min: 26, max: 50, color: '#b45309', soft: '#fef3c7', bar: '#f59e0b', icon: 'help',
    flag: { en: 'Yellow Flag', hn: 'Yellow Flag', hi: 'पीला झंडा' },
    short: { en: 'Be Careful', hn: 'Savdhaan Raho', hi: 'सावधान रहें' },
    sub: { en: 'A few things look odd. Verify before you act.', hn: 'Kuch cheezein ajeeb lag rahi hain. Kuch karne se pehle verify karo.', hi: 'कुछ बातें अजीब लग रही हैं। कुछ करने से पहले जाँच लें।' } },
  { key: 'high', min: 51, max: 75, color: '#c2410c', soft: '#ffedd5', bar: '#f97316', icon: 'warning',
    flag: { en: 'Orange Flag', hn: 'Orange Flag', hi: 'नारंगी झंडा' },
    short: { en: 'High Risk', hn: 'Zyada Khatra', hi: 'ज़्यादा ख़तरा' },
    sub: { en: 'Many scam signs. Do not click or pay anything.', hn: 'Scam ke kaafi signs hain. Na click karo, na paisa do.', hi: 'स्कैम के काफ़ी संकेत हैं। न क्लिक करें, न पैसे दें।' } },
  { key: 'critical', min: 76, max: 100, color: '#b91c1c', soft: '#fee2e2', bar: '#dc2626', icon: 'gpp_bad',
    flag: { en: 'Red Flag', hn: 'Red Flag', hi: 'लाल झंडा' },
    short: { en: 'Scam Alert', hn: 'Scam Alert', hi: 'स्कैम अलर्ट' },
    sub: { en: 'Very likely a scam. Do not click, pay or share any OTP.', hn: 'Bahut zyada chance hai ki ye scam hai. Na click karo, na paisa do, na OTP batao.', hi: 'बहुत संभावना है कि यह स्कैम है। न क्लिक करें, न पैसे दें, न OTP बताएँ।' } }
];
