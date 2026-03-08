import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { pageTranslations } from '@/translations/pageTranslations';

export type Language = 
  | 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml' | 'bn' | 'gu' | 'mr' | 'pa' | 'or';

interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  currentLanguageInfo: LanguageInfo;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('preferred-language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    
    // Try current language in main translations
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    
    // Try current language in page translations
    if (!value && pageTranslations[language]) {
      value = pageTranslations[language];
      for (const k of keys) {
        value = value?.[k];
      }
    }
    
    // Fallback to English main translations
    if (!value) {
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
      }
    }
    
    // Fallback to English page translations
    if (!value && pageTranslations.en) {
      value = pageTranslations.en;
      for (const k of keys) {
        value = value?.[k];
      }
    }
    
    return value || key;
  };

  const currentLanguageInfo = languages.find(l => l.code === language) || languages[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLanguageInfo }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translations object
const translations: Record<Language, Record<string, any>> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      programs: 'Programs',
      asanas: 'Asanas',
      schedule: 'Schedule',
      gallery: 'Gallery',
      login: 'Login',
       contact: 'Contact',
      joinNow: 'Join Now',
      enterStudio: 'Enter Yoga Studio',
    },
    hero: {
      subtitle: 'Discover Inner Peace',
      title: 'Transform Your Life Through',
      highlight: 'Yoga',
      description: 'Experience the ancient art of yoga with modern techniques. Join our community and begin your journey to wellness, balance, and inner harmony.',
      startJourney: 'Start Your Journey',
      explorePrograms: 'Explore Programs',
      newHere: 'New here?',
      startTrial: 'Start with a free trial class',
      stats: {
        students: 'Active Students',
        experience: 'Years Experience',
        programs: 'Yoga Programs',
        rating: 'Student Rating',
      },
    },
    programs: {
      title: 'Age-Wise Programs',
      subtitle: 'Tailored yoga programs for every stage of life',
      kids: 'Kids Yoga',
      teens: 'Teen Yoga',
      adults: 'Adult Yoga',
      seniors: 'Senior Yoga',
      viewAll: 'View All Programs',
    },
    features: {
      title: 'Why Choose Us',
      subtitle: 'The Dhanesh Difference',
      description: 'Experience yoga the way it was meant to be – mindful, transformative, and deeply personal.',
      breathAwareness: 'Breath Awareness',
      breathDesc: 'Master pranayama techniques for stress relief and energy.',
      flexibleSchedule: 'Flexible Schedule',
      scheduleDesc: 'Morning, evening, and weekend classes to fit your lifestyle.',
      smallGroups: 'Small Groups',
      groupsDesc: 'Personalized attention with intimate class sizes.',
      certified: 'Certified Instructor',
      certifiedDesc: 'Learn from an experienced, internationally certified teacher.',
      holistic: 'Holistic Approach',
      holisticDesc: 'Balance physical practice with meditation and philosophy.',
      community: 'Supportive Community',
      communityDesc: 'Join a welcoming community of fellow practitioners.',
    },
    testimonials: {
      title: 'Student Stories',
      subtitle: 'Voices of Transformation',
      description: 'Hear from our community members about their yoga journey with us.',
    },
    cta: {
      title: 'Ready to Begin Your Journey?',
      description: 'Take the first step towards a balanced, peaceful, and healthier life. Join our community of mindful practitioners today.',
      startTrial: 'Start Free Trial',
      viewSchedule: 'View Schedule',
      downloadBrochure: 'Download Brochure',
    },
    footer: {
      tagline: 'Balance your body, calm your mind, transform your life.',
      programs: 'Programs',
      resources: 'Resources',
      company: 'Company',
      contactUs: 'Contact Us',
      allRights: 'All rights reserved.',
      madeWith: 'Made with love for yogis everywhere',
    },
    common: {
      learnMore: 'Learn More',
      enrollNow: 'Enroll Now',
      bookNow: 'Book Now',
      contactUs: 'Contact Us',
      readMore: 'Read More',
    },
  },
  hi: {
    nav: {
      home: 'होम',
      about: 'हमारे बारे में',
      programs: 'कार्यक्रम',
      asanas: 'आसन',
      schedule: 'समय सारणी',
      gallery: 'गैलरी',
      login: 'लॉग इन',
       contact: 'संपर्क',
      joinNow: 'अभी जुड़ें',
      enterStudio: 'योग स्टूडियो में प्रवेश करें',
    },
    hero: {
      subtitle: 'आंतरिक शांति की खोज करें',
      title: 'अपने जीवन को बदलें',
      highlight: 'योग',
      description: 'आधुनिक तकनीकों के साथ योग की प्राचीन कला का अनुभव करें। हमारे समुदाय से जुड़ें और स्वास्थ्य, संतुलन और आंतरिक सामंजस्य की अपनी यात्रा शुरू करें।',
      startJourney: 'अपनी यात्रा शुरू करें',
      explorePrograms: 'कार्यक्रम देखें',
      newHere: 'यहाँ नए हैं?',
      startTrial: 'मुफ्त ट्रायल क्लास से शुरू करें',
      stats: {
        students: 'सक्रिय छात्र',
        experience: 'वर्षों का अनुभव',
        programs: 'योग कार्यक्रम',
        rating: 'छात्र रेटिंग',
      },
    },
    programs: {
      title: 'आयु-वार कार्यक्रम',
      subtitle: 'जीवन के हर चरण के लिए अनुकूलित योग कार्यक्रम',
      kids: 'बच्चों का योग',
      teens: 'किशोर योग',
      adults: 'वयस्क योग',
      seniors: 'वरिष्ठ योग',
      viewAll: 'सभी कार्यक्रम देखें',
    },
    features: {
      title: 'हमें क्यों चुनें',
      subtitle: 'हार्मनी का अंतर',
      description: 'योग का अनुभव करें जैसा कि इसे होना चाहिए – सचेत, परिवर्तनकारी और गहराई से व्यक्तिगत।',
      breathAwareness: 'श्वास जागरूकता',
      breathDesc: 'तनाव राहत और ऊर्जा के लिए प्राणायाम तकनीकों में महारत हासिल करें।',
      flexibleSchedule: 'लचीला समय',
      scheduleDesc: 'आपकी जीवनशैली के अनुसार सुबह, शाम और सप्ताहांत की कक्षाएं।',
      smallGroups: 'छोटे समूह',
      groupsDesc: 'अंतरंग कक्षा आकार के साथ व्यक्तिगत ध्यान।',
      certified: 'प्रमाणित प्रशिक्षक',
      certifiedDesc: 'अनुभवी, अंतरराष्ट्रीय स्तर पर प्रमाणित शिक्षक से सीखें।',
      holistic: 'समग्र दृष्टिकोण',
      holisticDesc: 'ध्यान और दर्शन के साथ शारीरिक अभ्यास को संतुलित करें।',
      community: 'सहायक समुदाय',
      communityDesc: 'साथी अभ्यासियों के स्वागत योग्य समुदाय में शामिल हों।',
    },
    testimonials: {
      title: 'छात्र कहानियाँ',
      subtitle: 'परिवर्तन की आवाज़ें',
      description: 'हमारे समुदाय के सदस्यों से उनकी योग यात्रा के बारे में सुनें।',
    },
    cta: {
      title: 'अपनी यात्रा शुरू करने के लिए तैयार हैं?',
      description: 'संतुलित, शांतिपूर्ण और स्वस्थ जीवन की ओर पहला कदम उठाएं। आज ही हमारे सचेत अभ्यासियों के समुदाय में शामिल हों।',
      startTrial: 'मुफ्त ट्रायल शुरू करें',
      viewSchedule: 'समय सारणी देखें',
      downloadBrochure: 'ब्रोशर डाउनलोड करें',
    },
    footer: {
      tagline: 'अपने शरीर को संतुलित करें, अपने मन को शांत करें, अपने जीवन को बदलें।',
      programs: 'कार्यक्रम',
      resources: 'संसाधन',
      company: 'कंपनी',
      contactUs: 'संपर्क करें',
      allRights: 'सर्वाधिकार सुरक्षित।',
      madeWith: 'योगियों के लिए प्यार से बनाया गया',
    },
    common: {
      learnMore: 'और जानें',
      enrollNow: 'अभी नामांकन करें',
      bookNow: 'अभी बुक करें',
      contactUs: 'संपर्क करें',
      readMore: 'और पढ़ें',
    },
  },
  ta: {
    nav: {
      home: 'முகப்பு',
      about: 'எங்களைப் பற்றி',
      programs: 'திட்டங்கள்',
      asanas: 'ஆசனங்கள்',
      schedule: 'அட்டவணை',
      gallery: 'கேலரி',
      login: 'உள்நுழை',
       contact: 'தொடர்பு',
      joinNow: 'இப்போது சேர்',
      enterStudio: 'யோகா ஸ்டுடியோவில் நுழைக',
    },
    hero: {
      subtitle: 'உள் அமைதியை கண்டறியுங்கள்',
      title: 'உங்கள் வாழ்க்கையை மாற்றுங்கள்',
      highlight: 'யோகா',
      description: 'நவீன நுட்பங்களுடன் யோகாவின் பண்டைய கலையை அனுபவியுங்கள். எங்கள் சமூகத்தில் சேர்ந்து நலம், சமநிலை மற்றும் உள் இணக்கத்திற்கான உங்கள் பயணத்தைத் தொடங்குங்கள்.',
      startJourney: 'உங்கள் பயணத்தைத் தொடங்குங்கள்',
      explorePrograms: 'திட்டங்களை ஆராயுங்கள்',
      newHere: 'புதியவரா?',
      startTrial: 'இலவச சோதனை வகுப்புடன் தொடங்குங்கள்',
      stats: {
        students: 'செயலில் உள்ள மாணவர்கள்',
        experience: 'ஆண்டுகள் அனுபவம்',
        programs: 'யோகா திட்டங்கள்',
        rating: 'மாணவர் மதிப்பீடு',
      },
    },
    programs: {
      title: 'வயது வாரியான திட்டங்கள்',
      subtitle: 'வாழ்க்கையின் ஒவ்வொரு கட்டத்திற்கும் தனிப்பயனாக்கப்பட்ட யோகா திட்டங்கள்',
      kids: 'குழந்தைகள் யோகா',
      teens: 'இளைஞர் யோகா',
      adults: 'பெரியோர் யோகா',
      seniors: 'மூத்தோர் யோகா',
      viewAll: 'அனைத்து திட்டங்களையும் காண்க',
    },
    features: {
      title: 'எங்களை ஏன் தேர்வு செய்ய வேண்டும்',
      subtitle: 'ஹார்மனி வேறுபாடு',
      description: 'யோகாவை அது இருக்க வேண்டிய விதத்தில் அனுபவியுங்கள் - கவனமுள்ள, மாற்றமளிக்கும் மற்றும் ஆழமாக தனிப்பட்ட.',
      breathAwareness: 'மூச்சு விழிப்புணர்வு',
      breathDesc: 'மன அழுத்த நிவாரணம் மற்றும் ஆற்றலுக்கான பிராணாயாம நுட்பங்களில் தேர்ச்சி பெறுங்கள்.',
      flexibleSchedule: 'நெகிழ்வான அட்டவணை',
      scheduleDesc: 'உங்கள் வாழ்க்கை முறைக்கு ஏற்ற காலை, மாலை மற்றும் வார இறுதி வகுப்புகள்.',
      smallGroups: 'சிறிய குழுக்கள்',
      groupsDesc: 'நெருக்கமான வகுப்பு அளவுகளுடன் தனிப்பட்ட கவனம்.',
      certified: 'சான்றளிக்கப்பட்ட பயிற்றுவிப்பாளர்',
      certifiedDesc: 'அனுபவம் வாய்ந்த, சர்வதேச அளவில் சான்றளிக்கப்பட்ட ஆசிரியரிடம் கற்றுக்கொள்ளுங்கள்.',
      holistic: 'முழுமையான அணுகுமுறை',
      holisticDesc: 'தியானம் மற்றும் தத்துவத்துடன் உடல் பயிற்சியை சமநிலைப்படுத்துங்கள்.',
      community: 'ஆதரவான சமூகம்',
      communityDesc: 'சக பயிற்சியாளர்களின் வரவேற்கும் சமூகத்தில் சேருங்கள்.',
    },
    testimonials: {
      title: 'மாணவர் கதைகள்',
      subtitle: 'மாற்றத்தின் குரல்கள்',
      description: 'எங்கள் சமூக உறுப்பினர்களிடமிருந்து அவர்களின் யோகா பயணத்தைப் பற்றி கேளுங்கள்.',
    },
    cta: {
      title: 'உங்கள் பயணத்தைத் தொடங்க தயாரா?',
      description: 'சமநிலையான, அமைதியான மற்றும் ஆரோக்கியமான வாழ்க்கையை நோக்கி முதல் அடியை எடுங்கள். இன்றே எங்கள் கவனமுள்ள பயிற்சியாளர்கள் சமூகத்தில் சேருங்கள்.',
      startTrial: 'இலவச சோதனையைத் தொடங்குங்கள்',
      viewSchedule: 'அட்டவணையைப் பார்க்கவும்',
      downloadBrochure: 'கையேட்டை பதிவிறக்கவும்',
    },
    footer: {
      tagline: 'உங்கள் உடலை சமநிலைப்படுத்துங்கள், உங்கள் மனதை அமைதிப்படுத்துங்கள், உங்கள் வாழ்க்கையை மாற்றுங்கள்.',
      programs: 'திட்டங்கள்',
      resources: 'வளங்கள்',
      company: 'நிறுவனம்',
      contactUs: 'தொடர்பு கொள்ளுங்கள்',
      allRights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
      madeWith: 'யோகிகளுக்காக அன்புடன் உருவாக்கப்பட்டது',
    },
    common: {
      learnMore: 'மேலும் அறிய',
      enrollNow: 'இப்போது சேர்க்கை செய்க',
      bookNow: 'இப்போது முன்பதிவு செய்க',
      contactUs: 'தொடர்பு கொள்ளுங்கள்',
      readMore: 'மேலும் படிக்க',
    },
  },
  te: {
    nav: {
      home: 'హోమ్',
      about: 'మా గురించి',
      programs: 'ప్రోగ్రామ్‌లు',
      asanas: 'ఆసనాలు',
      schedule: 'షెడ్యూల్',
      gallery: 'గ్యాలరీ',
      login: 'లాగిన్',
       contact: 'సంప్రదించండి',
      joinNow: 'ఇప్పుడు చేరండి',
      enterStudio: 'యోగా స్టూడియోలో ప్రవేశించండి',
    },
    hero: {
      subtitle: 'అంతర్గత శాంతిని కనుగొనండి',
      title: 'మీ జీవితాన్ని మార్చుకోండి',
      highlight: 'యోగా',
      description: 'ఆధునిక పద్ధతులతో యోగా ప్రాచీన కళను అనుభవించండి. మా కమ్యూనిటీలో చేరండి మరియు ఆరోగ్యం, సమతుల్యత మరియు అంతర్గత సామరస్యం వైపు మీ ప్రయాణాన్ని ప్రారంభించండి.',
      startJourney: 'మీ ప్రయాణాన్ని ప్రారంభించండి',
      explorePrograms: 'ప్రోగ్రామ్‌లను అన్వేషించండి',
      newHere: 'ఇక్కడ కొత్తవారా?',
      startTrial: 'ఉచిత ట్రయల్ క్లాస్‌తో ప్రారంభించండి',
      stats: {
        students: 'యాక్టివ్ విద్యార్థులు',
        experience: 'సంవత్సరాల అనుభవం',
        programs: 'యోగా ప్రోగ్రామ్‌లు',
        rating: 'విద్యార్థి రేటింగ్',
      },
    },
    programs: {
      title: 'వయస్సు ఆధారిత ప్రోగ్రామ్‌లు',
      subtitle: 'జీవితంలోని ప్రతి దశకు అనుకూలీకరించిన యోగా ప్రోగ్రామ్‌లు',
      kids: 'పిల్లల యోగా',
      teens: 'టీన్ యోగా',
      adults: 'పెద్దల యోగా',
      seniors: 'సీనియర్ యోగా',
      viewAll: 'అన్ని ప్రోగ్రామ్‌లను చూడండి',
    },
    features: {
      title: 'మమ్మల్ని ఎందుకు ఎంచుకోవాలి',
      subtitle: 'హార్మనీ తేడా',
      description: 'యోగాను అది ఉండాల్సిన విధంగా అనుభవించండి - మైండ్‌ఫుల్, పరివర్తనాత్మకమైన మరియు లోతుగా వ్యక్తిగతమైన.',
      breathAwareness: 'శ్వాస అవగాహన',
      breathDesc: 'ఒత్తిడి ఉపశమనం మరియు శక్తి కోసం ప్రాణాయామ పద్ధతులలో నైపుణ్యం సాధించండి.',
      flexibleSchedule: 'సరళమైన షెడ్యూల్',
      scheduleDesc: 'మీ జీవనశైలికి సరిపోయే ఉదయం, సాయంత్రం మరియు వారాంతపు తరగతులు.',
      smallGroups: 'చిన్న గ్రూపులు',
      groupsDesc: 'సన్నిహిత తరగతి పరిమాణాలతో వ్యక్తిగత శ్రద్ధ.',
      certified: 'సర్టిఫైడ్ ఇన్‌స్ట్రక్టర్',
      certifiedDesc: 'అనుభవజ్ఞుడైన, అంతర్జాతీయంగా సర్టిఫై చేయబడిన టీచర్ నుండి నేర్చుకోండి.',
      holistic: 'సమగ్ర విధానం',
      holisticDesc: 'ధ్యానం మరియు తత్వశాస్త్రంతో శారీరక అభ్యాసాన్ని సమతుల్యం చేయండి.',
      community: 'సహాయక సమాజం',
      communityDesc: 'సహచర అభ్యాసకుల స్వాగత సమాజంలో చేరండి.',
    },
    testimonials: {
      title: 'విద్యార్థి కథలు',
      subtitle: 'పరివర్తన స్వరాలు',
      description: 'మా కమ్యూనిటీ సభ్యుల నుండి వారి యోగా ప్రయాణం గురించి వినండి.',
    },
    cta: {
      title: 'మీ ప్రయాణాన్ని ప్రారంభించడానికి సిద్ధంగా ఉన్నారా?',
      description: 'సమతుల్య, శాంతియుత మరియు ఆరోగ్యకరమైన జీవితం వైపు మొదటి అడుగు వేయండి. ఈ రోజే మా మైండ్‌ఫుల్ అభ్యాసకుల సమాజంలో చేరండి.',
      startTrial: 'ఉచిత ట్రయల్ ప్రారంభించండి',
      viewSchedule: 'షెడ్యూల్ చూడండి',
      downloadBrochure: 'బ్రోషర్ డౌన్‌లోడ్ చేయండి',
    },
    footer: {
      tagline: 'మీ శరీరాన్ని సమతుల్యం చేయండి, మీ మనస్సును ప్రశాంతంగా ఉంచండి, మీ జీవితాన్ని మార్చండి.',
      programs: 'ప్రోగ్రామ్‌లు',
      resources: 'వనరులు',
      company: 'కంపెనీ',
      contactUs: 'మమ్మల్ని సంప్రదించండి',
      allRights: 'అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.',
      madeWith: 'యోగీల కోసం ప్రేమతో తయారు చేయబడింది',
    },
    common: {
      learnMore: 'మరింత తెలుసుకోండి',
      enrollNow: 'ఇప్పుడు నమోదు చేసుకోండి',
      bookNow: 'ఇప్పుడు బుక్ చేయండి',
      contactUs: 'మమ్మల్ని సంప్రదించండి',
      readMore: 'మరింత చదవండి',
    },
  },
  kn: {
    nav: {
      home: 'ಮುಖಪುಟ',
      about: 'ನಮ್ಮ ಬಗ್ಗೆ',
      programs: 'ಕಾರ್ಯಕ್ರಮಗಳು',
      asanas: 'ಆಸನಗಳು',
      schedule: 'ವೇಳಾಪಟ್ಟಿ',
      gallery: 'ಗ್ಯಾಲರಿ',
      login: 'ಲಾಗಿನ್',
       contact: 'ಸಂಪರ್ಕಿಸಿ',
      joinNow: 'ಈಗ ಸೇರಿ',
      enterStudio: 'ಯೋಗ ಸ್ಟುಡಿಯೊಗೆ ಪ್ರವೇಶಿಸಿ',
    },
    hero: {
      subtitle: 'ಆಂತರಿಕ ಶಾಂತಿಯನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ',
      title: 'ನಿಮ್ಮ ಜೀವನವನ್ನು ಬದಲಾಯಿಸಿ',
      highlight: 'ಯೋಗ',
      description: 'ಆಧುನಿಕ ತಂತ್ರಗಳೊಂದಿಗೆ ಯೋಗದ ಪ್ರಾಚೀನ ಕಲೆಯನ್ನು ಅನುಭವಿಸಿ. ನಮ್ಮ ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ ಮತ್ತು ಆರೋಗ್ಯ, ಸಮತೋಲನ ಮತ್ತು ಆಂತರಿಕ ಸಾಮರಸ್ಯದ ನಿಮ್ಮ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ.',
      startJourney: 'ನಿಮ್ಮ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ',
      explorePrograms: 'ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
      newHere: 'ಇಲ್ಲಿ ಹೊಸಬರೇ?',
      startTrial: 'ಉಚಿತ ಟ್ರಯಲ್ ತರಗತಿಯೊಂದಿಗೆ ಪ್ರಾರಂಭಿಸಿ',
      stats: {
        students: 'ಸಕ್ರಿಯ ವಿದ್ಯಾರ್ಥಿಗಳು',
        experience: 'ವರ್ಷಗಳ ಅನುಭವ',
        programs: 'ಯೋಗ ಕಾರ್ಯಕ್ರಮಗಳು',
        rating: 'ವಿದ್ಯಾರ್ಥಿ ರೇಟಿಂಗ್',
      },
    },
    programs: {
      title: 'ವಯಸ್ಸಿನ ಆಧಾರಿತ ಕಾರ್ಯಕ್ರಮಗಳು',
      subtitle: 'ಜೀವನದ ಪ್ರತಿ ಹಂತಕ್ಕೆ ಅನುಗುಣವಾದ ಯೋಗ ಕಾರ್ಯಕ್ರಮಗಳು',
      kids: 'ಮಕ್ಕಳ ಯೋಗ',
      teens: 'ಹದಿಹರೆಯದವರ ಯೋಗ',
      adults: 'ವಯಸ್ಕರ ಯೋಗ',
      seniors: 'ಹಿರಿಯರ ಯೋಗ',
      viewAll: 'ಎಲ್ಲಾ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ನೋಡಿ',
    },
    features: {
      title: 'ನಮ್ಮನ್ನು ಏಕೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು',
      subtitle: 'ಹಾರ್ಮನಿ ವ್ಯತ್ಯಾಸ',
      description: 'ಯೋಗವನ್ನು ಅದು ಇರಬೇಕಾದ ರೀತಿಯಲ್ಲಿ ಅನುಭವಿಸಿ - ಮೈಂಡ್‌ಫುಲ್, ಪರಿವರ್ತನಕಾರಿ ಮತ್ತು ಆಳವಾಗಿ ವೈಯಕ್ತಿಕ.',
      breathAwareness: 'ಉಸಿರಾಟ ಜಾಗೃತಿ',
      breathDesc: 'ಒತ್ತಡ ನಿವಾರಣೆ ಮತ್ತು ಶಕ್ತಿಗಾಗಿ ಪ್ರಾಣಾಯಾಮ ತಂತ್ರಗಳನ್ನು ಕರಗತ ಮಾಡಿಕೊಳ್ಳಿ.',
      flexibleSchedule: 'ಹೊಂದಿಕೊಳ್ಳುವ ವೇಳಾಪಟ್ಟಿ',
      scheduleDesc: 'ನಿಮ್ಮ ಜೀವನಶೈಲಿಗೆ ಹೊಂದಿಕೊಳ್ಳುವ ಬೆಳಿಗ್ಗೆ, ಸಂಜೆ ಮತ್ತು ವಾರಾಂತ್ಯದ ತರಗತಿಗಳು.',
      smallGroups: 'ಸಣ್ಣ ಗುಂಪುಗಳು',
      groupsDesc: 'ನಿಕಟ ತರಗತಿ ಗಾತ್ರಗಳೊಂದಿಗೆ ವೈಯಕ್ತಿಕ ಗಮನ.',
      certified: 'ಪ್ರಮಾಣೀಕೃತ ಬೋಧಕ',
      certifiedDesc: 'ಅನುಭವಿ, ಅಂತರರಾಷ್ಟ್ರೀಯವಾಗಿ ಪ್ರಮಾಣೀಕೃತ ಶಿಕ್ಷಕರಿಂದ ಕಲಿಯಿರಿ.',
      holistic: 'ಸಮಗ್ರ ವಿಧಾನ',
      holisticDesc: 'ಧ್ಯಾನ ಮತ್ತು ತತ್ವಶಾಸ್ತ್ರದೊಂದಿಗೆ ದೈಹಿಕ ಅಭ್ಯಾಸವನ್ನು ಸಮತೋಲನಗೊಳಿಸಿ.',
      community: 'ಬೆಂಬಲ ಸಮುದಾಯ',
      communityDesc: 'ಸಹ ಅಭ್ಯಾಸಿಗಳ ಸ್ವಾಗತ ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ.',
    },
    testimonials: {
      title: 'ವಿದ್ಯಾರ್ಥಿ ಕಥೆಗಳು',
      subtitle: 'ಪರಿವರ್ತನೆಯ ಧ್ವನಿಗಳು',
      description: 'ನಮ್ಮ ಸಮುದಾಯ ಸದಸ್ಯರಿಂದ ಅವರ ಯೋಗ ಪ್ರಯಾಣದ ಬಗ್ಗೆ ಕೇಳಿ.',
    },
    cta: {
      title: 'ನಿಮ್ಮ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?',
      description: 'ಸಮತೋಲಿತ, ಶಾಂತಿಯುತ ಮತ್ತು ಆರೋಗ್ಯಕರ ಜೀವನದ ಕಡೆಗೆ ಮೊದಲ ಹೆಜ್ಜೆ ಇಡಿ. ಇಂದೇ ನಮ್ಮ ಮೈಂಡ್‌ಫುಲ್ ಅಭ್ಯಾಸಿಗಳ ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ.',
      startTrial: 'ಉಚಿತ ಟ್ರಯಲ್ ಪ್ರಾರಂಭಿಸಿ',
      viewSchedule: 'ವೇಳಾಪಟ್ಟಿ ನೋಡಿ',
      downloadBrochure: 'ಕರಪತ್ರ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    },
    footer: {
      tagline: 'ನಿಮ್ಮ ದೇಹವನ್ನು ಸಮತೋಲನಗೊಳಿಸಿ, ನಿಮ್ಮ ಮನಸ್ಸನ್ನು ಶಾಂತಗೊಳಿಸಿ, ನಿಮ್ಮ ಜೀವನವನ್ನು ಬದಲಾಯಿಸಿ.',
      programs: 'ಕಾರ್ಯಕ್ರಮಗಳು',
      resources: 'ಸಂಪನ್ಮೂಲಗಳು',
      company: 'ಕಂಪನಿ',
      contactUs: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
      allRights: 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
      madeWith: 'ಯೋಗಿಗಳಿಗಾಗಿ ಪ್ರೀತಿಯಿಂದ ಮಾಡಲಾಗಿದೆ',
    },
    common: {
      learnMore: 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ',
      enrollNow: 'ಈಗ ನೋಂದಾಯಿಸಿ',
      bookNow: 'ಈಗ ಬುಕ್ ಮಾಡಿ',
      contactUs: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
      readMore: 'ಇನ್ನಷ್ಟು ಓದಿ',
    },
  },
  ml: {
    nav: {
      home: 'ഹോം',
      about: 'ഞങ്ങളെക്കുറിച്ച്',
      programs: 'പ്രോഗ്രാമുകൾ',
      asanas: 'ആസനങ്ങൾ',
      schedule: 'ഷെഡ്യൂൾ',
      gallery: 'ഗാലറി',
      login: 'ലോഗിൻ',
       contact: 'ബന്ധപ്പെടുക',
      joinNow: 'ഇപ്പോൾ ചേരുക',
      enterStudio: 'യോഗ സ്റ്റുഡിയോയിൽ പ്രവേശിക്കുക',
    },
    hero: {
      subtitle: 'ആന്തരിക ശാന്തി കണ്ടെത്തുക',
      title: 'നിങ്ങളുടെ ജീവിതം മാറ്റിമറിക്കുക',
      highlight: 'യോഗ',
      description: 'ആധുനിക സാങ്കേതിക വിദ്യകളോടെ യോഗയുടെ പുരാതന കലയനുഭവിക്കുക. ഞങ്ങളുടെ കമ്മ്യൂണിറ്റിയിൽ ചേരുക, ആരോഗ്യം, സന്തുലിതാവസ്ഥ, ആന്തരിക സമന്വയം എന്നിവയിലേക്കുള്ള നിങ്ങളുടെ യാത്ര ആരംഭിക്കുക.',
      startJourney: 'നിങ്ങളുടെ യാത്ര ആരംഭിക്കുക',
      explorePrograms: 'പ്രോഗ്രാമുകൾ പര്യവേക്ഷണം ചെയ്യുക',
      newHere: 'ഇവിടെ പുതിയവരാണോ?',
      startTrial: 'സൗജന്യ ട്രയൽ ക്ലാസ്സോടെ ആരംഭിക്കുക',
      stats: {
        students: 'സജീവ വിദ്യാർത്ഥികൾ',
        experience: 'വർഷങ്ങളുടെ അനുഭവം',
        programs: 'യോഗ പ്രോഗ്രാമുകൾ',
        rating: 'വിദ്യാർത്ഥി റേറ്റിംഗ്',
      },
    },
    programs: {
      title: 'പ്രായാനുസൃത പ്രോഗ്രാമുകൾ',
      subtitle: 'ജീവിതത്തിന്റെ എല്ലാ ഘട്ടങ്ങൾക്കും അനുയോജ്യമായ യോഗ പ്രോഗ്രാമുകൾ',
      kids: 'കുട്ടികളുടെ യോഗ',
      teens: 'കൗമാര യോഗ',
      adults: 'മുതിർന്നവരുടെ യോഗ',
      seniors: 'മുതിർന്ന പൗരന്മാരുടെ യോഗ',
      viewAll: 'എല്ലാ പ്രോഗ്രാമുകളും കാണുക',
    },
    features: {
      title: 'ഞങ്ങളെ എന്തുകൊണ്ട് തിരഞ്ഞെടുക്കണം',
      subtitle: 'ഹാർമണി വ്യത്യാസം',
      description: 'യോഗ അതിന്റെ യഥാർത്ഥ രൂപത്തിൽ അനുഭവിക്കുക - ശ്രദ്ധാപൂർവ്വം, പരിവർത്തനാത്മകം, ആഴത്തിൽ വ്യക്തിപരം.',
      breathAwareness: 'ശ്വസന അവബോധം',
      breathDesc: 'സമ്മർദ്ദ ശമനത്തിനും ഊർജ്ജത്തിനും പ്രാണായാമ സാങ്കേതിക വിദ്യകൾ സ്വായത്തമാക്കുക.',
      flexibleSchedule: 'ഫ്ലെക്സിബിൾ ഷെഡ്യൂൾ',
      scheduleDesc: 'നിങ്ങളുടെ ജീവിതശൈലിക്ക് അനുയോജ്യമായ രാവിലെ, വൈകുന്നേരം, വാരാന്ത്യ ക്ലാസുകൾ.',
      smallGroups: 'ചെറിയ ഗ്രൂപ്പുകൾ',
      groupsDesc: 'ചെറിയ ക്ലാസ് സൈസുകളോടെ വ്യക്തിഗത ശ്രദ്ധ.',
      certified: 'സർട്ടിഫൈഡ് ഇൻസ്ട്രക്ടർ',
      certifiedDesc: 'അനുഭവപരിചയമുള്ള, അന്താരാഷ്ട്ര തലത്തിൽ സർട്ടിഫൈ ചെയ്ത അദ്ധ്യാപകനിൽ നിന്ന് പഠിക്കുക.',
      holistic: 'സമഗ്ര സമീപനം',
      holisticDesc: 'ധ്യാനവും തത്ത്വചിന്തയും ഉപയോഗിച്ച് ശാരീരിക പരിശീലനം സന്തുലിതമാക്കുക.',
      community: 'പിന്തുണാ കമ്മ്യൂണിറ്റി',
      communityDesc: 'സഹ അഭ്യാസികളുടെ സ്വാഗത കമ്മ്യൂണിറ്റിയിൽ ചേരുക.',
    },
    testimonials: {
      title: 'വിദ്യാർത്ഥി കഥകൾ',
      subtitle: 'പരിവർത്തനത്തിന്റെ ശബ്ദങ്ങൾ',
      description: 'ഞങ്ങളുടെ കമ്മ്യൂണിറ്റി അംഗങ്ങളിൽ നിന്ന് അവരുടെ യോഗ യാത്രയെക്കുറിച്ച് കേൾക്കുക.',
    },
    cta: {
      title: 'നിങ്ങളുടെ യാത്ര ആരംഭിക്കാൻ തയ്യാറാണോ?',
      description: 'സന്തുലിതമായ, ശാന്തിപരമായ, ആരോഗ്യകരമായ ജീവിതത്തിലേക്കുള്ള ആദ്യ ചുവട് വയ്ക്കുക. ഇന്ന് തന്നെ ഞങ്ങളുടെ ശ്രദ്ധാപൂർവ്വമുള്ള അഭ്യാസികളുടെ കമ്മ്യൂണിറ്റിയിൽ ചേരുക.',
      startTrial: 'സൗജന്യ ട്രയൽ ആരംഭിക്കുക',
      viewSchedule: 'ഷെഡ്യൂൾ കാണുക',
      downloadBrochure: 'ബ്രോഷർ ഡൗൺലോഡ് ചെയ്യുക',
    },
    footer: {
      tagline: 'നിങ്ങളുടെ ശരീരത്തെ സന്തുലിതമാക്കുക, മനസ്സിനെ ശാന്തമാക്കുക, ജീവിതത്തെ മാറ്റിമറിക്കുക.',
      programs: 'പ്രോഗ്രാമുകൾ',
      resources: 'വിഭവങ്ങൾ',
      company: 'കമ്പനി',
      contactUs: 'ഞങ്ങളെ ബന്ധപ്പെടുക',
      allRights: 'എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.',
      madeWith: 'യോഗികൾക്കായി സ്നേഹത്തോടെ നിർമ്മിച്ചത്',
    },
    common: {
      learnMore: 'കൂടുതൽ അറിയുക',
      enrollNow: 'ഇപ്പോൾ എൻറോൾ ചെയ്യുക',
      bookNow: 'ഇപ്പോൾ ബുക്ക് ചെയ്യുക',
      contactUs: 'ഞങ്ങളെ ബന്ധപ്പെടുക',
      readMore: 'കൂടുതൽ വായിക്കുക',
    },
  },
  bn: {
    nav: {
      home: 'হোম',
      about: 'আমাদের সম্পর্কে',
      programs: 'প্রোগ্রাম',
      asanas: 'আসন',
      schedule: 'সময়সূচী',
      gallery: 'গ্যালারি',
      login: 'লগইন',
       contact: 'যোগাযোগ',
      joinNow: 'এখনই যোগ দিন',
      enterStudio: 'যোগ স্টুডিওতে প্রবেশ করুন',
    },
    hero: {
      subtitle: 'অভ্যন্তরীণ শান্তি আবিষ্কার করুন',
      title: 'আপনার জীবন রূপান্তর করুন',
      highlight: 'যোগ',
      description: 'আধুনিক কৌশলের সাথে যোগের প্রাচীন শিল্প অনুভব করুন। আমাদের সম্প্রদায়ে যোগ দিন এবং সুস্থতা, ভারসাম্য এবং অভ্যন্তরীণ সম্প্রীতির দিকে আপনার যাত্রা শুরু করুন।',
      startJourney: 'আপনার যাত্রা শুরু করুন',
      explorePrograms: 'প্রোগ্রাম অন্বেষণ করুন',
      newHere: 'এখানে নতুন?',
      startTrial: 'বিনামূল্যে ট্রায়াল ক্লাস দিয়ে শুরু করুন',
      stats: {
        students: 'সক্রিয় শিক্ষার্থী',
        experience: 'বছরের অভিজ্ঞতা',
        programs: 'যোগ প্রোগ্রাম',
        rating: 'শিক্ষার্থী রেটিং',
      },
    },
    programs: {
      title: 'বয়স অনুযায়ী প্রোগ্রাম',
      subtitle: 'জীবনের প্রতিটি পর্যায়ের জন্য উপযুক্ত যোগ প্রোগ্রাম',
      kids: 'শিশুদের যোগ',
      teens: 'কিশোরদের যোগ',
      adults: 'প্রাপ্তবয়স্কদের যোগ',
      seniors: 'প্রবীণদের যোগ',
      viewAll: 'সমস্ত প্রোগ্রাম দেখুন',
    },
    features: {
      title: 'কেন আমাদের বেছে নেবেন',
      subtitle: 'হার্মনি পার্থক্য',
      description: 'যোগকে তার প্রকৃত রূপে অনুভব করুন - সচেতন, রূপান্তরকারী এবং গভীরভাবে ব্যক্তিগত।',
      breathAwareness: 'শ্বাস সচেতনতা',
      breathDesc: 'স্ট্রেস রিলিফ এবং শক্তির জন্য প্রাণায়াম কৌশল আয়ত্ত করুন।',
      flexibleSchedule: 'নমনীয় সময়সূচী',
      scheduleDesc: 'আপনার জীবনধারার সাথে মানানসই সকাল, সন্ধ্যা এবং সপ্তাহান্তের ক্লাস।',
      smallGroups: 'ছোট দল',
      groupsDesc: 'ঘনিষ্ঠ ক্লাস সাইজের সাথে ব্যক্তিগত মনোযোগ।',
      certified: 'সার্টিফাইড প্রশিক্ষক',
      certifiedDesc: 'অভিজ্ঞ, আন্তর্জাতিকভাবে সার্টিফাইড শিক্ষকের কাছ থেকে শিখুন।',
      holistic: 'সামগ্রিক দৃষ্টিভঙ্গি',
      holisticDesc: 'ধ্যান এবং দর্শনের সাথে শারীরিক অনুশীলনের ভারসাম্য রাখুন।',
      community: 'সহায়ক সম্প্রদায়',
      communityDesc: 'সহ অনুশীলনকারীদের স্বাগত সম্প্রদায়ে যোগ দিন।',
    },
    testimonials: {
      title: 'শিক্ষার্থীদের গল্প',
      subtitle: 'রূপান্তরের কণ্ঠস্বর',
      description: 'আমাদের সম্প্রদায়ের সদস্যদের কাছ থেকে তাদের যোগ যাত্রা সম্পর্কে শুনুন।',
    },
    cta: {
      title: 'আপনার যাত্রা শুরু করতে প্রস্তুত?',
      description: 'ভারসাম্যপূর্ণ, শান্তিপূর্ণ এবং স্বাস্থ্যকর জীবনের দিকে প্রথম পদক্ষেপ নিন। আজই আমাদের সচেতন অনুশীলনকারীদের সম্প্রদায়ে যোগ দিন।',
      startTrial: 'বিনামূল্যে ট্রায়াল শুরু করুন',
      viewSchedule: 'সময়সূচী দেখুন',
      downloadBrochure: 'ব্রোশার ডাউনলোড করুন',
    },
    footer: {
      tagline: 'আপনার শরীরের ভারসাম্য রাখুন, মনকে শান্ত করুন, জীবন রূপান্তর করুন।',
      programs: 'প্রোগ্রাম',
      resources: 'সংস্থান',
      company: 'কোম্পানি',
      contactUs: 'যোগাযোগ করুন',
      allRights: 'সমস্ত অধিকার সংরক্ষিত।',
      madeWith: 'যোগীদের জন্য ভালোবাসায় তৈরি',
    },
    common: {
      learnMore: 'আরও জানুন',
      enrollNow: 'এখনই নথিভুক্ত করুন',
      bookNow: 'এখনই বুক করুন',
      contactUs: 'যোগাযোগ করুন',
      readMore: 'আরও পড়ুন',
    },
  },
  gu: {
    nav: {
      home: 'હોમ',
      about: 'અમારા વિશે',
      programs: 'કાર્યક્રમો',
      asanas: 'આસનો',
      schedule: 'સમયપત્રક',
      gallery: 'ગેલેરી',
      login: 'લોગિન',
       contact: 'સંપર્ક',
      joinNow: 'હમણાં જોડાઓ',
      enterStudio: 'યોગ સ્ટુડિયોમાં પ્રવેશ કરો',
    },
    hero: {
      subtitle: 'આંતરિક શાંતિ શોધો',
      title: 'તમારું જીવન બદલો',
      highlight: 'યોગ',
      description: 'આધુનિક તકનીકો સાથે યોગની પ્રાચીન કળાનો અનુભવ કરો. અમારા સમુદાયમાં જોડાઓ અને સ્વાસ્થ્ય, સંતુલન અને આંતરિક સુમેળ તરફ તમારી યાત્રા શરૂ કરો.',
      startJourney: 'તમારી યાત્રા શરૂ કરો',
      explorePrograms: 'કાર્યક્રમો જુઓ',
      newHere: 'અહીં નવા છો?',
      startTrial: 'મફત ટ્રાયલ ક્લાસ સાથે શરૂ કરો',
      stats: {
        students: 'સક્રિય વિદ્યાર્થીઓ',
        experience: 'વર્ષોનો અનુભવ',
        programs: 'યોગ કાર્યક્રમો',
        rating: 'વિદ્યાર્થી રેટિંગ',
      },
    },
    programs: {
      title: 'ઉંમર મુજબ કાર્યક્રમો',
      subtitle: 'જીવનના દરેક તબક્કા માટે અનુકૂળ યોગ કાર્યક્રમો',
      kids: 'બાળકોનો યોગ',
      teens: 'કિશોરોનો યોગ',
      adults: 'પુખ્તોનો યોગ',
      seniors: 'વરિષ્ઠોનો યોગ',
      viewAll: 'બધા કાર્યક્રમો જુઓ',
    },
    features: {
      title: 'અમને કેમ પસંદ કરો',
      subtitle: 'હાર્મની તફાવત',
      description: 'યોગનો અનુભવ કરો જેમ તે હોવું જોઈએ - સચેત, પરિવર્તનકારી અને ઊંડાણથી વ્યક્તિગત.',
      breathAwareness: 'શ્વાસ જાગૃતિ',
      breathDesc: 'તણાવ રાહત અને ઊર્જા માટે પ્રાણાયામ તકનીકોમાં નિપુણતા મેળવો.',
      flexibleSchedule: 'લવચીક સમયપત્રક',
      scheduleDesc: 'તમારી જીવનશૈલી સાથે મેળ ખાતા સવાર, સાંજ અને સપ્તાહાંત વર્ગો.',
      smallGroups: 'નાના જૂથો',
      groupsDesc: 'ઘનિષ્ઠ વર્ગ કદ સાથે વ્યક્તિગત ધ્યાન.',
      certified: 'પ્રમાણિત પ્રશિક્ષક',
      certifiedDesc: 'અનુભવી, આંતરરાષ્ટ્રીય રીતે પ્રમાણિત શિક્ષક પાસેથી શીખો.',
      holistic: 'સર્વગ્રાહી અભિગમ',
      holisticDesc: 'ધ્યાન અને ફિલોસોફી સાથે શારીરિક અભ્યાસનું સંતુલન.',
      community: 'સહાયક સમુદાય',
      communityDesc: 'સાથી અભ્યાસીઓના સ્વાગત સમુદાયમાં જોડાઓ.',
    },
    testimonials: {
      title: 'વિદ્યાર્થી વાર્તાઓ',
      subtitle: 'પરિવર્તનના અવાજો',
      description: 'અમારા સમુદાયના સભ્યો પાસેથી તેમની યોગ યાત્રા વિશે સાંભળો.',
    },
    cta: {
      title: 'તમારી યાત્રા શરૂ કરવા તૈયાર છો?',
      description: 'સંતુલિત, શાંતિપૂર્ણ અને સ્વસ્થ જીવન તરફ પ્રથમ પગલું ભરો. આજે જ અમારા સચેત અભ્યાસીઓના સમુદાયમાં જોડાઓ.',
      startTrial: 'મફત ટ્રાયલ શરૂ કરો',
      viewSchedule: 'સમયપત્રક જુઓ',
      downloadBrochure: 'બ્રોશર ડાઉનલોડ કરો',
    },
    footer: {
      tagline: 'તમારા શરીરનું સંતુલન કરો, મનને શાંત કરો, જીવન બદલો.',
      programs: 'કાર્યક્રમો',
      resources: 'સંસાધનો',
      company: 'કંપની',
      contactUs: 'અમારો સંપર્ક કરો',
      allRights: 'બધા હકો અનામત.',
      madeWith: 'યોગીઓ માટે પ્રેમથી બનાવેલું',
    },
    common: {
      learnMore: 'વધુ જાણો',
      enrollNow: 'હમણાં નોંધણી કરો',
      bookNow: 'હમણાં બુક કરો',
      contactUs: 'અમારો સંપર્ક કરો',
      readMore: 'વધુ વાંચો',
    },
  },
  mr: {
    nav: {
      home: 'मुख्यपृष्ठ',
      about: 'आमच्याबद्दल',
      programs: 'कार्यक्रम',
      asanas: 'आसने',
      schedule: 'वेळापत्रक',
      gallery: 'गॅलरी',
      login: 'लॉगिन',
       contact: 'संपर्क',
      joinNow: 'आता सामील व्हा',
      enterStudio: 'योग स्टुडिओमध्ये प्रवेश करा',
    },
    hero: {
      subtitle: 'आंतरिक शांती शोधा',
      title: 'आपले जीवन बदला',
      highlight: 'योग',
      description: 'आधुनिक तंत्रांसह योगाची प्राचीन कला अनुभवा. आमच्या समुदायात सामील व्हा आणि आरोग्य, संतुलन आणि आंतरिक सुसंवादाच्या दिशेने आपला प्रवास सुरू करा.',
      startJourney: 'आपला प्रवास सुरू करा',
      explorePrograms: 'कार्यक्रम पहा',
      newHere: 'येथे नवीन आहात?',
      startTrial: 'मोफत ट्रायल क्लासने सुरुवात करा',
      stats: {
        students: 'सक्रिय विद्यार्थी',
        experience: 'वर्षांचा अनुभव',
        programs: 'योग कार्यक्रम',
        rating: 'विद्यार्थी रेटिंग',
      },
    },
    programs: {
      title: 'वयोगटानुसार कार्यक्रम',
      subtitle: 'जीवनाच्या प्रत्येक टप्प्यासाठी अनुकूल योग कार्यक्रम',
      kids: 'मुलांचा योग',
      teens: 'किशोरवयीन योग',
      adults: 'प्रौढांचा योग',
      seniors: 'ज्येष्ठांचा योग',
      viewAll: 'सर्व कार्यक्रम पहा',
    },
    features: {
      title: 'आम्हाला का निवडावे',
      subtitle: 'हार्मनी फरक',
      description: 'योगाचा अनुभव घ्या जसा तो असावा - सजग, परिवर्तनकारी आणि खोलवर वैयक्तिक.',
      breathAwareness: 'श्वास जागृती',
      breathDesc: 'तणाव आराम आणि ऊर्जेसाठी प्राणायाम तंत्रांमध्ये प्रभुत्व मिळवा.',
      flexibleSchedule: 'लवचिक वेळापत्रक',
      scheduleDesc: 'आपल्या जीवनशैलीशी जुळणारे सकाळ, संध्याकाळ आणि शनिवार-रविवार वर्ग.',
      smallGroups: 'लहान गट',
      groupsDesc: 'जवळीक वर्ग आकारांसह वैयक्तिक लक्ष.',
      certified: 'प्रमाणित प्रशिक्षक',
      certifiedDesc: 'अनुभवी, आंतरराष्ट्रीय स्तरावर प्रमाणित शिक्षकाकडून शिका.',
      holistic: 'समग्र दृष्टिकोन',
      holisticDesc: 'ध्यान आणि तत्त्वज्ञानासह शारीरिक सरावाचा समतोल साधा.',
      community: 'सहाय्यक समुदाय',
      communityDesc: 'सहकारी अभ्यासकांच्या स्वागत समुदायात सामील व्हा.',
    },
    testimonials: {
      title: 'विद्यार्थी कथा',
      subtitle: 'परिवर्तनाचे आवाज',
      description: 'आमच्या समुदाय सदस्यांकडून त्यांच्या योग प्रवासाबद्दल ऐका.',
    },
    cta: {
      title: 'आपला प्रवास सुरू करण्यास तयार आहात?',
      description: 'संतुलित, शांत आणि निरोगी जीवनाच्या दिशेने पहिले पाऊल टाका. आजच आमच्या सजग अभ्यासकांच्या समुदायात सामील व्हा.',
      startTrial: 'मोफत ट्रायल सुरू करा',
      viewSchedule: 'वेळापत्रक पहा',
      downloadBrochure: 'ब्रोशर डाउनलोड करा',
    },
    footer: {
      tagline: 'आपल्या शरीराचा समतोल साधा, मनाला शांत करा, जीवन बदला.',
      programs: 'कार्यक्रम',
      resources: 'संसाधने',
      company: 'कंपनी',
      contactUs: 'आमच्याशी संपर्क साधा',
      allRights: 'सर्व हक्क राखीव.',
      madeWith: 'योगींसाठी प्रेमाने बनवलेले',
    },
    common: {
      learnMore: 'अधिक जाणून घ्या',
      enrollNow: 'आता नोंदणी करा',
      bookNow: 'आता बुक करा',
      contactUs: 'आमच्याशी संपर्क साधा',
      readMore: 'अधिक वाचा',
    },
  },
  pa: {
    nav: {
      home: 'ਹੋਮ',
      about: 'ਸਾਡੇ ਬਾਰੇ',
      programs: 'ਪ੍ਰੋਗਰਾਮ',
      asanas: 'ਆਸਣ',
      schedule: 'ਸਮਾਂ-ਸਾਰਣੀ',
      gallery: 'ਗੈਲਰੀ',
      login: 'ਲੌਗਿਨ',
       contact: 'ਸੰਪਰਕ',
      joinNow: 'ਹੁਣੇ ਸ਼ਾਮਲ ਹੋਵੋ',
      enterStudio: 'ਯੋਗਾ ਸਟੂਡੀਓ ਵਿੱਚ ਦਾਖਲ ਹੋਵੋ',
    },
    hero: {
      subtitle: 'ਅੰਦਰੂਨੀ ਸ਼ਾਂਤੀ ਖੋਜੋ',
      title: 'ਆਪਣੀ ਜ਼ਿੰਦਗੀ ਬਦਲੋ',
      highlight: 'ਯੋਗਾ',
      description: 'ਆਧੁਨਿਕ ਤਕਨੀਕਾਂ ਨਾਲ ਯੋਗਾ ਦੀ ਪ੍ਰਾਚੀਨ ਕਲਾ ਦਾ ਅਨੁਭਵ ਕਰੋ। ਸਾਡੇ ਭਾਈਚਾਰੇ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ ਅਤੇ ਤੰਦਰੁਸਤੀ, ਸੰਤੁਲਨ ਅਤੇ ਅੰਦਰੂਨੀ ਸਦਭਾਵਨਾ ਵੱਲ ਆਪਣੀ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ।',
      startJourney: 'ਆਪਣੀ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ',
      explorePrograms: 'ਪ੍ਰੋਗਰਾਮ ਖੋਜੋ',
      newHere: 'ਇੱਥੇ ਨਵੇਂ ਹੋ?',
      startTrial: 'ਮੁਫ਼ਤ ਟ੍ਰਾਇਲ ਕਲਾਸ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ',
      stats: {
        students: 'ਸਰਗਰਮ ਵਿਦਿਆਰਥੀ',
        experience: 'ਸਾਲਾਂ ਦਾ ਤਜਰਬਾ',
        programs: 'ਯੋਗਾ ਪ੍ਰੋਗਰਾਮ',
        rating: 'ਵਿਦਿਆਰਥੀ ਰੇਟਿੰਗ',
      },
    },
    programs: {
      title: 'ਉਮਰ ਅਨੁਸਾਰ ਪ੍ਰੋਗਰਾਮ',
      subtitle: 'ਜੀਵਨ ਦੇ ਹਰ ਪੜਾਅ ਲਈ ਅਨੁਕੂਲ ਯੋਗਾ ਪ੍ਰੋਗਰਾਮ',
      kids: 'ਬੱਚਿਆਂ ਦਾ ਯੋਗਾ',
      teens: 'ਕਿਸ਼ੋਰਾਂ ਦਾ ਯੋਗਾ',
      adults: 'ਬਾਲਗਾਂ ਦਾ ਯੋਗਾ',
      seniors: 'ਬਜ਼ੁਰਗਾਂ ਦਾ ਯੋਗਾ',
      viewAll: 'ਸਾਰੇ ਪ੍ਰੋਗਰਾਮ ਦੇਖੋ',
    },
    features: {
      title: 'ਸਾਨੂੰ ਕਿਉਂ ਚੁਣੋ',
      subtitle: 'ਹਾਰਮਨੀ ਫਰਕ',
      description: 'ਯੋਗਾ ਦਾ ਅਨੁਭਵ ਕਰੋ ਜਿਵੇਂ ਇਹ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ - ਸੁਚੇਤ, ਪਰਿਵਰਤਨਸ਼ੀਲ ਅਤੇ ਡੂੰਘਾਈ ਨਾਲ ਨਿੱਜੀ।',
      breathAwareness: 'ਸਾਹ ਜਾਗਰੂਕਤਾ',
      breathDesc: 'ਤਣਾਅ ਰਾਹਤ ਅਤੇ ਊਰਜਾ ਲਈ ਪ੍ਰਾਣਾਯਾਮ ਤਕਨੀਕਾਂ ਵਿੱਚ ਮੁਹਾਰਤ ਹਾਸਲ ਕਰੋ।',
      flexibleSchedule: 'ਲਚਕੀਲੀ ਸਮਾਂ-ਸਾਰਣੀ',
      scheduleDesc: 'ਤੁਹਾਡੀ ਜੀਵਨਸ਼ੈਲੀ ਅਨੁਸਾਰ ਸਵੇਰੇ, ਸ਼ਾਮ ਅਤੇ ਹਫ਼ਤੇ ਦੇ ਅੰਤ ਦੀਆਂ ਕਲਾਸਾਂ।',
      smallGroups: 'ਛੋਟੇ ਗਰੁੱਪ',
      groupsDesc: 'ਨੇੜਲੇ ਕਲਾਸ ਆਕਾਰਾਂ ਨਾਲ ਨਿੱਜੀ ਧਿਆਨ।',
      certified: 'ਪ੍ਰਮਾਣਿਤ ਇੰਸਟ੍ਰਕਟਰ',
      certifiedDesc: 'ਤਜਰਬੇਕਾਰ, ਅੰਤਰਰਾਸ਼ਟਰੀ ਪੱਧਰ \'ਤੇ ਪ੍ਰਮਾਣਿਤ ਅਧਿਆਪਕ ਤੋਂ ਸਿੱਖੋ।',
      holistic: 'ਸੰਪੂਰਨ ਪਹੁੰਚ',
      holisticDesc: 'ਧਿਆਨ ਅਤੇ ਦਰਸ਼ਨ ਨਾਲ ਸਰੀਰਕ ਅਭਿਆਸ ਨੂੰ ਸੰਤੁਲਿਤ ਕਰੋ।',
      community: 'ਸਹਾਇਕ ਭਾਈਚਾਰਾ',
      communityDesc: 'ਸਾਥੀ ਅਭਿਆਸੀਆਂ ਦੇ ਸੁਆਗਤ ਭਾਈਚਾਰੇ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ।',
    },
    testimonials: {
      title: 'ਵਿਦਿਆਰਥੀ ਕਹਾਣੀਆਂ',
      subtitle: 'ਪਰਿਵਰਤਨ ਦੀਆਂ ਆਵਾਜ਼ਾਂ',
      description: 'ਸਾਡੇ ਭਾਈਚਾਰੇ ਦੇ ਮੈਂਬਰਾਂ ਤੋਂ ਉਨ੍ਹਾਂ ਦੀ ਯੋਗਾ ਯਾਤਰਾ ਬਾਰੇ ਸੁਣੋ।',
    },
    cta: {
      title: 'ਆਪਣੀ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਤਿਆਰ ਹੋ?',
      description: 'ਸੰਤੁਲਿਤ, ਸ਼ਾਂਤੀਪੂਰਨ ਅਤੇ ਸਿਹਤਮੰਦ ਜੀਵਨ ਵੱਲ ਪਹਿਲਾ ਕਦਮ ਚੁੱਕੋ। ਅੱਜ ਹੀ ਸਾਡੇ ਸੁਚੇਤ ਅਭਿਆਸੀਆਂ ਦੇ ਭਾਈਚਾਰੇ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ।',
      startTrial: 'ਮੁਫ਼ਤ ਟ੍ਰਾਇਲ ਸ਼ੁਰੂ ਕਰੋ',
      viewSchedule: 'ਸਮਾਂ-ਸਾਰਣੀ ਦੇਖੋ',
      downloadBrochure: 'ਬ੍ਰੋਸ਼ਰ ਡਾਊਨਲੋਡ ਕਰੋ',
    },
    footer: {
      tagline: 'ਆਪਣੇ ਸਰੀਰ ਨੂੰ ਸੰਤੁਲਿਤ ਕਰੋ, ਮਨ ਨੂੰ ਸ਼ਾਂਤ ਕਰੋ, ਜੀਵਨ ਬਦਲੋ।',
      programs: 'ਪ੍ਰੋਗਰਾਮ',
      resources: 'ਸਰੋਤ',
      company: 'ਕੰਪਨੀ',
      contactUs: 'ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',
      allRights: 'ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।',
      madeWith: 'ਯੋਗੀਆਂ ਲਈ ਪਿਆਰ ਨਾਲ ਬਣਾਇਆ',
    },
    common: {
      learnMore: 'ਹੋਰ ਜਾਣੋ',
      enrollNow: 'ਹੁਣੇ ਦਾਖਲਾ ਲਓ',
      bookNow: 'ਹੁਣੇ ਬੁੱਕ ਕਰੋ',
      contactUs: 'ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',
      readMore: 'ਹੋਰ ਪੜ੍ਹੋ',
    },
  },
  or: {
    nav: {
      home: 'ହୋମ',
      about: 'ଆମ ବିଷୟରେ',
      programs: 'କାର୍ଯ୍ୟକ୍ରମ',
      asanas: 'ଆସନ',
      schedule: 'ସମୟସୂଚୀ',
      gallery: 'ଗ୍ୟାଲେରୀ',
      login: 'ଲଗଇନ',
       contact: 'ଯୋଗାଯୋଗ',
      joinNow: 'ବର୍ତ୍ତମାନ ଯୋଗ ଦିଅନ୍ତୁ',
      enterStudio: 'ଯୋଗ ଷ୍ଟୁଡିଓରେ ପ୍ରବେଶ କରନ୍ତୁ',
    },
    hero: {
      subtitle: 'ଆଭ୍ୟନ୍ତରୀଣ ଶାନ୍ତି ଖୋଜନ୍ତୁ',
      title: 'ଆପଣଙ୍କ ଜୀବନ ବଦଳାନ୍ତୁ',
      highlight: 'ଯୋଗ',
      description: 'ଆଧୁନିକ ପ୍ରଯୁକ୍ତିବିଦ୍ୟା ସହ ଯୋଗର ପ୍ରାଚୀନ କଳା ଅନୁଭବ କରନ୍ତୁ। ଆମ ସମ୍ପ୍ରଦାୟରେ ଯୋଗ ଦିଅନ୍ତୁ ଏବଂ ସ୍ୱାସ୍ଥ୍ୟ, ସନ୍ତୁଳନ ଏବଂ ଆଭ୍ୟନ୍ତରୀଣ ସାମଞ୍ଜସ୍ୟ ଆଡ଼କୁ ଆପଣଙ୍କ ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ।',
      startJourney: 'ଆପଣଙ୍କ ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ',
      explorePrograms: 'କାର୍ଯ୍ୟକ୍ରମ ଅନ୍ୱେଷଣ କରନ୍ତୁ',
      newHere: 'ଏଠାରେ ନୂଆ?',
      startTrial: 'ମାଗଣା ଟ୍ରାଏଲ କ୍ଲାସ ସହ ଆରମ୍ଭ କରନ୍ତୁ',
      stats: {
        students: 'ସକ୍ରିୟ ଛାତ୍ର',
        experience: 'ବର୍ଷର ଅଭିଜ୍ଞତା',
        programs: 'ଯୋଗ କାର୍ଯ୍ୟକ୍ରମ',
        rating: 'ଛାତ୍ର ରେଟିଂ',
      },
    },
    programs: {
      title: 'ବୟସ ଅନୁସାରେ କାର୍ଯ୍ୟକ୍ରମ',
      subtitle: 'ଜୀବନର ପ୍ରତ୍ୟେକ ପର୍ଯ୍ୟାୟ ପାଇଁ ଅନୁକୂଳ ଯୋଗ କାର୍ଯ୍ୟକ୍ରମ',
      kids: 'ପିଲାମାନଙ୍କ ଯୋଗ',
      teens: 'କିଶୋର ଯୋଗ',
      adults: 'ବୟସ୍କ ଯୋଗ',
      seniors: 'ବରିଷ୍ଠ ଯୋଗ',
      viewAll: 'ସମସ୍ତ କାର୍ଯ୍ୟକ୍ରମ ଦେଖନ୍ତୁ',
    },
    features: {
      title: 'ଆମକୁ କାହିଁକି ବାଛନ୍ତୁ',
      subtitle: 'ହାର୍ମନୀ ପାର୍ଥକ୍ୟ',
      description: 'ଯୋଗକୁ ଅନୁଭବ କରନ୍ତୁ ଯେପରି ଏହା ହେବା ଉଚିତ - ସଚେତନ, ପରିବର୍ତ୍ତନକାରୀ ଏବଂ ଗଭୀର ଭାବରେ ବ୍ୟକ୍ତିଗତ।',
      breathAwareness: 'ଶ୍ୱାସ ସଚେତନତା',
      breathDesc: 'ଚାପ ଉପଶମ ଏବଂ ଶକ୍ତି ପାଇଁ ପ୍ରାଣାୟାମ ପ୍ରଯୁକ୍ତିରେ ଦକ୍ଷତା ହାସଲ କରନ୍ତୁ।',
      flexibleSchedule: 'ନମନୀୟ ସମୟସୂଚୀ',
      scheduleDesc: 'ଆପଣଙ୍କ ଜୀବନଶୈଳୀ ସହ ମେଳ ଖାଉଥିବା ସକାଳ, ସନ୍ଧ୍ୟା ଏବଂ ସପ୍ତାହାନ୍ତ କ୍ଲାସ।',
      smallGroups: 'ଛୋଟ ଗୋଷ୍ଠୀ',
      groupsDesc: 'ଘନିଷ୍ଠ କ୍ଲାସ ଆକାର ସହ ବ୍ୟକ୍ତିଗତ ଧ୍ୟାନ।',
      certified: 'ପ୍ରମାଣିତ ପ୍ରଶିକ୍ଷକ',
      certifiedDesc: 'ଅଭିଜ୍ଞ, ଆନ୍ତର୍ଜାତୀୟ ସ୍ତରରେ ପ୍ରମାଣିତ ଶିକ୍ଷକଙ୍କ ଠାରୁ ଶିଖନ୍ତୁ।',
      holistic: 'ସମଗ୍ର ଦୃଷ୍ଟିକୋଣ',
      holisticDesc: 'ଧ୍ୟାନ ଏବଂ ଦର୍ଶନ ସହ ଶାରୀରିକ ଅଭ୍ୟାସକୁ ସନ୍ତୁଳିତ କରନ୍ତୁ।',
      community: 'ସହାୟକ ସମ୍ପ୍ରଦାୟ',
      communityDesc: 'ସହଯୋଗୀ ଅଭ୍ୟାସକାରୀମାନଙ୍କ ସ୍ୱାଗତ ସମ୍ପ୍ରଦାୟରେ ଯୋଗ ଦିଅନ୍ତୁ।',
    },
    testimonials: {
      title: 'ଛାତ୍ର କାହାଣୀ',
      subtitle: 'ପରିବର୍ତ୍ତନର ସ୍ୱର',
      description: 'ଆମ ସମ୍ପ୍ରଦାୟ ସଦସ୍ୟମାନଙ୍କ ଠାରୁ ସେମାନଙ୍କ ଯୋଗ ଯାତ୍ରା ବିଷୟରେ ଶୁଣନ୍ତୁ।',
    },
    cta: {
      title: 'ଆପଣଙ୍କ ଯାତ୍ରା ଆରମ୍ଭ କରିବାକୁ ପ୍ରସ୍ତୁତ?',
      description: 'ସନ୍ତୁଳିତ, ଶାନ୍ତିପୂର୍ଣ୍ଣ ଏବଂ ସ୍ୱାସ୍ଥ୍ୟକର ଜୀବନ ଆଡ଼କୁ ପ୍ରଥମ ପାଦ ପକାନ୍ତୁ। ଆଜି ଆମ ସଚେତନ ଅଭ୍ୟାସକାରୀମାନଙ୍କ ସମ୍ପ୍ରଦାୟରେ ଯୋଗ ଦିଅନ୍ତୁ।',
      startTrial: 'ମାଗଣା ଟ୍ରାଏଲ ଆରମ୍ଭ କରନ୍ତୁ',
      viewSchedule: 'ସମୟସୂଚୀ ଦେଖନ୍ତୁ',
      downloadBrochure: 'ବ୍ରୋସର ଡାଉନଲୋଡ କରନ୍ତୁ',
    },
    footer: {
      tagline: 'ଆପଣଙ୍କ ଶରୀରକୁ ସନ୍ତୁଳିତ କରନ୍ତୁ, ମନକୁ ଶାନ୍ତ କରନ୍ତୁ, ଜୀବନ ବଦଳାନ୍ତୁ।',
      programs: 'କାର୍ଯ୍ୟକ୍ରମ',
      resources: 'ସମ୍ବଳ',
      company: 'କମ୍ପାନୀ',
      contactUs: 'ଆମ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ',
      allRights: 'ସମସ୍ତ ଅଧିକାର ସଂରକ୍ଷିତ।',
      madeWith: 'ଯୋଗୀମାନଙ୍କ ପାଇଁ ପ୍ରେମରେ ତିଆରି',
    },
    common: {
      learnMore: 'ଅଧିକ ଜାଣନ୍ତୁ',
      enrollNow: 'ବର୍ତ୍ତମାନ ନାମ ଲେଖାନ୍ତୁ',
      bookNow: 'ବର୍ତ୍ତମାନ ବୁକ କରନ୍ତୁ',
      contactUs: 'ଆମ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ',
      readMore: 'ଅଧିକ ପଢ଼ନ୍ତୁ',
    },
  },
};
