// Export all translations
import de from './de.js';
import en from './en.js';
import ru from './ru.js';
import tr from './tr.js';

// All available translations
const translations = {
  de,
  en,
  ru,
  tr
};

// Current active language
let currentLang = null;

/**
 * Initialize the language system
 */
export function initLanguage() {
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
export function switchLanguage(lang) {
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
  
  // Update select options
  updateSelectOptions(lang);
}

/**
 * Update select dropdown options with translated values
 */
function updateSelectOptions(lang) {
  const translation = translations[lang];
  
  // Update child status options
  document.querySelectorAll('.kind-status').forEach(select => {
    const options = select.querySelectorAll('option');
    options.forEach(option => {
      const key = option.getAttribute('data-i18n-option');
      if (key && translation[key]) {
        option.textContent = translation[key];
      }
    });
  });
  
  // Update residence options
  document.querySelectorAll('.kind-lebensmittelpunkt').forEach(select => {
    const options = select.querySelectorAll('option');
    options.forEach(option => {
      if (option.value === 'Vater') {
        option.textContent = translation['father'];
      } else if (option.value === 'Mutter') {
        option.textContent = translation['mother'];
      }
    });
  });
}

// Export for use in other modules
export default translations;
