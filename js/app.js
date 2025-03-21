/**
 * Kindesunterhalt-Rechner App
 * 
 * Diese Datei enthält den Code für die Benutzeroberfläche und 
 * verbindet das UI mit der Berechnungslogik in unterhalt.js
 */
document.addEventListener('DOMContentLoaded', function() {
  // Instanz der Unterhalt-Klasse erstellen
  const unterhaltRechner = new Unterhalt();
  
  // DOM-Elemente für die Eingabe
  const formElements = {
    // Elterndaten
    vaterNetto: document.getElementById('vaterNetto'),
    vaterSonstigesEinkommen: document.getElementById('vaterSonstigesEinkommen'),
    vaterWohnvorteil: document.getElementById('vaterWohnvorteil'),
    vaterSchulden: document.getElementById('vaterSchulden'),
    
    mutterNetto: document.getElementById('mutterNetto'),
    mutterSonstigesEinkommen: document.getElementById('mutterSonstigesEinkommen'),
    mutterWohnvorteil: document.getElementById('mutterWohnvorteil'),
    mutterSchulden: document.getElementById('mutterSchulden'),
    
    // Kinder-Container
    kinderContainer: document.getElementById('kinderContainer'),
    
    // Kinder-Ergebnisbereich
    kinderZahlungenContainer: document.getElementById('kinderZahlungenContainer'),
    
    // Jahr der Berechnung
    berechnungJahr: document.getElementById('berechnungJahr'),
    
    // Buttons
    addChildBtn: document.getElementById('addChildBtn')
  };
  
  // DOM-Elemente für die Ergebnisanzeige
  const resultElements = {
    // Netto und Einkommensgruppen
    vaterNettoBereinigt: document.getElementById('vaterNettoBereinigt'),
    mutterNettoBereinigt: document.getElementById('mutterNettoBereinigt'),
    
    // Zusammenfassung
    vaterNettoBerechnung: document.getElementById('vaterNettoBerechnung'),
    mutterNettoBerechnung: document.getElementById('mutterNettoBerechnung'),
    vaterZahltGesamt: document.getElementById('vaterZahltGesamt'),
    mutterZahltGesamt: document.getElementById('mutterZahltGesamt'),
    vaterErhaeltUnterhalt: document.getElementById('vaterErhaeltUnterhalt'),
    mutterErhaeltUnterhalt: document.getElementById('mutterErhaeltUnterhalt'),
    vaterErhaeltKindergeld: document.getElementById('vaterErhaeltKindergeld'),
    mutterErhaeltKindergeld: document.getElementById('mutterErhaeltKindergeld'),
    vaterNettoVerfuegbar: document.getElementById('vaterNettoVerfuegbar'),
    mutterNettoVerfuegbar: document.getElementById('mutterNettoVerfuegbar')
  };
  
  // Counter für Kinder-IDs
  let kinderCount = 1;
  
  // Funktion zum korrekten Nummerieren der Kinder
  function updateChildrenNumbering() {
    const kindElements = document.querySelectorAll('.kind-element');
    
    // Setze die korrekte Anzahl
    kinderCount = kindElements.length;
    
    // Nummeriere alle Kinder neu
    kindElements.forEach((kindElement, index) => {
      const number = index + 1;
      kindElement.dataset.kindNummer = number;
      kindElement.id = `kind${number}`;
      
      // Update heading
      const heading = kindElement.querySelector('h4');
      if (heading) {
        heading.textContent = `Kind ${number}`;
      }
      
      // Update IDs von Eingabefeldern wenn nötig
      const ageSelect = kindElement.querySelector('.kind-alter');
      if (ageSelect) {
        ageSelect.id = `kind${number}Alter`;
      }
      
      const lebensmittelpunktSelect = kindElement.querySelector('.kind-lebensmittelpunkt');
      if (lebensmittelpunktSelect) {
        lebensmittelpunktSelect.id = `kind${number}Lebensmittelpunkt`;
      }
    });
  }
  
  // Event-Listener für alle Inputs
  addInputListeners();
  
  // Kindergeld-Toggle für erstes Kind
  setupKindergeldToggle(document.querySelector('#kind1'));
  
  // "Weiteres Kind" Button
  formElements.addChildBtn.addEventListener('click', addNewChild);
  
  // Initiales Berechnen mit Default-Werten
  calculateUnterhalt();
  
  /**
   * Fügt Event-Listener für Input-Änderungen hinzu
   */
  function addInputListeners() {
    // Event-Listener für alle Eingabefelder (Eltern)
    const parentInputs = [
      'vaterNetto', 'vaterSonstigesEinkommen', 'vaterWohnvorteil', 'vaterSchulden',
      'mutterNetto', 'mutterSonstigesEinkommen', 'mutterWohnvorteil', 'mutterSchulden',
      'berechnungJahr'
    ];
    
    parentInputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', calculateUnterhalt);
        element.addEventListener('input', calculateUnterhalt);
        element.addEventListener('keyup', calculateUnterhalt);
      }
    });
    
    // Event-Listener für alle bestehenden Kind-Elemente hinzufügen
    const kindElements = document.querySelectorAll('.kind-element');
    kindElements.forEach(kindElement => {
      addKindEventListeners(kindElement);
    });
    
    // Schließen-Button im Ergebnisbereich
    const closeButton = document.getElementById('closeResult');
    if (closeButton) {
      closeButton.addEventListener('click', function() {
        // Hier könnte man das Ergebnisfeld ausblenden, wenn gewünscht
        // document.getElementById('ergebnisContainer').style.display = 'none';
      });
    }
  }
  
  /**
   * Fügt Event-Listener für ein Kind-Element hinzu
   */
  function addKindEventListeners(kindElement) {
    // Alle Input-Elemente im Kind-Element
    const inputs = kindElement.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('change', calculateUnterhalt);
      input.addEventListener('input', calculateUnterhalt);
      input.addEventListener('keyup', calculateUnterhalt);
    });
    
    // Entfernen-Button
    const removeBtn = kindElement.querySelector('.remove-kind-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', function() {
        removeChild(kindElement);
      });
    }
  }
  
  /**
   * Setzt den Kindergeld-Toggle für ein Kind auf
   */
  function setupKindergeldToggle(kindElement) {
    const vaterButton = kindElement.querySelector('.kindergeld-vater');
    const mutterButton = kindElement.querySelector('.kindergeld-mutter');
    
    if (!vaterButton || !mutterButton) return;
    
    // Initial Mutter als ausgewählt markieren
    mutterButton.classList.add('bg-indigo-500', 'text-white');
    vaterButton.classList.add('bg-gray-200');
    
    vaterButton.addEventListener('click', function() {
      vaterButton.classList.add('bg-indigo-500', 'text-white');
      vaterButton.classList.remove('bg-gray-200');
      mutterButton.classList.add('bg-gray-200');
      mutterButton.classList.remove('bg-indigo-500', 'text-white');
      calculateUnterhalt();
    });
    
    mutterButton.addEventListener('click', function() {
      mutterButton.classList.add('bg-indigo-500', 'text-white');
      mutterButton.classList.remove('bg-gray-200');
      vaterButton.classList.add('bg-gray-200');
      vaterButton.classList.remove('bg-indigo-500', 'text-white');
      calculateUnterhalt();
    });
  }
  
  /**
   * Fügt ein neues Kind hinzu
   */
  function addNewChild() {
    // Aktualisiere die Anzahl basierend auf vorhandenen Kindern
    updateChildrenNumbering();
    
    // Inkrementiere für das neue Kind
    kinderCount++;
    
    // Generiere Altersoptionen von 0-25
    let altersOptionen = '';
    for (let i = 0; i <= 25; i++) {
      // Setze 1 als Default
      const selected = i === 1 ? 'selected' : '';
      altersOptionen += `<option ${selected}>${i}</option>`;
    }
    
    // Vorlage für neues Kind-Element
    const kindElement = document.createElement('div');
    kindElement.id = `kind${kinderCount}`;
    kindElement.className = 'border rounded-md p-4 mt-4 bg-gray-50 kind-element';
    kindElement.dataset.kindNummer = kinderCount;
    
    kindElement.innerHTML = `
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-medium text-gray-700">Kind ${kinderCount}</h4>
        <button type="button" class="remove-kind-btn text-gray-400">&times;</button>
      </div>
      
      <div class="grid grid-cols-3 gap-4 items-center mb-3">
        <label class="block text-gray-700">Alter</label>
        <div class="col-span-2">
          <select id="kind${kinderCount}Alter" class="form-select kind-alter">
            ${altersOptionen}
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-3 gap-4 items-center mb-3">
        <label class="block text-gray-700">Lebensmittelpunkt</label>
        <div class="col-span-2">
          <select id="kind${kinderCount}Lebensmittelpunkt" class="form-select kind-lebensmittelpunkt">
            <option>Vater</option>
            <option selected>Mutter</option>
            <option>Je 50%</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-3 gap-4 items-center mb-3">
        <label class="block text-gray-700">Status</label>
        <div class="col-span-2">
          <select id="kind${kinderCount}Status" class="form-select kind-status">
            <option selected>Schüler</option>
            <option>Student</option>
            <option>Azubi</option>
            <option>Berufstätig</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-3 gap-4 items-center mb-3">
        <label class="block text-gray-700">Einkommen aus Job/Ausb.</label>
        <div class="col-span-2">
          <div class="flex">
            <input type="number" id="kind${kinderCount}Einkommen" class="form-input kind-einkommen flex-grow" value="0">
            <div class="bg-gray-100 flex items-center px-3 border border-l-0 rounded-r-md">€</div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-3 gap-4 items-center mb-3">
        <label class="block text-gray-700">Sonstiges Einkommen</label>
        <div class="col-span-2">
          <div class="flex">
            <input type="number" id="kind${kinderCount}SonstigesEinkommen" class="form-input kind-sonstiges-einkommen flex-grow" value="0">
            <div class="bg-gray-100 flex items-center px-3 border border-l-0 rounded-r-md">€</div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-3 gap-4 items-center mb-3 kindergeld-container">
        <label class="block text-gray-700">Kindergeld geht an</label>
        <div class="col-span-2">
          <div class="flex">
            <button type="button" class="w-1/2 py-2 text-center border rounded-l-md kindergeld-vater" data-value="Vater">Vater</button>
            <button type="button" class="w-1/2 py-2 text-center border rounded-r-md border-l-0 kindergeld-mutter" data-value="Mutter">Mutter</button>
          </div>
        </div>
      </div>
    `;
    
    // Kind-Element hinzufügen
    formElements.kinderContainer.appendChild(kindElement);
    
    // Event-Listener hinzufügen
    addKindEventListeners(kindElement);
    
    // Kindergeld-Toggle einrichten
    setupKindergeldToggle(kindElement);
    
    // Entfernen-Button für erstes Kind anzeigen, wenn mehr als ein Kind existiert
    if (kinderCount > 1) {
      const firstChild = document.getElementById('kind1');
      const firstChildRemoveBtn = firstChild.querySelector('.remove-kind-btn');
      if (firstChildRemoveBtn) {
        firstChildRemoveBtn.classList.remove('hidden');
      }
    }
    
    // Neu berechnen
    calculateUnterhalt();
  }
  
  /**
   * Entfernt ein Kind-Element
   */
  function removeChild(kindElement) {
    if (!kindElement) return;
    
    // Kind-Element entfernen
    kindElement.remove();
    
    // Wenn nur noch ein Kind übrig ist, den Entfernen-Button ausblenden
    const remainingChildren = document.querySelectorAll('.kind-element');
    if (remainingChildren.length === 1) {
      const removeBtn = remainingChildren[0].querySelector('.remove-kind-btn');
      if (removeBtn) {
        removeBtn.classList.add('hidden');
      }
    }
    
    // Alle Kinder neu nummerieren
    updateChildrenNumbering();
    
    // Neu berechnen
    calculateUnterhalt();
  }
  
  /**
   * Berechnet den Unterhalt basierend auf den aktuellen Eingabewerten
   */
  function calculateUnterhalt() {
    // Sammle alle Kind-Elemente
    const kindElements = document.querySelectorAll('.kind-element');
    
    // Kinderdaten sammeln
    const kinderDaten = [];
    
    // Für jedes Kind
    kindElements.forEach(kindElement => {
      const nummer = kindElement.dataset.kindNummer;
      const alter = kindElement.querySelector('.kind-alter').value;
      const lebensmittelpunkt = kindElement.querySelector('.kind-lebensmittelpunkt').value;
      const status = kindElement.querySelector('.kind-status').value;
      const eigenesEinkommen = kindElement.querySelector('.kind-einkommen').value;
      const sonstigesEinkommen = kindElement.querySelector('.kind-sonstiges-einkommen').value;
      
      // Kindergeld-Berechtigter ermitteln
      let kindergeldBerechtigter = lebensmittelpunkt;
      const vaterBtn = kindElement.querySelector('.kindergeld-vater');
      const mutterBtn = kindElement.querySelector('.kindergeld-mutter');
      
      if (vaterBtn && mutterBtn) {
        if (vaterBtn.classList.contains('bg-indigo-500')) {
          kindergeldBerechtigter = 'Vater';
        } else if (mutterBtn.classList.contains('bg-indigo-500')) {
          kindergeldBerechtigter = 'Mutter';
        }
      }
      
      kinderDaten.push({
        nummer: nummer,
        alter: parseInt(alter),
        lebensmittelpunkt: lebensmittelpunkt,
        status: status,
        eigenesEinkommen: parseInt(eigenesEinkommen) || 0,
        sonstigesEinkommen: parseInt(sonstigesEinkommen) || 0,
        kindergeldBerechtigter: kindergeldBerechtigter
      });
    });
    
    // Parameter für die Berechnung zusammenstellen
    const params = {
      vaterNetto: parseInt(formElements.vaterNetto.value) || 0,
      vaterSonstigesEinkommen: parseInt(formElements.vaterSonstigesEinkommen.value) || 0,
      vaterWohnvorteil: parseInt(formElements.vaterWohnvorteil.value) || 0,
      vaterSchulden: parseInt(formElements.vaterSchulden.value) || 0,
      
      mutterNetto: parseInt(formElements.mutterNetto.value) || 0,
      mutterSonstigesEinkommen: parseInt(formElements.mutterSonstigesEinkommen.value) || 0,
      mutterWohnvorteil: parseInt(formElements.mutterWohnvorteil.value) || 0,
      mutterSchulden: parseInt(formElements.mutterSchulden.value) || 0,
      
      kinderDaten: kinderDaten
    };
    
    // Berechnung durchführen
    const ergebnis = unterhaltRechner.berechneKindesunterhalt(params);
    
    // Ergebnisse anzeigen
    updateResults(ergebnis);
  }
  
  /**
   * Aktualisiert die Ergebnisanzeige
   */
  function updateResults(ergebnis) {
    // Formatierungsfunktion für Zahlen
    const formatNumber = (num) => {
      return num.toLocaleString('de-DE');
    };
    
    // Netto
    resultElements.vaterNettoBereinigt.textContent = formatNumber(Math.round(ergebnis.eltern.vater.nettoBereinigt));
    resultElements.mutterNettoBereinigt.textContent = formatNumber(Math.round(ergebnis.eltern.mutter.nettoBereinigt));
    
    // Zahlungen für jedes Kind aktualisieren
    updateKinderZahlungen(ergebnis.kinder);
    
    // Zusammenfassung aktualisieren
    resultElements.vaterNettoBerechnung.textContent = formatNumber(Math.round(ergebnis.eltern.vater.nettoBereinigt));
    resultElements.mutterNettoBerechnung.textContent = formatNumber(Math.round(ergebnis.eltern.mutter.nettoBereinigt));
    
    resultElements.vaterZahltGesamt.textContent = formatNumber(Math.round(ergebnis.eltern.vater.zahlt));
    resultElements.mutterZahltGesamt.textContent = formatNumber(Math.round(ergebnis.eltern.mutter.zahlt));
    
    resultElements.vaterErhaeltUnterhalt.textContent = formatNumber(Math.round(ergebnis.eltern.vater.erhaeltUnterhalt));
    resultElements.mutterErhaeltUnterhalt.textContent = formatNumber(Math.round(ergebnis.eltern.mutter.erhaeltUnterhalt));
    
    resultElements.vaterErhaeltKindergeld.textContent = formatNumber(Math.round(ergebnis.eltern.vater.erhaeltKindergeld));
    resultElements.mutterErhaeltKindergeld.textContent = formatNumber(Math.round(ergebnis.eltern.mutter.erhaeltKindergeld));
    
    resultElements.vaterNettoVerfuegbar.textContent = formatNumber(Math.round(ergebnis.eltern.vater.nettoVerfuegbar));
    resultElements.mutterNettoVerfuegbar.textContent = formatNumber(Math.round(ergebnis.eltern.mutter.nettoVerfuegbar));
    
    // Make sure Euro symbols are displayed properly
    if (typeof addEuroSymbol === 'function') {
      addEuroSymbol();
    }
  }
  
  /**
   * Aktualisiert die Zahlungen für die Kinder in der Ergebnistabelle
   */
  function updateKinderZahlungen(kinderErgebnisse) {
    // Container leeren (außer der Header-Zeile)
    const container = formElements.kinderZahlungenContainer;
    const headerRow = container.querySelector('.grid-cols-3.gap-4.mb-3');
    container.innerHTML = '';
    container.appendChild(headerRow);
    
    // Für jedes Kind eine Zeile erstellen
    kinderErgebnisse.forEach((kind, index) => {
      const kindNummer = kind.kind.nummer || (index + 1);
      const alter = kind.kind.alter;
      const vaterZahlt = kind.berechnung.vaterZahlt;
      const mutterZahlt = kind.berechnung.mutterZahlt;
      
      const kindRow = document.createElement('div');
      kindRow.className = 'grid grid-cols-3 gap-4 items-center mb-2';
      kindRow.innerHTML = `
        <div class="text-gray-700 font-medium">Unterh. für Kind ${kindNummer} (${alter} J.)</div>
        <div class="text-right px-3 py-2 bg-white rounded shadow-sm font-mono">${vaterZahlt > 0 ? formatNumber(vaterZahlt) : '⟸'}</div>
        <div class="text-right px-3 py-2 bg-white rounded shadow-sm font-mono">${mutterZahlt > 0 ? formatNumber(mutterZahlt) : '⟸'}</div>
      `;
      
      container.appendChild(kindRow);
    });
    
    // Make sure Euro symbols are displayed for dynamically created elements
    if (typeof addEuroSymbol === 'function') {
      addEuroSymbol();
    }
  }
  
  /**
   * Formatiert eine Zahl als lokalisierter String mit €-Symbol
   */
  function formatNumber(num) {
    return num.toLocaleString('de-DE') + ' €';
  }
}); 