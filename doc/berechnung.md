Hier ist ein detaillierter Algorithmus zur Berechnung des Kindesunterhalts basierend auf der Düsseldorfer Tabelle 2025. 

---

## **Schrittweiser Algorithmus für die Berechnung des Kindesunterhalts**

### **Eingabeparameter (Input)**
1. **Jahr der Berechnung** (z. B. 2025)
2. **Einkommen der Eltern:**
   - Netto-Einkommen Vater
   - Netto-Einkommen Mutter
   - Sonstiges Einkommen (optional)
   - Wohnvorteil (optional)
   - Aufwand für Schulden (optional)

3. **Kinder:**
   - Anzahl der gemeinsamen Kinder
   - Alter jedes Kindes
   - Lebensmittelpunkt (Vater, Mutter, 50/50)
   - Status jedes Kindes (Schüler, Azubi etc.)
   - Einkommen aus Job oder Ausbildung
   - Wer das Kindergeld erhält

---

### **Berechnungsschritte (Algorithmus)**

#### **1. Bereinigung des Nettoeinkommens der Eltern**
- **Berufsbedingte Aufwendungen** abziehen:
  - **5 % Pauschale** vom Netto-Einkommen abziehen, mindestens **50 €**, maximal **150 €**.
- **Sonstiges Einkommen hinzufügen** (z. B. Mieteinnahmen).
- **Wohnvorteil hinzufügen** (falls ein Elternteil mietfrei wohnt).
- **Schulden abziehen**, falls es ehebedingte Schulden sind.

\[ \text{Bereinigtes Einkommen} = \text{Nettoeinkommen} - \text{Aufwand} + \text{Sonstiges Einkommen} + \text{Wohnvorteil} - \text{Schulden} \]

---

#### **2. Einstufung der Eltern in Einkommensgruppen**
- Die Einkommensgruppe wird anhand des **bereinigten Nettoeinkommens** mit der Düsseldorfer Tabelle abgeglichen.

---

#### **3. Bestimmung des Tabellenunterhalts für jedes Kind**
- Finde die zutreffende Einkommensgruppe und das **Tabellenunterhaltsniveau** für das Alter des Kindes aus der Düsseldorfer Tabelle.
- Falls es mehrere Kinder gibt, bleibt der Elternteil in der Gruppe, **es sei denn, er hat weitere Unterhaltspflichten** (z. B. für Ehepartner), die eine Herabstufung erfordern.

---

#### **4. Anrechnung von Einkommen des Kindes**
- Falls das Kind Einkommen hat, wird es wie folgt verrechnet:
  - **Schüler/Studenten**: 50 € bleiben anrechnungsfrei, der Rest wird **zur Hälfte** abgezogen.
  - **Azubis, die zu Hause wohnen**: 100 € bleiben anrechnungsfrei, der Rest wird **komplett** abgezogen.

---

#### **5. Anrechnung des Kindergelds**
- Falls das Kind **minderjährig** ist, wird **die Hälfte des Kindergelds (127,50 €)** vom Unterhalt abgezogen.
- Falls das Kind **volljährig** ist, wird **das gesamte Kindergeld (255 €)** angerechnet.
- Falls das Kind **im Wechselmodell lebt**, wird das Kindergeld hälftig auf beide Eltern aufgeteilt.

---

#### **6. Berechnung des Zahlbetrags für jedes Kind**
- Zahlbetrag = Tabellenbetrag – angerechnetes Kindergeld – angerechnetes Einkommen des Kindes.

---

#### **7. Ermittlung der Unterhaltspflicht**
- **Wer zahlt an wen?**
  - Falls das Kind beim Vater lebt, zahlt die Mutter den Unterhalt (und umgekehrt).
  - Falls 50/50-Betreuung vorliegt, zahlt der Besserverdienende **die Differenz**.
  - Falls beide Eltern unterhaltspflichtig sind (z. B. bei volljährigen Kindern), wird das Verhältnis der Einkommen berücksichtigt.

---

#### **8. Überprüfung des Selbstbehalts**
- Falls das verfügbare Einkommen des unterhaltspflichtigen Elternteils nach Zahlung unter den Selbstbehalt fällt:
  - Mindestselbstbehalt für Erwerbstätige: **1.450 €**.
  - Mindestselbstbehalt für Nichterwerbstätige: **1.200 €**.
  - Falls das verfügbare Einkommen nicht reicht, wird der Unterhalt **anteilig gekürzt (Mangelfallberechnung)**.

---

#### **9. Berechnung des verfügbaren Nettoeinkommens nach Unterhalt**
\[ \text{Neues verfügbares Einkommen} = \text{Bereinigtes Einkommen} - \text{zu zahlender Unterhalt} + \text{zu erhaltender Unterhalt} + \text{Kindergeld} \]

---

### **Testfälle für Test-Driven Development (TDD)**
#### **Testfall 1: Standardfall mit zwei Kindern**
- Vater verdient **2.500 €**, Mutter **4.000 €**.
- Zwei Kinder: **14 Jahre (lebt beim Vater), 16 Jahre (50/50)**.
- Düsseldorfer Tabelle gibt für das Einkommen **714 € für 14-Jährige, 763 € für 16-Jährige**.
- Kindergeld wird berücksichtigt (50 % für Minderjährige, 100 % für Volljährige).

**Erwartete Berechnung:**
- Mutter zahlt für das **14-jährige Kind** **714 € - 127,50 € = 586,50 €**.
- Mutter zahlt für das **16-jährige Kind** **763 € - 127,50 € = 635,50 €**.
- Vater zahlt nichts, da das 14-jährige Kind bei ihm lebt.
- **Gesamtsumme: Mutter zahlt 1.272 €.**

---

#### **Testfall 2: Mangelfall mit niedrigem Einkommen**
- Vater verdient **1.600 €**, Mutter **2.100 €**.
- Ein 12-jähriges Kind, lebt bei der Mutter.
- Düsseldorfer Tabelle: **649 €**.
- Kindergeld: **127,50 € Abzug**.
- Zahlbetrag = **521,50 €**.
- Selbstbehalt des Vaters **1.450 €**, nach Abzug bleibt **1.600 € - 521,50 € = 1.078,50 €**.
- **Vater kann nicht vollen Betrag zahlen → Anpassung nach Mangelfallregelung**.

---

#### **Testfall 3: Volljähriges Kind mit eigenem Haushalt**
- Vater verdient **2.900 €**, Mutter **3.700 €**.
- 18-jähriges Kind mit eigener Wohnung.
- Düsseldorfer Tabelle: **693 €**.
- Kindergeld **255 € wird komplett angerechnet**.
- Zahlbetrag = **693 € - 255 € = 438 €**.
- **Eltern teilen den Betrag anteilig nach Einkommen (2.900€ vs. 3.700€).**
