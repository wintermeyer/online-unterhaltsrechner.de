/**
 * Language/Translation System for Kindesunterhalt-Rechner
 */

// German translations (default)
const deTranslations = {
  // Header
  "header-title": "Unterhaltsrechner",
  "header-subtitle": "Berechnen Sie schnell und einfach den gesetzlichen Kindesunterhalt",
  
  // Main form headings
  "calculator-heading": "Kindesunterhalt berechnen",
  "for-year": "Berechnung für",
  "parents-income": "Einkommen der Eltern",
  "father": "Vater",
  "mother": "Mutter",
  "net-income": "Netto-Einkommen",
  "other-income": "Sonstige Einkommen",
  "housing-benefit": "Wohnvorteil",
  "debt-expenses": "Aufwand Schulden",
  
  // Children section
  "children-heading": "Kinder",
  "add-child": "Kind hinzufügen",
  "remove-child": "Entfernen",
  "child": "Kind",
  "age": "Alter",
  "residence": "Lebensmittelpunkt",
  "status": "Status",
  "own-income": "Einkommen aus Job/Ausb.",
  "other-child-income": "Sonstiges Einkommen",
  "child-benefit": "Kindergeld erhält",
  
  // Status options
  "status-school": "Schulkind",
  "status-apprentice": "Auszubildende(r)",
  "status-student": "Student(in)",
  "status-working": "Arbeitend",
  "status-unemployed": "Arbeitslos",
  
  // Calculate Button
  "calculate": "Berechnen",
  
  // Results
  "results-heading": "Ergebnis",
  "financial-situation": "Finanzielle Gesamtsituation",
  "net-adjusted": "Bereinigtes Netto",
  "support-to-pay": "– Unterh. zu zahlen",
  "support-to-receive": "+ Unterh. zu erhalten",
  "child-benefit-receive": "+ Kinderg. zu erhalten",
  "net-available": "= Netto zur Verfügung",
  "child-support-payments": "Unterhaltszahlungen für Kinder",
  
  // Additional translations
  "pays": "zahlt",
  "housing-benefit-desc": "Mietersparnis durch Wohneigentum",
  "debt-expenses-desc": "Abzugsfähige Schuldverpflichtungen",
  "child-income": "Einkommen des Kindes",
  "kind": "Kind",
  "lebensmittelpunkt": "Lebensmittelpunkt",
  "kindergeld-goes-to": "Kindergeld geht an",
  "other-income-desc": "Weitere Einkünfte wie Kapitalerträge, Mieteinnahmen, etc.",
  "child-support-for": "Unterh. für Kind",
  "job-income-desc": "Einkünfte des Kindes aus Arbeit oder Ausbildung",
  "own-income": "Einkommen aus Job/Ausb.",
  "other-child-income": "Sonstiges Einkommen",
  "status": "Status",
  "age": "Alter",
  "residence": "Lebensmittelpunkt",
  "child-benefit": "Kindergeld geht an",
  "remove-child": "Entfernen",
  "father": "Vater",
  "mother": "Mutter",
  "shared": "Je 50%",
  "income-group": "Einkommensgruppe:",
  "child-status-student": "Schüler",
  "child-status-university": "Student",
  "child-status-apprentice": "Azubi",
  "child-status-working": "Berufstätig",
  "currency": "€",
  "net-income-summary": "Nettoeinkommen",
  "total-support-payments": "Gesamte Unterhaltszahlungen"
};

// English translations
const enTranslations = {
  // Header
  "header-title": "Support Calculator",
  "header-subtitle": "Calculate the statutory child support quickly and easily",
  
  // Main form headings
  "calculator-heading": "Calculate Child Support",
  "for-year": "Calculation for",
  "parents-income": "Parents' Income",
  "father": "Father",
  "mother": "Mother",
  "net-income": "Net Income",
  "other-income": "Other Income",
  "housing-benefit": "Housing Benefit",
  "debt-expenses": "Debt Expenses",
  
  // Children section
  "children-heading": "Children",
  "add-child": "Add Child",
  "remove-child": "Remove",
  "child": "Child",
  "age": "Age",
  "residence": "Primary Residence",
  "status": "Status",
  "own-income": "Job/Training Income",
  "other-child-income": "Other Income",
  "child-benefit": "Child Benefit Recipient",
  
  // Status options
  "status-school": "School Student",
  "status-apprentice": "Apprentice",
  "status-student": "University Student",
  "status-working": "Working",
  "status-unemployed": "Unemployed",
  
  // Calculate Button
  "calculate": "Calculate",
  
  // Results
  "results-heading": "Results",
  "financial-situation": "Overall Financial Situation",
  "net-adjusted": "Adjusted Net Income",
  "support-to-pay": "– Support to Pay",
  "support-to-receive": "+ Support to Receive",
  "child-benefit-receive": "+ Child Benefit to Receive",
  "net-available": "= Net Available",
  "child-support-payments": "Child Support Payments",
  
  // Additional translations
  "pays": "pays",
  "housing-benefit-desc": "Rent savings through property ownership",
  "debt-expenses-desc": "Deductible debt obligations",
  "child-income": "Child's Income",
  "kind": "Child",
  "lebensmittelpunkt": "Primary Residence",
  "kindergeld-goes-to": "Child benefit goes to",
  "other-income-desc": "Other income such as capital gains, rental income, etc.",
  "child-support-for": "Support for Child",
  "job-income-desc": "Child's income from work or education",
  "own-income": "Income from job/education",
  "other-child-income": "Other income",
  "status": "Status",
  "age": "Age",
  "residence": "Primary Residence",
  "child-benefit": "Child benefit goes to",
  "remove-child": "Remove",
  "father": "Father",
  "mother": "Mother",
  "shared": "50% each",
  "income-group": "Income Group:",
  "child-status-student": "School Student",
  "child-status-university": "University Student",
  "child-status-apprentice": "Apprentice",
  "child-status-working": "Working",
  "currency": "€",
  "net-income-summary": "Net Income",
  "total-support-payments": "Total Support Payments"
};

// Russian translations
const ruTranslations = {
  // Header
  "header-title": "Калькулятор содержания",
  "header-subtitle": "Быстро и легко рассчитайте установленные законом алименты",
  
  // Main form headings
  "calculator-heading": "Расчет алиментов",
  "for-year": "Расчет на",
  "parents-income": "Доходы родителей",
  "father": "Отец",
  "mother": "Мать",
  "net-income": "Чистый доход",
  "other-income": "Другие доходы",
  "housing-benefit": "Жилищная льгота",
  "debt-expenses": "Расходы на долги",
  
  // Children section
  "children-heading": "Дети",
  "add-child": "Добавить ребенка",
  "remove-child": "Удалить",
  "child": "Ребенок",
  "age": "Возраст",
  "residence": "Основное место жительства",
  "status": "Статус",
  "own-income": "Доход от работы/обучения",
  "other-child-income": "Другой доход",
  "child-benefit": "Получатель пособия на ребенка",
  
  // Status options
  "status-school": "Школьник",
  "status-apprentice": "Ученик",
  "status-student": "Студент",
  "status-working": "Работающий",
  "status-unemployed": "Безработный",
  
  // Calculate Button
  "calculate": "Рассчитать",
  
  // Results
  "results-heading": "Результаты",
  "financial-situation": "Общая финансовая ситуация",
  "net-adjusted": "Скорректированный чистый доход",
  "support-to-pay": "– Алименты к выплате",
  "support-to-receive": "+ Алименты к получению",
  "child-benefit-receive": "+ Пособие на ребенка к получению",
  "net-available": "= Чистый доступный доход",
  "child-support-payments": "Выплаты алиментов на детей",
  
  // Additional translations
  "pays": "платит",
  "housing-benefit-desc": "Экономия на аренде при собственном жилье",
  "debt-expenses-desc": "Вычитаемые долговые обязательства",
  "child-income": "Доход ребенка",
  "kind": "Ребенок",
  "lebensmittelpunkt": "Основное место жительства",
  "kindergeld-goes-to": "Детское пособие получает",
  "other-income-desc": "Другие доходы, такие как доходы от капитала, арендная плата и т.д.",
  "child-support-for": "Алименты на ребенка",
  "job-income-desc": "Доходы ребенка от работы или учебы",
  "own-income": "Доход от работы/учебы",
  "other-child-income": "Прочие доходы",
  "status": "Статус",
  "age": "Возраст",
  "residence": "Основное место жительства",
  "child-benefit": "Детское пособие получает",
  "remove-child": "Удалить",
  "father": "Отец",
  "mother": "Мать",
  "shared": "По 50%",
  "income-group": "Доходная группа:",
  "child-status-student": "Школьник",
  "child-status-university": "Студент",
  "child-status-apprentice": "Ученик",
  "child-status-working": "Работающий",
  "currency": "€",
  "net-income-summary": "Чистый доход",
  "total-support-payments": "Общие выплаты алиментов"
};

// Turkish translations
const trTranslations = {
  // Header
  "header-title": "Nafaka Hesaplayıcısı",
  "header-subtitle": "Yasal çocuk nafakasını hızlı ve kolay bir şekilde hesaplayın",
  
  // Main form headings
  "calculator-heading": "Çocuk Nafakası Hesaplama",
  "for-year": "Hesaplama yılı",
  "parents-income": "Ebeveyn Geliri",
  "father": "Baba",
  "mother": "Anne",
  "net-income": "Net Gelir",
  "other-income": "Diğer Gelir",
  "housing-benefit": "Konut Yardımı",
  "debt-expenses": "Borç Giderleri",
  
  // Children section
  "children-heading": "Çocuklar",
  "add-child": "Çocuk Ekle",
  "remove-child": "Kaldır",
  "child": "Çocuk",
  "age": "Yaş",
  "residence": "Ana İkamet",
  "status": "Durum",
  "own-income": "İş/Eğitim Geliri",
  "other-child-income": "Diğer Gelir",
  "child-benefit": "Çocuk Yardımı Alıcısı",
  
  // Status options
  "status-school": "Okul Öğrencisi",
  "status-apprentice": "Çırak",
  "status-student": "Üniversite Öğrencisi",
  "status-working": "Çalışan",
  "status-unemployed": "İşsiz",
  
  // Calculate Button
  "calculate": "Hesapla",
  
  // Results
  "results-heading": "Sonuçlar",
  "financial-situation": "Genel Finansal Durum",
  "net-adjusted": "Düzeltilmiş Net Gelir",
  "support-to-pay": "– Ödenecek Nafaka",
  "support-to-receive": "+ Alınacak Nafaka",
  "child-benefit-receive": "+ Alınacak Çocuk Yardımı",
  "net-available": "= Kullanılabilir Net",
  "child-support-payments": "Çocuk Nafaka Ödemeleri",
  
  // Additional translations
  "pays": "öder",
  "housing-benefit-desc": "Mülk sahipliği ile kira tasarrufu",
  "debt-expenses-desc": "Düşülebilir borç yükümlülükleri",
  "child-income": "Çocuk Geliri",
  "kind": "Çocuk",
  "lebensmittelpunkt": "Ana İkamet",
  "kindergeld-goes-to": "Çocuk parası şu kişiye gider",
  "other-income-desc": "Sermaye kazançları, kira geliri vb. gibi diğer gelirler",
  "child-support-for": "Çocuk için nafaka",
  "job-income-desc": "Çocuğun iş veya eğitimden aldığı gelir",
  "own-income": "İş/eğitim geliri",
  "other-child-income": "Diğer gelirler",
  "status": "Durum",
  "age": "Yaş",
  "residence": "Ana İkamet",
  "child-benefit": "Çocuk parası şu kişiye gider",
  "remove-child": "Kaldır",
  "father": "Baba",
  "mother": "Anne",
  "shared": "%50 her biri",
  "income-group": "Gelir Grubu:",
  "child-status-student": "Öğrenci",
  "child-status-university": "Üniversite Öğrencisi",
  "child-status-apprentice": "Çırak",
  "child-status-working": "Çalışan",
  "currency": "€",
  "net-income-summary": "Net Gelir",
  "total-support-payments": "Toplam Nafaka Ödemeleri"
};



// All available translations
const translations = {
  de: deTranslations,
  en: enTranslations,
  ru: ruTranslations,
  tr: trTranslations
};

// Current active language
let currentLang = null;

/**
 * Initialize the language system
 */
function initLanguage() {
  // Get browser language (first 2 characters only)
  const browserLang = navigator.language.substring(0, 2).toLowerCase();
  
  // Check if browser language is supported, otherwise default to German
  const initialLang = translations[browserLang] ? browserLang : 'de';
  
  // Set active language button
  setActiveLanguageButton(initialLang);
  
  // Switch to detected language
  switchLanguage(initialLang);
  
  // Add event listeners to language buttons
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setActiveLanguageButton(lang);
      switchLanguage(lang);
    });
  });
}

/**
 * Update the UI to show which language is active
 */
function setActiveLanguageButton(lang) {
  // Remove active class from all buttons
  document.querySelectorAll('.language-btn').forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    if (btnLang === lang) {
      btn.classList.add('opacity-100', 'ring-2', 'ring-white');
      btn.style.transform = 'scale(1.1)';
    } else {
      btn.classList.remove('opacity-100', 'ring-2', 'ring-white');
      btn.classList.add('opacity-70');
      btn.style.transform = 'scale(1)';
    }
  });
}

/**
 * Switch the UI language
 */
function switchLanguage(lang) {
  if (currentLang === lang) return;
  currentLang = lang;
  
  // Get the translation object for selected language
  const translation = translations[lang];
  
  if (!translation) {
    console.error(`Translation for ${lang} not found`);
    return;
  }
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translation[key]) {
      element.textContent = translation[key];
    }
  });
  
  // Special handling for elements with IDs that match translation keys
  Object.keys(translation).forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      element.textContent = translation[key];
    }
  });
  
  // Update placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (translation[key]) {
      element.setAttribute('placeholder', translation[key]);
    }
  });
  
  // Special handling for child support labels
  document.querySelectorAll('[data-child-support-label]').forEach(element => {
    const text = element.textContent;
    // Extract child number and age from original text
    const matches = text.match(/Kind (\d+).*?(\d+)/); 
    if (matches && matches.length >= 3) {
      const childNum = matches[1];
      const age = matches[2];
      element.textContent = `${translation['child-support-for']} ${childNum} (${age} ${translation['age'] ? translation['age'].charAt(0).toLowerCase() : 'J.'})`;
    }
  });
  
  // Update select options
  updateSelectOptions(lang);
  
  // Update document language attribute
  document.documentElement.setAttribute('lang', lang);
}

/**
 * Update select dropdown options with translated values
 */
function updateSelectOptions(lang) {
  const translation = translations[lang];
  if (!translation) return;
  
  // Update child status options
  document.querySelectorAll('.kind-status').forEach(select => {
    const selectedValue = select.value;
    // Clear and add new options
    select.innerHTML = '';
    
    const statusOptions = [
      { key: 'child-status-student', value: 'Schüler' },
      { key: 'child-status-university', value: 'Student' },
      { key: 'child-status-apprentice', value: 'Azubi' },
      { key: 'child-status-working', value: 'Berufstätig' }
    ];
    
    statusOptions.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option.value;
      opt.textContent = translation[option.key] || option.value;
      select.appendChild(opt);
    });
    
    // Try to restore previous selection
    select.value = selectedValue;
  });
  
  // Update residence options
  document.querySelectorAll('.kind-lebensmittelpunkt').forEach(select => {
    const options = select.querySelectorAll('option');
    options.forEach(option => {
      if (option.value === 'Vater') {
        option.textContent = translation['father'] || 'Vater';
      } else if (option.value === 'Mutter') {
        option.textContent = translation['mother'] || 'Mutter';
      } else if (option.value === 'Je 50%') {
        option.textContent = translation['shared'] || 'Je 50%';
      }
    });
  });
  
  // Update father/mother buttons in the child benefit section
  document.querySelectorAll('.kindergeld-vater').forEach(button => {
    button.textContent = translation['father'] || 'Vater';
  });
  
  document.querySelectorAll('.kindergeld-mutter').forEach(button => {
    button.textContent = translation['mother'] || 'Mutter';
  });
}
