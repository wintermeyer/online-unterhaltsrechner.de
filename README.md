# Unterhaltsrechner

Eine mobile-first Webseite mit Tailwind CSS und Hamburger-Menü.

## Features

- Mobile-first Design
- Responsive Navigation mit Hamburger-Menü
- Tailwind CSS für modernes Styling
- Einfache und benutzerfreundliche Oberfläche
- Automatische Berechnung basierend auf der Düsseldorfer Tabelle

## Entwicklung

### Voraussetzungen

- Node.js (Version 14 oder höher)
- npm (kommt mit Node.js)

### Installation

1. Repository klonen:
   ```bash
   git clone [repository-url]
   cd [repository-name]
   ```

2. Node.js Abhängigkeiten installieren:
   ```bash
   npm install
   ```

3. Playwright Browser installieren:
   ```bash
   npx playwright install chromium
   ```

### Entwicklungsprozess

#### Tests

Wir verwenden Playwright für automatisierte Tests. Alle Änderungen müssen die Tests bestehen, bevor sie eingereicht werden können.

1. **Tests ausführen**
   ```bash
   npm test                 # Führt alle Tests aus
   npm run test:ui         # Öffnet die Test-UI für debugging
   ```

2. **Neue Features entwickeln**
   - Schreiben Sie zuerst einen Test für das neue Feature
   - Implementieren Sie das Feature
   - Stellen Sie sicher, dass alle Tests erfolgreich sind
   - Commit erstellen

3. **Bestehende Features ändern**
   - Führen Sie die Tests aus, um den aktuellen Zustand zu überprüfen
   - Implementieren Sie die Änderungen
   - Stellen Sie sicher, dass alle Tests weiterhin erfolgreich sind
   - Commit erstellen

4. **Test-Dateien**
   - Tests befinden sich im `/tests` Verzeichnis
   - Jede Test-Datei endet mit `.spec.js`
   - Aktuelle Tests:
     - `initial-state.spec.js`: Überprüft den initialen Zustand der Anwendung

5. **Debugging fehlgeschlagener Tests**
   ```bash
   # Öffnen Sie die Test-UI für visuelles Debugging
   npm run test:ui
   
   # Führen Sie einen spezifischen Test aus
   npx playwright test tests/initial-state.spec.js
   
   # Tests mit Debug-Ausgabe
   npx playwright test --debug
   ```

### Continuous Integration

- Alle Tests müssen bestanden werden, bevor Änderungen eingereicht werden können
- Die Tests werden automatisch bei jedem Push ausgeführt
- Fehlgeschlagene Tests müssen behoben werden, bevor der Code gemerged werden kann

## Verwendung

1. Öffnen Sie die `index.html` Datei in einem modernen Webbrowser
2. Die Seite ist sofort einsatzbereit und funktioniert ohne zusätzliche Installation

## Technische Details

- Verwendet Tailwind CSS über CDN
- Responsive Design mit Breakpoints
- Hamburger-Menü für mobile Ansicht
- JavaScript für Menü-Toggle-Funktionalität

## Browser Support

Die Seite unterstützt alle modernen Browser:
- Chrome
- Firefox
- Safari
- Edge 