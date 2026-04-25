/* ============================================================
   NAMMA OORU – script.js
   Full app logic: Auth, Shops, Map, Feedback, Admin, Realtime
   ============================================================ */

/* ===================== CONFIG ===================== */
const CONFIG = {
  SUPABASE_URL: 'YOUR_SUPABASE_URL',
  SUPABASE_KEY: 'YOUR_SUPABASE_ANON_KEY',
  ADMIN_PASSWORD: 'nammaooru@admin',
  NOTICE_PASSWORD: 'notice',
  DEMO_MODE: true // Set false + fill above for production
};

/* ===================== I18N ===================== */
const TRANSLATIONS = {
  en: {
    appTagline: 'Your Local Guide',
    phonePlaceholder: 'Enter phone number',
    phoneLabel: 'Phone Number',
    otpLabel: 'Enter OTP',
    sendOtp: 'Send OTP',
    verifyOtp: 'Verify OTP',
    backBtn: '← Change Number',
    otpSentPrefix: 'OTP sent to +91 ',
    tabShops: 'Shops',
    tabMap: 'Map',
    tabFeedback: 'Feedback',
    searchPlaceholder: 'Search shops, services...',
    addShopTitle: 'Add New Shop',
    noNotice: 'No notices',
    locationGetting: 'Getting location…',
    callBtn: '📞 Call',
    mapBtn: '🗺️ Map',
    feedbackTitle: 'Send Feedback',
    feedbackPlaceholder: 'Your feedback...',
    submitFeedback: 'Submit Feedback',
    ratingLabel: 'Rating:',
    feedbackSuccess: '✅ Feedback submitted! Thank you.',
    noShops: 'No shops found',
    callLimitWarn: 'Call limit: {remaining} calls left today',
    distanceUnit: 'km away',
    closedLabel: 'Closed',
    loginTagline: 'Your Local Guide',
    demoLoginBtn: 'Continue as Guest (Demo)',
    adminVerifyMsg: 'Enter admin password to add shop',
    addShopBtn: 'Add Shop'
  },
  kn: {
    appTagline: 'ನಿಮ್ಮ ಸ್ಥಳೀಯ ಮಾರ್ಗದರ್ಶಿ',
    phonePlaceholder: 'ಫೋನ್ ನಂಬರ್ ನಮೂದಿಸಿ',
    phoneLabel: 'ಫೋನ್ ನಂಬರ್',
    otpLabel: 'OTP ನಮೂದಿಸಿ',
    sendOtp: 'OTP ಕಳುಹಿಸಿ',
    verifyOtp: 'OTP ಪರಿಶೀಲಿಸಿ',
    backBtn: '← ನಂಬರ್ ಬದಲಾಯಿಸಿ',
    otpSentPrefix: '+91 ಗೆ OTP ಕಳುಹಿಸಲಾಗಿದೆ ',
    tabShops: 'ಅಂಗಡಿಗಳು',
    tabMap: 'ನಕ್ಷೆ',
    tabFeedback: 'ಅಭಿಪ್ರಾಯ',
    searchPlaceholder: 'ಅಂಗಡಿ, ಸೇವೆ ಹುಡುಕಿ...',
    addShopTitle: 'ಹೊಸ ಅಂಗಡಿ ಸೇರಿಸಿ',
    noNotice: 'ಯಾವುದೇ ಸೂಚನೆ ಇಲ್ಲ',
    locationGetting: 'ಸ್ಥಳ ಪಡೆಯಲಾಗುತ್ತಿದೆ…',
    callBtn: '📞 ಕರೆ',
    mapBtn: '🗺️ ನಕ್ಷೆ',
    feedbackTitle: 'ಅಭಿಪ್ರಾಯ ಕಳುಹಿಸಿ',
    feedbackPlaceholder: 'ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ...',
    submitFeedback: 'ಅಭಿಪ್ರಾಯ ಸಲ್ಲಿಸಿ',
    ratingLabel: 'ರೇಟಿಂಗ್:',
    feedbackSuccess: '✅ ಅಭಿಪ್ರಾಯ ಸಲ್ಲಿಸಲಾಗಿದೆ! ಧನ್ಯವಾದ.',
    noShops: 'ಅಂಗಡಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    callLimitWarn: 'ಕರೆ ಮಿತಿ: ಇಂದು {remaining} ಕರೆಗಳು ಉಳಿದಿವೆ',
    distanceUnit: 'ಕಿ.ಮೀ ದೂರ',
    closedLabel: 'ಮುಚ್ಚಿದೆ',
    loginTagline: 'ನಿಮ್ಮ ಸ್ಥಳೀಯ ಮಾರ್ಗದರ್ಶಿ',
    demoLoginBtn: 'ಅತಿಥಿಯಾಗಿ ಮುಂದುವರಿಸಿ (ಡೆಮೋ)',
    adminVerifyMsg: 'ಅಂಗಡಿ ಸೇರಿಸಲು ಅಡ್ಮಿನ್ ಪಾಸ್ವರ್ಡ್ ನಮೂದಿಸಿ',
    addShopBtn: 'ಅಂಗಡಿ ಸೇರಿಸಿ'
  }
};

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DAYS_KN = ['ಭಾನು','ಸೋಮ','ಮಂಗಳ','ಬುಧ','ಗುರು','ಶುಕ್ರ','ಶನಿ'];

const CAT_ICONS = {
  Grocery:'🛒', Medical:'💊', Hardware:'🔨', Vegetable:'🥦',
  Dairy:'🥛', Tailoring:'🧵', Electrical:'⚡', Plumber:'🔧',
  Labour:'👷', Mechanic:'🔩', Hotel:'🍛', Salon:'✂️', Other:'🏪'
};

/* ===================== DEMO DATA ===================== */
const DEMO_SHOPS = [
  { id:1, name:'Raju Grocery Store', category:'Grocery', phone:'9876543210',
    address:'Main Road, Near Bus Stand, Hosapete', lat:15.2706, lng:76.3998,
    timings:{Mon:'8AM-9PM',Tue:'8AM-9PM',Wed:'8AM-9PM',Thu:'8AM-9PM',Fri:'8AM-9PM',Sat:'8AM-9PM',Sun:'9AM-1PM'},
    extra:'Fresh vegetables daily', image_url:null },
  { id:2, name:'Lakshmi Medical Store', category:'Medical', phone:'9845012345',
    address:'Gandhi Nagar, Hospet', lat:15.2750, lng:76.4010,
    timings:{Mon:'8AM-10PM',Tue:'8AM-10PM',Wed:'8AM-10PM',Thu:'8AM-10PM',Fri:'8AM-10PM',Sat:'8AM-10PM',Sun:'10AM-2PM'},
    extra:'All medicines available. Doctor consultation available.', image_url:null },
  { id:3, name:'Suresh Hardware', category:'Hardware', phone:'9900112233',
    address:'Old Market Street, Hospet', lat:15.2680, lng:76.3970,
    timings:{Mon:'9AM-7PM',Tue:'9AM-7PM',Wed:'9AM-7PM',Thu:'9AM-7PM',Fri:'9AM-7PM',Sat:'9AM-7PM',Sun:'Closed'},
    extra:'Building materials, paints, tools', image_url:null },
  { id:4, name:'Meena Tailoring', category:'Tailoring', phone:'9988776655',
    address:'Temple Street, Hosapete', lat:15.2720, lng:76.4030,
    timings:{Mon:'10AM-6PM',Tue:'10AM-6PM',Wed:'Closed',Thu:'10AM-6PM',Fri:'10AM-6PM',Sat:'10AM-6PM',Sun:'Closed'},
    extra:'Ladies & Gents stitching. Blouse pieces.', image_url:null },
  { id:5, name:'Auto Mechanic – Ravi Works', category:'Mechanic', phone:'9876012345',
    address:'NH63 Bypass Road, Hospet', lat:15.2640, lng:76.3940,
    timings:{Mon:'8AM-8PM',Tue:'8AM-8PM',Wed:'8AM-8PM',Thu:'8AM-8PM',Fri:'8AM-8PM',Sat:'8AM-8PM',Sun:'9AM-2PM'},
    extra:'Two wheeler and four wheeler repairs', image_url:null },
];

const DEMO_EMERGENCY = [
  { id:1, name:'Ambulance', number:'108', icon:'🚑' },
  { id:2, name:'Police', number:'100', icon:'🚔' },
  { id:3, name:'Fire', number:'101', icon:'🔥' },
];

const DEMO_FEEDBACK = [
  { id:1, text:'Very useful app! Found the medical shop easily.', rating:5, created_at: new Date(Date.now()-86400000).toISOString() },
  { id:2, text:'Good collection of local shops.', rating:4, created_at: new Date(Date.now()-172800000).toISOString() },
];

/* ===================== STATE ===================== */
let sb = null;
let currentLang = 'en';
let currentUser = null;
let userLat = null, userLng = null;
let allShops = [];
let filteredShops = [];
let selectedCategory = 'all';
let searchQuery = '';
let currentRating = 0;
let mapInstance = null;
let mapMarkers = [];
let addAdminVerified = false;
let shopToEdit = null;
let realtimeSubs = [];
let deviceId = getDeviceId();
let callCounts = JSON.parse(localStorage.getItem('callCounts') || '{}');
let revealCounts = JSON.parse(localStorage.getItem('revealCounts') || '{}');

/* ===================== DEVICE ID ===================== */
function getDeviceId() {
  let id = localStorage.getItem('namma_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substr(2,12) + Date.now().toString(36);
    localStorage.setItem('namma_device_id', id);
  }
  return id;
}

function todayKey() {
  return new Date().toISOString().slice(0,10);
}

/* ===================== SUPABASE INIT ===================== */
function initSupabase() {
  if (CONFIG.DEMO_MODE) return null;
  try {
    return supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
  } catch(e) {
    console.warn('Supabase init failed, falling back to demo mode');
    CONFIG.DEMO_MODE = true;
    return null;
  }
}

/* ===================== TRANSLATION HELPER ===================== */
function t(key) {
  return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['en'][key] || key;
}

/* ===================== LANGUAGE SELECTION ===================== */
function selectLang(lang) {
  currentLang = lang;
  localStorage.setItem('namma_lang', lang);
  document.getElementById('langScreen').classList.add('hidden');
  applyLanguage();
  checkBlockedAndInit();
}

function applyLanguage() {
  const l = TRANSLATIONS[currentLang];
  const el = (id) => document.getElementById(id);
  if (el('loginTagline')) el('loginTagline').textContent = l.appTagline;
  if (el('phoneLabel')) el('phoneLabel').textContent = l.phoneLabel;
  if (el('sendOtpText')) el('sendOtpText').textContent = l.sendOtp;
  if (el('verifyOtpText')) el('verifyOtpText').textContent = l.verifyOtp;
  if (el('otpLabel')) el('otpLabel').textContent = l.otpLabel;
  if (el('backBtn')) el('backBtn').textContent = l.backBtn;
  if (el('tabShops')) el('tabShops').textContent = l.tabShops;
  if (el('tabMap')) el('tabMap').textContent = l.tabMap;
  if (el('tabFeedback')) el('tabFeedback').textContent = l.tabFeedback;
  if (el('searchInput')) el('searchInput').placeholder = l.searchPlaceholder;
  if (el('addShopTitle')) el('addShopTitle').textContent = l.addShopTitle;
  if (el('feedbackTitle')) el('feedbackTitle').textContent = l.feedbackTitle;
  if (el('feedbackText')) el('feedbackText').placeholder = l.feedbackPlaceholder;
  if (el('submitFeedbackBtn')) el('submitFeedbackBtn').textContent = l.submitFeedback;
  if (el('ratingLabel')) el('ratingLabel').textContent = l.ratingLabel;
  if (el('noticeText') && el('noticeText').textContent === 'No notices') el('noticeText').textContent = l.noNotice;
  if (el('locationText') && el('locationText').textContent === 'Getting location…') el('locationText').textContent = l.locationGetting;
}

/* ===================== BLOCK CHECK ===================== */
async function checkBlockedAndInit() {
  if (!CONFIG.DEMO_MODE && sb) {
    const { data } = await sb.from('blocked_devices').select('device_id').eq('device_id', deviceId).single();
    if (data) {
      showBlocked();
      return;
    }
  }
  showLoginScreen();
}

function showBlocked() {
  document.getElementById('blockedScreen').classList.remove('hidden');
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('blockedTitle').textContent = t('blockedTitle') || 'Access Blocked';
  document.getElementById('blockedMsg').textContent = 'Your device has been blocked by the administrator.';
}

/* ===================== SHOW LOGIN ===================== */
function showLoginScreen() {
  document.getElementById('loginScreen').classList.remove('hidden');
  applyLanguage();
  if (CONFIG.DEMO_MODE) {
    document.getElementById('demoModeBanner').classList.remove('hidden');
    document.getElementById('demoLoginBtn').classList.remove('hidden');
  }
}

/* ===================== OTP AUTH ===================== */
async function sendOTP() {
  const phone = document.getElementById('phoneInput').value.trim();
  const errEl = document.getElementById('loginError');
  errEl.classList.add('hidden');

  if (!/^\d{10}$/.test(phone)) {
    showError(errEl, 'Please enter a valid 10-digit phone number.');
    return;
  }

  if (CONFIG.DEMO_MODE) {
    // In demo mode, skip OTP
    document.getElementById('otpPhone').textContent = phone;
    document.getElementById('phoneStep').classList.add('hidden');
    document.getElementById('otpStep').classList.remove('hidden');
    return;
  }

  setLoading('sendOtpBtn','sendOtpText','sendOtpLoader',true);
  try {
    const { error } = await sb.auth.signInWithOtp({ phone: '+91' + phone });
    if (error) throw error;
    document.getElementById('otpPhone').textContent = phone;
    document.getElementById('phoneStep').classList.add('hidden');
    document.getElementById('otpStep').classList.remove('hidden');
  } catch(e) {
    showError(errEl, e.message || 'Failed to send OTP. Try again.');
  }
  setLoading('sendOtpBtn','sendOtpText','sendOtpLoader',false);
}

async function verifyOTP() {
  const phone = document.getElementById('phoneInput').value.trim();
  const otp = document.getElementById('otpInput').value.trim();
  const errEl = document.getElementById('loginError');
  errEl.classList.add('hidden');

  if (otp.length < 4) {
    showError(errEl, 'Please enter a valid OTP.');
    return;
  }

  if (CONFIG.DEMO_MODE) {
    // Demo: accept any 6-digit OTP or "123456"
    if (otp === '123456' || otp.length === 6) {
      currentUser = { phone: '+91' + phone, id: 'demo_user' };
      localStorage.setItem('namma_demo_user', JSON.stringify(currentUser));
      enterApp();
    } else {
      showError(errEl, 'Demo mode: Enter any 6-digit OTP (e.g. 123456)');
    }
    return;
  }

  setLoading('verifyOtpBtn','verifyOtpText','verifyOtpLoader',true);
  try {
    const { data, error } = await sb.auth.verifyOtp({ phone: '+91' + phone, token: otp, type: 'sms' });
    if (error) throw error;
    currentUser = data.user;
    enterApp();
  } catch(e) {
    showError(errEl, e.message || 'Invalid OTP. Please try again.');
  }
  setLoading('verifyOtpBtn','verifyOtpText','verifyOtpLoader',false);
}

function backToPhone() {
  document.getElementById('phoneStep').classList.remove('hidden');
  document.getElementById('otpStep').classList.add('hidden');
  document.getElementById('otpInput').value = '';
  document.getElementById('loginError').classList.add('hidden');
}

function demoLogin() {
  currentUser = { phone: 'demo', id: 'demo_user' };
  localStorage.setItem('namma_demo_user', JSON.stringify(currentUser));
  enterApp();
}

/* ===================== ENTER APP ===================== */
function enterApp() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');
  if (CONFIG.DEMO_MODE) {
    addDemoModeBadge();
  }
  initApp();
}

function addDemoModeBadge() {
  const badge = document.createElement('div');
  badge.className = 'demo-mode-badge';
  badge.textContent = '⚡ Demo Mode';
  document.body.appendChild(badge);
}

async function logout() {
  if (!CONFIG.DEMO_MODE && sb) {
    await sb.auth.signOut();
  }
  localStorage.removeItem('namma_demo_user');
  currentUser = null;
  realtimeSubs.forEach(s => s && s.unsubscribe && s.unsubscribe());
  realtimeSubs = [];
  document.getElementById('mainApp').classList.add('hidden');
  document.getElementById('langScreen').classList.remove('hidden');
  document.getElementById('langScreen').classList.remove('hidden');
}

/* ===================== INIT APP ===================== */
async function initApp() {
  applyLanguage();
  buildTimingsGrid();
  getUserLocation();
  await Promise.all([
    loadEmergencyNumbers(),
    loadNotice(),
    loadShops(),
    loadFeedback()
  ]);
  if (!CONFIG.DEMO_MODE && sb) {
    setupRealtime();
  }
}

/* ===================== LOCATION ===================== */
function getUserLocation() {
  const locText = document.getElementById('locationText');
  locText.textContent = t('locationGetting');
  if (!navigator.geolocation) {
    locText.textContent = 'Location not available';
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      locText.textContent = `📍 ${userLat.toFixed(4)}, ${userLng.toFixed(4)}`;
      renderShops(filteredShops.length ? filteredShops : allShops);
    },
    (err) => {
      locText.textContent = 'Location unavailable – tap 🔄 to retry';
    },
    { timeout: 8000, enableHighAccuracy: true }
  );
}

/* ===================== EMERGENCY NUMBERS ===================== */
async function loadEmergencyNumbers() {
  let numbers = DEMO_EMERGENCY;
  if (!CONFIG.DEMO_MODE && sb) {
    const { data } = await sb.from('emergency_numbers').select('*').order('id');
    if (data && data.length) numbers = data;
  }
  renderEmergencyNumbers(numbers);
}

function renderEmergencyNumbers(numbers) {
  const container = document.getElementById('emergencyNumbers');
  container.innerHTML = numbers.map(n =>
    `<a href="tel:${n.number}" class="emergency-btn">${n.icon || '📞'} ${n.number}</a>`
  ).join('');
}

/* ===================== NOTICE BOARD ===================== */
async function loadNotice() {
  let text = '';
  if (!CONFIG.DEMO_MODE && sb) {
    const { data } = await sb.from('notice').select('message').eq('active', true).single();
    if (data) text = data.message;
  }
  document.getElementById('noticeText').textContent = text || t('noNotice');
}

/* ===================== SHOPS ===================== */
async function loadShops() {
  const list = document.getElementById('shopsList');
  list.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading...</p></div>';

  if (CONFIG.DEMO_MODE) {
    allShops = [...DEMO_SHOPS];
  } else {
    const { data, error } = await sb.from('shops').select('*').order('name');
    allShops = data || [];
  }

  buildCategoryChips();
  applyFilters();
}

function buildCategoryChips() {
  const cats = ['all', ...new Set(allShops.map(s => s.category).filter(Boolean))];
  const strip = document.getElementById('categoryStrip');
  strip.innerHTML = cats.map(c =>
    `<button class="chip ${c === selectedCategory ? 'active' : ''}" 
      onclick="filterCategory('${c}')" data-cat="${c}">
      ${c === 'all' ? (currentLang === 'kn' ? 'ಎಲ್ಲಾ' : 'All') : (CAT_ICONS[c] || '') + ' ' + c}
    </button>`
  ).join('');
}

function filterCategory(cat) {
  selectedCategory = cat;
  document.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.dataset.cat === cat);
  });
  applyFilters();
}

function handleSearch() {
  searchQuery = document.getElementById('searchInput').value.trim();
  const clearBtn = document.getElementById('clearSearch');
  clearBtn.classList.toggle('hidden', !searchQuery);
  applyFilters();
  if (searchQuery && !CONFIG.DEMO_MODE && sb) logSearch(searchQuery);
}

function clearSearchInput() {
  document.getElementById('searchInput').value = '';
  searchQuery = '';
  document.getElementById('clearSearch').classList.add('hidden');
  applyFilters();
}

async function logSearch(query) {
  try {
    await sb.from('search_logs').insert({ query, device_id: deviceId });
  } catch(e) {}
}

function applyFilters() {
  let shops = allShops;
  if (selectedCategory !== 'all') {
    shops = shops.filter(s => s.category === selectedCategory);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    shops = shops.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.category && s.category.toLowerCase().includes(q)) ||
      (s.address && s.address.toLowerCase().includes(q))
    );
  }
  filteredShops = shops;
  renderShops(filteredShops);
  if (mapInstance) updateMapMarkers(filteredShops);
}

function calcDist(lat1, lng1, lat2, lng2) {
  if (!lat1 || !lat2) return null;
  const R = 6371;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLng = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);
}

function renderShops(shops) {
  const list = document.getElementById('shopsList');
  if (!shops.length) {
    list.innerHTML = `<div class="empty-state"><span class="empty-icon">🏪</span><p>${t('noShops')}</p></div>`;
    return;
  }

  const todayKey_ = todayKey();
  if (!callCounts[todayKey_]) { callCounts = {}; callCounts[todayKey_] = {}; }
  const todayCalls = callCounts[todayKey_];

  list.innerHTML = shops.map(shop => {
    const dist = calcDist(userLat, userLng, shop.lat, shop.lng);
    const icon = CAT_ICONS[shop.category] || '🏪';
    const callsUsed = todayCalls[shop.id] || 0;
    const canCall = callsUsed < 5;

    return `
      <div class="shop-card" onclick="openShopDetail(${shop.id})">
        <div class="shop-card-img">
          ${shop.image_url ? `<img src="${shop.image_url}" alt="${shop.name}" style="width:100%;height:100%;object-fit:cover;"/>` : icon}
        </div>
        <div class="shop-card-body">
          <div class="shop-card-top">
            <span class="shop-card-name">${shop.name}</span>
            <span class="shop-cat-badge">${icon} ${shop.category}</span>
          </div>
          <div class="shop-meta">
            ${dist ? `<span class="shop-meta-item"><span>📍</span>${dist} ${t('distanceUnit')}</span>` : ''}
            <span class="shop-meta-item"><span>🏠</span>${shop.address.substring(0,40)}${shop.address.length>40?'...':''}</span>
          </div>
          <div class="shop-card-actions">
            <button class="action-btn call-btn ${!canCall?'disabled':''}" 
              onclick="event.stopPropagation(); handleCall(${shop.id},'${shop.phone}',event)">
              ${t('callBtn')} ${!canCall?'(Limit reached)':''}
            </button>
            <button class="action-btn map-btn" 
              onclick="event.stopPropagation(); openMap(${shop.lat},${shop.lng},'${shop.name}')">
              ${t('mapBtn')}
            </button>
          </div>
        </div>
      </div>`;
  }).join('');
}

/* ===================== CALL HANDLING ===================== */
function handleCall(shopId, phone, event) {
  const todayKey_ = todayKey();
  if (!callCounts[todayKey_]) callCounts = { [todayKey_]: {} };
  const todayCalls = callCounts[todayKey_];
  const used = todayCalls[shopId] || 0;

  if (used >= 5) {
    alert('Daily call limit reached for this shop (5 calls/day).');
    return;
  }

  todayCalls[shopId] = used + 1;
  localStorage.setItem('callCounts', JSON.stringify(callCounts));

  if (!CONFIG.DEMO_MODE && sb) {
    sb.from('call_logs').insert({ shop_id: shopId, device_id: deviceId }).catch(()=>{});
  }

  window.location.href = `tel:${phone}`;
}

function openMap(lat, lng, name) {
  const url = `https://www.google.com/maps?q=${lat},${lng}&label=${encodeURIComponent(name)}`;
  window.open(url, '_blank');
}

/* ===================== SHOP DETAIL ===================== */
function openShopDetail(shopId) {
  const shop = allShops.find(s => s.id === shopId);
  if (!shop) return;

  document.getElementById('detailShopName').textContent = shop.name;
  const body = document.getElementById('shopDetailBody');
  const icon = CAT_ICONS[shop.category] || '🏪';
  const dist = calcDist(userLat, userLng, shop.lat, shop.lng);

  const todayKey_ = todayKey();
  if (!callCounts[todayKey_]) callCounts[todayKey_] = {};
  const callsLeft = 5 - (callCounts[todayKey_][shopId] || 0);

  const timingsHtml = shop.timings ? Object.entries(shop.timings).map(([day, time]) =>
    `<div class="timing-detail-row">
      <span class="timing-detail-day">${day}</span>
      <span class="timing-detail-time">${time || t('closedLabel')}</span>
    </div>`
  ).join('') : '';

  body.innerHTML = `
    <div class="detail-image">
      ${shop.image_url ? `<img src="${shop.image_url}" alt="${shop.name}" style="width:100%;height:180px;object-fit:cover;border-radius:14px;"/>` : icon}
    </div>
    <span class="detail-badge">${icon} ${shop.category}</span>
    
    ${callsLeft < 5 ? `<div class="call-limit-banner">Calls remaining today: ${callsLeft}/5</div>` : ''}

    <div class="detail-row">
      <span class="detail-row-icon">🏠</span>
      <div class="detail-row-body">
        <div class="detail-row-label">Address</div>
        <div class="detail-row-value">${shop.address}</div>
      </div>
    </div>
    ${dist ? `<div class="detail-row">
      <span class="detail-row-icon">📍</span>
      <div class="detail-row-body">
        <div class="detail-row-label">Distance</div>
        <div class="detail-row-value">${dist} ${t('distanceUnit')}</div>
      </div>
    </div>` : ''}
    ${timingsHtml ? `<div class="detail-row">
      <span class="detail-row-icon">🕐</span>
      <div class="detail-row-body">
        <div class="detail-row-label">Timings</div>
        <div class="timings-detail">${timingsHtml}</div>
      </div>
    </div>` : ''}
    ${shop.extra ? `<div class="detail-row">
      <span class="detail-row-icon">ℹ️</span>
      <div class="detail-row-body">
        <div class="detail-row-label">Details</div>
        <div class="detail-row-value">${shop.extra}</div>
      </div>
    </div>` : ''}

    <div class="detail-actions">
      <button class="action-btn call-btn" onclick="handleCall(${shop.id},'${shop.phone}',event)">
        📞 ${shop.phone}
      </button>
      <button class="action-btn map-btn" onclick="openMap(${shop.lat},${shop.lng},'${shop.name}')">
        🗺️ Map
      </button>
    </div>
  `;
  document.getElementById('shopDetailModal').classList.remove('hidden');
}

function closeShopDetail() {
  document.getElementById('shopDetailModal').classList.add('hidden');
}

/* ===================== MAP ===================== */
function initMap() {
  if (mapInstance) return;
  const container = document.getElementById('mapContainer');
  mapInstance = L.map(container).setView([15.27, 76.40], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapInstance);
  if (userLat) {
    L.marker([userLat, userLng], {
      icon: L.divIcon({ html: '📍', className: '', iconSize:[28,28] })
    }).addTo(mapInstance).bindPopup('You are here');
  }
  updateMapMarkers(filteredShops.length ? filteredShops : allShops);
}

function updateMapMarkers(shops) {
  if (!mapInstance) return;
  mapMarkers.forEach(m => m.remove());
  mapMarkers = [];
  shops.forEach(shop => {
    if (!shop.lat || !shop.lng) return;
    const icon = CAT_ICONS[shop.category] || '🏪';
    const marker = L.marker([shop.lat, shop.lng], {
      icon: L.divIcon({ html: icon, className: '', iconSize:[28,28] })
    }).addTo(mapInstance);
    marker.bindPopup(`<b>${shop.name}</b><br>${shop.category}<br>📞 ${shop.phone}`);
    mapMarkers.push(marker);
  });
}

/* ===================== TABS ===================== */
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
  document.getElementById('tab-' + tab).classList.remove('hidden');
  if (tab === 'map') {
    setTimeout(() => {
      initMap();
      mapInstance && mapInstance.invalidateSize();
    }, 100);
  }
}

/* ===================== FEEDBACK ===================== */
async function loadFeedback() {
  let items = DEMO_FEEDBACK;
  if (!CONFIG.DEMO_MODE && sb) {
    const { data } = await sb.from('feedback').select('*').order('created_at', { ascending: false }).limit(20);
    if (data) items = data;
  }
  renderFeedback(items);
}

function setRating(val) {
  currentRating = val;
  document.querySelectorAll('.star').forEach((s, i) => {
    s.classList.toggle('active', i < val);
  });
}

async function submitFeedback() {
  const text = document.getElementById('feedbackText').value.trim();
  const msgEl = document.getElementById('feedbackMsg');
  msgEl.classList.add('hidden');

  if (!text) { alert('Please enter feedback.'); return; }

  const item = {
    text,
    rating: currentRating || 0,
    device_id: deviceId,
    created_at: new Date().toISOString()
  };

  if (!CONFIG.DEMO_MODE && sb) {
    const { error } = await sb.from('feedback').insert(item);
    if (error) { alert('Failed to submit feedback.'); return; }
  } else {
    DEMO_FEEDBACK.unshift({ ...item, id: Date.now() });
    renderFeedback(DEMO_FEEDBACK);
  }

  document.getElementById('feedbackText').value = '';
  setRating(0);
  msgEl.textContent = t('feedbackSuccess');
  msgEl.classList.remove('hidden');
  setTimeout(() => msgEl.classList.add('hidden'), 3000);
}

function renderFeedback(items) {
  const list = document.getElementById('feedbackList');
  if (!items.length) {
    list.innerHTML = '<div class="empty-state"><span class="empty-icon">💬</span><p>No feedback yet</p></div>';
    return;
  }
  list.innerHTML = items.map(f => `
    <div class="feedback-item">
      <div class="fb-top">
        <span class="fb-rating">${'⭐'.repeat(f.rating || 0)}</span>
        <span class="fb-date">${new Date(f.created_at).toLocaleDateString()}</span>
      </div>
      <div class="fb-text">${f.text}</div>
    </div>`
  ).join('');
}

/* ===================== ADD SHOP ===================== */
function openAddShop() {
  addAdminVerified = false;
  shopToEdit = null;
  document.getElementById('addAdminVerify').classList.remove('hidden');
  document.getElementById('addShopForm').classList.add('hidden');
  document.getElementById('addAdminPass').value = '';
  document.getElementById('addAdminError').classList.add('hidden');
  document.getElementById('addShopModal').classList.remove('hidden');
}

function closeAddShop() {
  document.getElementById('addShopModal').classList.add('hidden');
}

function verifyAddAdmin() {
  const pass = document.getElementById('addAdminPass').value;
  const errEl = document.getElementById('addAdminError');
  if (pass === CONFIG.ADMIN_PASSWORD) {
    document.getElementById('addAdminVerify').classList.add('hidden');
    document.getElementById('addShopForm').classList.remove('hidden');
  } else {
    showError(errEl, 'Incorrect admin password.');
  }
}

function checkCustomCat() {
  const sel = document.getElementById('shopCatSelect').value;
  document.getElementById('shopCatCustom').classList.toggle('hidden', sel !== 'Other');
}

function detectShopLocation() {
  const status = document.getElementById('shopLocStatus');
  status.textContent = 'Detecting...';
  navigator.geolocation.getCurrentPosition(
    pos => {
      document.getElementById('shopLat').value = pos.coords.latitude.toFixed(6);
      document.getElementById('shopLng').value = pos.coords.longitude.toFixed(6);
      status.textContent = '✅ Location set';
    },
    () => { status.textContent = '❌ Failed – enter manually'; }
  );
}

function buildTimingsGrid() {
  const days = currentLang === 'kn' ? DAYS_KN : DAYS;
  const fullDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const grid = document.getElementById('timingsGrid');
  if (!grid) return;
  grid.innerHTML = fullDays.map((d, i) => `
    <div class="timing-row">
      <span class="timing-day">${days[i]}</span>
      <input type="time" id="open_${d}" class="timing-input" value="${d==='Sun'?'':'08:00'}"/>
      <span class="timing-sep">–</span>
      <input type="time" id="close_${d}" class="timing-input" value="${d==='Sun'?'':'21:00'}"/>
      <label class="timing-closed">
        <input type="checkbox" id="closed_${d}" onchange="toggleClosedDay('${d}')"/> ${t('closedLabel')}
      </label>
    </div>`
  ).join('');
}

function toggleClosedDay(day) {
  const closed = document.getElementById('closed_' + day).checked;
  document.getElementById('open_' + day).disabled = closed;
  document.getElementById('close_' + day).disabled = closed;
}

async function submitShop() {
  const name = document.getElementById('shopName').value.trim();
  const catSel = document.getElementById('shopCatSelect').value;
  const catCustom = document.getElementById('shopCatCustom').value.trim();
  const category = catSel === 'Other' ? catCustom : catSel;
  const phone = document.getElementById('shopPhone').value.trim();
  const address = document.getElementById('shopAddress').value.trim();
  const extra = document.getElementById('shopExtra').value.trim();
  const lat = parseFloat(document.getElementById('shopLat').value) || null;
  const lng = parseFloat(document.getElementById('shopLng').value) || null;
  const errEl = document.getElementById('addShopError');
  errEl.classList.add('hidden');

  if (!name || !category || !phone || !address) {
    showError(errEl, 'Please fill all required fields.');
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    showError(errEl, 'Enter valid 10-digit phone number.');
    return;
  }

  const fullDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const timings = {};
  fullDays.forEach(d => {
    if (document.getElementById('closed_' + d) && document.getElementById('closed_' + d).checked) {
      timings[d] = 'Closed';
    } else {
      const o = document.getElementById('open_' + d)?.value;
      const c = document.getElementById('close_' + d)?.value;
      if (o && c) timings[d] = `${fmtTime(o)}–${fmtTime(c)}`;
    }
  });

  const shopData = { name, category, phone, address, timings, extra, lat, lng };

  setLoading('submitShopBtn','submitShopText','submitShopLoader',true);

  if (!CONFIG.DEMO_MODE && sb) {
    const fileInput = document.getElementById('shopImage');
    if (fileInput.files[0]) {
      const file = fileInput.files[0];
      const filePath = `shops/${Date.now()}_${file.name}`;
      const { data: uploaded } = await sb.storage.from('shop-images').upload(filePath, file);
      if (uploaded) {
        const { data: urlData } = sb.storage.from('shop-images').getPublicUrl(filePath);
        shopData.image_url = urlData.publicUrl;
      }
    }
    const { error } = await sb.from('shops').insert(shopData);
    if (error) {
      showError(errEl, 'Failed to add shop: ' + error.message);
      setLoading('submitShopBtn','submitShopText','submitShopLoader',false);
      return;
    }
    await loadShops();
  } else {
    shopData.id = Date.now();
    shopData.image_url = null;
    allShops.push(shopData);
    buildCategoryChips();
    applyFilters();
  }

  setLoading('submitShopBtn','submitShopText','submitShopLoader',false);
  closeAddShop();
  resetAddShopForm();
  alert('✅ Shop added successfully!');
}

function resetAddShopForm() {
  ['shopName','shopPhone','shopAddress','shopExtra'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('shopCatSelect').value = '';
  document.getElementById('shopCatCustom').value = '';
  document.getElementById('shopCatCustom').classList.add('hidden');
  document.getElementById('shopLat').value = '';
  document.getElementById('shopLng').value = '';
  document.getElementById('shopLocStatus').textContent = 'Not set';
  document.getElementById('shopImage').value = '';
  buildTimingsGrid();
}

function fmtTime(t24) {
  const [h, m] = t24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2,'0')}${ampm}`;
}

/* ===================== REALTIME (SUPABASE) ===================== */
function setupRealtime() {
  const shopSub = sb.channel('public:shops')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'shops' }, () => loadShops())
    .subscribe();
  const noticeSub = sb.channel('public:notice')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notice' }, () => loadNotice())
    .subscribe();
  const fbSub = sb.channel('public:feedback')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback' }, () => loadFeedback())
    .subscribe();
  const blockSub = sb.channel('public:blocked_devices')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'blocked_devices' }, (payload) => {
      if (payload.new.device_id === deviceId) showBlocked();
    })
    .subscribe();
  realtimeSubs = [shopSub, noticeSub, fbSub, blockSub];
}

/* ===================== UTILITIES ===================== */
function setLoading(btnId, textId, loaderId, loading) {
  const btn = document.getElementById(btnId);
  const textEl = document.getElementById(textId);
  const loaderEl = document.getElementById(loaderId);
  if (btn) btn.disabled = loading;
  if (textEl) textEl.classList.toggle('hidden', loading);
  if (loaderEl) loaderEl.classList.toggle('hidden', !loading);
}

function showError(el, msg) {
  el.textContent = msg;
  el.classList.remove('hidden');
}

/* ===================== BOOT ===================== */
window.addEventListener('DOMContentLoaded', () => {
  sb = initSupabase();

  // Check saved language
  const savedLang = localStorage.getItem('namma_lang');
  if (savedLang) {
    currentLang = savedLang;
    document.getElementById('langScreen').classList.add('hidden');
    applyLanguage();

    // Check for existing session
    if (CONFIG.DEMO_MODE) {
      const demoUser = localStorage.getItem('namma_demo_user');
      if (demoUser) {
        currentUser = JSON.parse(demoUser);
        checkBlockedAndInit().then(() => {}).catch(() => showLoginScreen());
        return;
      }
      checkBlockedAndInit();
    } else {
      sb.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          currentUser = session.user;
          checkBlockedAndInit().then(() => {
            document.getElementById('loginScreen').classList.add('hidden');
            enterApp();
          });
        } else {
          checkBlockedAndInit();
        }
      });
    }
    return;
  }
  // First visit - show lang screen
});