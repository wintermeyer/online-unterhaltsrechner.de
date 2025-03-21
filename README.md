# Kindesunterhalt-Rechner

Eine einfache JavaScript-Implementierung eines Kindesunterhalt-Rechners basierend auf der Düsseldorfer Tabelle 2025.

## Features

- Berechnung des Kindesunterhalts nach der Düsseldorfer Tabelle 2025
- Berücksichtigung von:
  - Netto-Einkommen beider Elternteile
  - Sonstiges Einkommen
  - Wohnvorteil
  - Schulden
  - Alter und Status der Kinder
  - Lebensmittelpunkt der Kinder
  - Eigenes Einkommen der Kinder
  - Kindergeld-Verteilung
- Mobile-First Design mit TailwindCSS
- Keine Abhängigkeiten von externen Bibliotheken oder Frameworks

## Schnellstart

1. Kopieren Sie die folgenden Dateien in Ihr Projekt:
   - `js/unterhalt.js` - Die Kernlogik für die Berechnung
   - `js/app.js` - UI-Integration und Event-Handling
   - `index.html` - HTML-Struktur (oder verwenden Sie die relevanten Teile)

2. Binden Sie TailwindCSS ein (via CDN oder lokale Installation)

3. Binden Sie die JavaScript-Dateien ein:

```html
<script src="js/unterhalt.js"></script>
<script src="js/app.js"></script>
```

## Integration in bestehende Webseiten

Es gibt mehrere Möglichkeiten, diesen Rechner in bestehende Webseiten zu integrieren:

### Option 1: Vollständige Einbettung

Kopieren Sie den vollständigen HTML-Code aus `index.html` in Ihre Webseite und passen Sie das Styling nach Bedarf an.

### Option 2: Integration nur der funktionalen Komponenten

1. Kopieren Sie die JavaScript-Dateien (`unterhalt.js`, `app.js`) in Ihr Projekt
2. Erstellen Sie ein Container-Element in Ihrer Webseite:

```html
<div id="kindesunterhalt-rechner">
  <!-- Hier wird der Rechner eingefügt -->
</div>
```

3. Erstellen Sie eine eigene Initialisierungsfunktion:

```javascript
function initKindesunterhaltRechner(containerId) {
  const container = document.getElementById(containerId);
  // HTML-Struktur aus index.html kopieren und in container einfügen
  // Anschließend Rechner initialisieren
  const rechner = new Unterhalt();
  // Hier weitere Initialisierungslogik...
}

// Beim Laden der Seite aufrufen
document.addEventListener('DOMContentLoaded', function() {
  initKindesunterhaltRechner('kindesunterhalt-rechner');
});
```

### Option 3: Als iframe einbetten

Wenn Sie keine Änderungen am Code vornehmen möchten, können Sie den Rechner auch als iframe einbetten:

```html
<iframe src="path/to/kindesunterhalt-rechner/index.html" width="100%" height="800" style="border:none;"></iframe>
```

## Anpassung der Berechnungslogik

Die Berechnungslogik ist in der Datei `js/unterhalt.js` implementiert. Hier können Sie Änderungen vornehmen, wenn sich die Düsseldorfer Tabelle ändert oder Sie andere Parameter anpassen möchten.

Die wichtigsten Funktionen sind:

- `berechneKindesunterhalt(params)`: Hauptfunktion zur Berechnung des Unterhalts
- `berechneNettoBereinigt(einkommen, sonstigesEinkommen, wohnvorteil, schulden)`: Berechnet das bereinigte Nettoeinkommen
- `bestimmeEinkommensgruppe(bereinigterBetrag)`: Bestimmt die Einkommensgruppe nach der Düsseldorfer Tabelle
- `berechneZahlbetrag(tabellenunterhalt, anzurechnendesKindergeld, eigenesEinkommen)`: Berechnet den Zahlbetrag

## Anpassung des Designs

Das Design basiert auf TailwindCSS. Sie können es einfach anpassen, indem Sie die CSS-Klassen in der HTML-Struktur ändern oder Ihre eigenen Styles hinzufügen.

Für eine vollständig angepasste Integration können Sie auch die HTML-Struktur komplett neu erstellen und nur die JavaScript-Logik verwenden.

## Browser-Kompatibilität

Der Rechner funktioniert in allen modernen Browsern (Chrome, Firefox, Safari, Edge).

## Testen

Das Projekt verfügt über eine umfangreiche Testsuite, um die Funktionalität zu überprüfen und Regressionen zu vermeiden. Die Tests basieren auf Puppeteer für die Browser-Automatisierung.

### Voraussetzungen

- Node.js installiert
- Puppeteer und andere Abhängigkeiten installiert (`npm install`)

### Tests ausführen

#### Alle Tests ausführen

```bash
node tests/run-tests.js
```

Dieser Befehl führt alle Testfälle aus und gibt eine Zusammenfassung der Ergebnisse aus.

#### Einzelne Tests ausführen

Um einen bestimmten Test auszuführen:

```bash
node tests/[testname].test.js
```

Beispiel:

```bash
node tests/child-status-visibility.test.js
```

### Verfügbare Tests

- `child-status-visibility.test.js` - Prüft, ob die Statusfelder für Kinder unabhängig vom Alter immer sichtbar sind
- `collapsible.test.js` - Testet die Funktionalität der ausklappbaren Abschnitte
- `second-child-label-click.test.js` - Prüft das Klickverhalten bei Labels für das zweite Kind
- `child-income.test.js` - Testet die Funktionalität des Einkommensbereichs für Kinder
- `child-income-text-click.test.js` - Prüft das Klickverhalten bei Einkommens-Textlabels
- `initial-status-visibility.test.js` - Testet die anfängliche Sichtbarkeit der Statusfelder

## Lizenz

Frei zur Verwendung für private und kommerzielle Zwecke. 