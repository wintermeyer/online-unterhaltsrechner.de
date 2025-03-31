# Unterhaltsrechner

Eine leichtgewichtige Single-Page-Anwendung zur Berechnung von Kindesunterhalt.

## Funktionen

- Eingabe von Eltern-Einkommen (Netto, Sonstige, Wohnvorteil, Schulden)
- Dynamisches Hinzufügen/Entfernen von Kindern
- Echtzeit-Aktualisierung der JSON-Daten bei jeder Eingabe
- Responsive Design für Desktop und Mobile
- Optimiert für größere Bildschirme (Eingabe links, JSON-Ausgabe rechts)

## Technologie

- Vanilla JavaScript (keine Frameworks)
- TailwindCSS für Styling
- HTML5

## Installation und Start

1. Installieren der Abhängigkeiten:

```bash
npm install
```

2. TailwindCSS kompilieren:

```bash
npm run build
```

3. Öffnen Sie `index.html` in Ihrem Browser oder verwenden Sie einen lokalen Server:

```bash
npx serve
```

## Bedienung

- Geben Sie die Einkommensdaten der Eltern ein
- Fügen Sie so viele Kinder hinzu, wie benötigt (mit "Kind hinzufügen" Button)
- Jede Eingabe aktualisiert das JSON auf der rechten Seite in Echtzeit
- Bei Bedarf können Sie weitere finanzielle Details ein- und ausklappen

## Weiterentwicklung

In einem zukünftigen Schritt kann die Anwendung um die eigentliche Unterhaltsberechnung erweitert werden. Aktuell wird nur der Datensatz erstellt und angezeigt.
