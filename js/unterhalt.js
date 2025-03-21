/**
 * Kindesunterhalt - Core calculation class
 */
class Unterhalt {
  constructor() {
    this.duesseldorferTabelle = {
      // Tabellenwerte 2025
      einkommensGruppen: [
        { max: 2100, faktor: 1.00, bedarfskontrollbetrag: { erwerbstaetig: 1450, nichtErwerbstaetig: 1200 } },
        { min: 2101, max: 2500, faktor: 1.05, bedarfskontrollbetrag: 1750 },
        { min: 2501, max: 2900, faktor: 1.10, bedarfskontrollbetrag: 1850 },
        { min: 2901, max: 3300, faktor: 1.15, bedarfskontrollbetrag: 1950 },
        { min: 3301, max: 3700, faktor: 1.20, bedarfskontrollbetrag: 2050 },
        { min: 3701, max: 4100, faktor: 1.28, bedarfskontrollbetrag: 2150 },
        { min: 4101, max: 4500, faktor: 1.36, bedarfskontrollbetrag: 2250 },
        { min: 4501, max: 4900, faktor: 1.44, bedarfskontrollbetrag: 2350 },
        { min: 4901, max: 5300, faktor: 1.52, bedarfskontrollbetrag: 2450 },
        { min: 5301, max: 5700, faktor: 1.60, bedarfskontrollbetrag: 2550 },
        { min: 5701, max: 6400, faktor: 1.68, bedarfskontrollbetrag: 2850 },
        { min: 6401, max: 7200, faktor: 1.76, bedarfskontrollbetrag: 3250 },
        { min: 7201, max: 8200, faktor: 1.84, bedarfskontrollbetrag: 3750 },
        { min: 8201, max: 9700, faktor: 1.92, bedarfskontrollbetrag: 4350 },
        { min: 9701, max: 11200, faktor: 2.00, bedarfskontrollbetrag: 5050 }
      ],
      
      // Altersstufen
      altersstufen: [
        { max: 5, bedarfsBasis: 482 },
        { min: 6, max: 11, bedarfsBasis: 554 },
        { min: 12, max: 17, bedarfsBasis: 649 },
        { min: 18, bedarfsBasis: 693 }
      ],
      
      // Zahlbeträge (bereits abzüglich des anzurechnenden Kindergelds)
      zahlbetraege: {
        altersstufe1: [354.50, 379.50, 403.50, 427.50, 451.50, 489.50, 528.50, 567.50, 605.50, 644.50],
        altersstufe2: [426.50, 454.50, 482.50, 510.50, 537.50, 582.50, 626.50, 670.50, 715.50, 759.50],
        altersstufe3: [521.50, 554.50, 586.50, 619.50, 651.50, 703.50, 755.50, 807.50, 859.50, 911.50],
        altersstufe4: [438.00, 473.00, 508.00, 542.00, 577.00, 633.00, 688.00, 743.00, 799.00, 854.00]
      }
    };
    
    this.kindergeld = 255; // Kindergeld 2025 pro Kind
    this.selbstbehalt = {
      erwerbstaetig: 1450,
      nichtErwerbstaetig: 1200,
      angemessen: 1750 // für volljährige nicht privilegierte Kinder
    };
    
    // Berufsbedingter Aufwand (Pauschale)
    this.berufsbedingtePauschale = {
      minBetrag: 50,
      maxBetrag: 150,
      prozentsatz: 0.05 // 5% vom Nettoeinkommen
    };
  }
  
  /**
   * Berechne bereinigtes Nettoeinkommen
   */
  berechneNettoBereinigt(einkommen, sonstigesEinkommen = 0, wohnvorteil = 0, schulden = 0) {
    let netto = Number(einkommen) || 0;
    
    // Berufsbedingter Aufwand berechnen
    let berufsbedingterAufwand = netto * this.berufsbedingtePauschale.prozentsatz;
    berufsbedingterAufwand = Math.max(this.berufsbedingtePauschale.minBetrag, 
                                     Math.min(this.berufsbedingtePauschale.maxBetrag, berufsbedingterAufwand));
    
    // Bereinigtes Einkommen berechnen
    const sonstiges = Number(sonstigesEinkommen) || 0;
    const wohnVorteil = Number(wohnvorteil) || 0;
    const schuldenBetrag = Number(schulden) || 0;
    
    // Berechnen und auf 0 begrenzen (bereinigtes Einkommen kann nicht negativ sein)
    const bereinigt = netto - berufsbedingterAufwand + sonstiges + wohnVorteil - schuldenBetrag;
    return Math.max(0, bereinigt);
  }
  
  /**
   * Bestimme Einkommensgruppe anhand des bereinigten Einkommens
   */
  bestimmeEinkommensgruppe(bereinigterBetrag) {
    const gruppe = this.duesseldorferTabelle.einkommensGruppen.find(
      gruppe => (!gruppe.min || bereinigterBetrag >= gruppe.min) && 
               (!gruppe.max || bereinigterBetrag <= gruppe.max)
    );
    
    return gruppe || this.duesseldorferTabelle.einkommensGruppen[this.duesseldorferTabelle.einkommensGruppen.length - 1];
  }
  
  /**
   * Bestimme Altersstufe des Kindes
   */
  bestimmeAltersstufe(alter) {
    const stufe = this.duesseldorferTabelle.altersstufen.find(
      stufe => (!stufe.min || alter >= stufe.min) && 
              (!stufe.max || alter <= stufe.max)
    );
    
    return stufe || this.duesseldorferTabelle.altersstufen[this.duesseldorferTabelle.altersstufen.length - 1];
  }
  
  /**
   * Berechne Tabellenbetrag ohne Kindergeldabzug
   */
  berechneTabellenunterhalt(einkommensgruppe, altersstufe) {
    // Basisbedarf für die Altersstufe finden
    const basisBedarf = altersstufe.bedarfsBasis;
    
    // Mit dem Faktor der Einkommensgruppe multiplizieren
    return Math.round(basisBedarf * einkommensgruppe.faktor);
  }
  
  /**
   * Berechne anzurechnendes Kindergeld
   */
  berechneAnzurechnendesKindergeld(alter, lebensmittelpunkt = "normal") {
    // Bei Minderjährigen: 50% des Kindergeldes anrechnen
    // Bei Volljährigen: 100% des Kindergeldes anrechnen
    // Bei Wechselmodell (50/50): jeweils hälftiger Abzug
    
    if (lebensmittelpunkt === "Je 50%") {
      return this.kindergeld / 4; // 1/4 vom Kindergeld für jeden Elternteil im Wechselmodell
    }
    
    if (alter < 18) {
      return this.kindergeld / 2; // 50% für Minderjährige
    }
    
    return this.kindergeld; // 100% für Volljährige
  }
  
  /**
   * Berechne den Zahlbetrag für ein Kind
   */
  berechneZahlbetrag(tabellenunterhalt, anzurechnendesKindergeld, eigenesEinkommen = 0) {
    // Eigenes Einkommen des Kindes berücksichtigen
    let anrechnungsfrei = 0;
    let anrechnungsAnteil = 0;
    
    // Anrechnungsfreier Betrag und Anrechnungsanteil je nach Status
    if (eigenesEinkommen > 0) {
      anrechnungsfrei = 50; // Für Schüler/Studenten
      anrechnungsAnteil = 0.5; // 50% des übersteigenden Betrags
      
      // Spezialfall Azubi der zu Hause wohnt könnte hier ergänzt werden
      // anrechnungsfrei = 100; anrechnungsAnteil = 1.0;
    }
    
    // Berechne anzurechnendes Einkommen des Kindes
    let anzurechnendesEinkommen = 0;
    if (eigenesEinkommen > anrechnungsfrei) {
      anzurechnendesEinkommen = (eigenesEinkommen - anrechnungsfrei) * anrechnungsAnteil;
    }
    
    // Zahlbetrag berechnen
    const zahlbetrag = tabellenunterhalt - anzurechnendesKindergeld - anzurechnendesEinkommen;
    
    return Math.max(0, Math.round(zahlbetrag));
  }
  
  /**
   * Prüfe Selbstbehalt des unterhaltspflichtigen Elternteils
   */
  pruefeSelbstbehalt(nettoBereinigt, zuZahlenderUnterhalt, istErwerbstaetig = true, kindPrivilegiert = true) {
    // Bestimme den anzuwendenden Selbstbehalt
    let selbstbehalt;
    
    if (kindPrivilegiert) {
      // Notwendiger Selbstbehalt (minderjährige und privilegierte volljährige Kinder)
      selbstbehalt = istErwerbstaetig ? this.selbstbehalt.erwerbstaetig : this.selbstbehalt.nichtErwerbstaetig;
    } else {
      // Angemessener Selbstbehalt (für nicht-privilegierte Kinder)
      selbstbehalt = this.selbstbehalt.angemessen;
    }
    
    // Prüfen, ob der Selbstbehalt unterschritten wird
    const verbleibenderBetrag = nettoBereinigt - zuZahlenderUnterhalt;
    
    if (verbleibenderBetrag < selbstbehalt) {
      // Mangelfall: Reduziere den Unterhalt auf den verfügbaren Betrag
      const verfuegbarerUnterhalt = Math.max(0, nettoBereinigt - selbstbehalt);
      return {
        istMangelfall: true,
        verfuegbarerUnterhalt,
        ursprueglicherUnterhalt: zuZahlenderUnterhalt,
        selbstbehalt
      };
    }
    
    return {
      istMangelfall: false,
      verfuegbarerUnterhalt: zuZahlenderUnterhalt,
      ursprueglicherUnterhalt: zuZahlenderUnterhalt,
      selbstbehalt
    };
  }
  
  /**
   * Berechne den Unterhalt für mehrere Kinder (ggf. Mangelfallberechnung)
   */
  berechneUnterhaltMehrereKinder(nettoBereinigt, kinderZahlbetraege, istErwerbstaetig = true) {
    const gesamtUnterhalt = kinderZahlbetraege.reduce((sum, betrag) => sum + betrag, 0);
    
    // Prüfen, ob Mangelfall vorliegt
    const mangelfallInfo = this.pruefeSelbstbehalt(nettoBereinigt, gesamtUnterhalt, istErwerbstaetig);
    
    if (!mangelfallInfo.istMangelfall) {
      // Kein Mangelfall - volle Zahlbeträge können gezahlt werden
      return {
        istMangelfall: false,
        angepassteZahlbetraege: kinderZahlbetraege,
        verfuegbarerGesamtbetrag: gesamtUnterhalt
      };
    }
    
    // Mangelfall - Berechne anteilige Kürzung
    const verfuegbarerBetrag = mangelfallInfo.verfuegbarerUnterhalt;
    const angepassteZahlbetraege = [];
    
    if (verfuegbarerBetrag <= 0) {
      // Nichts verfügbar
      return {
        istMangelfall: true,
        angepassteZahlbetraege: kinderZahlbetraege.map(() => 0),
        verfuegbarerGesamtbetrag: 0,
        mangelfallInfo
      };
    }
    
    // Anteilige Verteilung des verfügbaren Betrags im Verhältnis der ursprünglichen Ansprüche
    for (const zahlbetrag of kinderZahlbetraege) {
      const anteil = zahlbetrag / gesamtUnterhalt;
      const angepassterBetrag = Math.round(verfuegbarerBetrag * anteil);
      angepassteZahlbetraege.push(angepassterBetrag);
    }
    
    return {
      istMangelfall: true,
      angepassteZahlbetraege,
      verfuegbarerGesamtbetrag: verfuegbarerBetrag,
      mangelfallInfo
    };
  }
  
  /**
   * Berechne Unterhalt für ein Kind nach Düsseldorfer Tabelle
   */
  berechneKindesunterhalt(params) {
    const {
      vaterNetto = 0,
      vaterSonstigesEinkommen = 0,
      vaterWohnvorteil = 0,
      vaterSchulden = 0,
      vaterErwerbstaetig = true,
      
      mutterNetto = 0,
      mutterSonstigesEinkommen = 0,
      mutterWohnvorteil = 0,
      mutterSchulden = 0,
      mutterErwerbstaetig = true,
      
      kinderDaten = []
    } = params;
    
    // Bereinigtes Nettoeinkommen berechnen
    const vaterNettoBereinigt = this.berechneNettoBereinigt(
      vaterNetto, vaterSonstigesEinkommen, vaterWohnvorteil, vaterSchulden
    );
    
    const mutterNettoBereinigt = this.berechneNettoBereinigt(
      mutterNetto, mutterSonstigesEinkommen, mutterWohnvorteil, mutterSchulden
    );
    
    // Einkommensgruppen bestimmen
    const vaterGruppe = this.bestimmeEinkommensgruppe(vaterNettoBereinigt);
    const mutterGruppe = this.bestimmeEinkommensgruppe(mutterNettoBereinigt);
    
    // Für jedes Kind den Unterhalt berechnen
    const ergebnisse = [];
    const vaterZahlbetraege = [];
    const mutterZahlbetraege = [];
    
    for (const kind of kinderDaten) {
      const {
        nummer = 1,
        alter,
        lebensmittelpunkt,
        status,
        eigenesEinkommen = 0,
        sonstigesEinkommen = 0,
        kindergeldBerechtigter = lebensmittelpunkt
      } = kind;
      
      // Altersstufe bestimmen
      const altersstufe = this.bestimmeAltersstufe(alter);
      
      // Tabellenunterhaltsbeträge berechnen
      const vaterTabellenbetrag = this.berechneTabellenunterhalt(vaterGruppe, altersstufe);
      const mutterTabellenbetrag = this.berechneTabellenunterhalt(mutterGruppe, altersstufe);
      
      // Anzurechnendes Kindergeld bestimmen
      const anzurechnendesKindergeld = this.berechneAnzurechnendesKindergeld(alter, lebensmittelpunkt);
      
      // Zahlbeträge berechnen
      const vaterZahlbetrag = this.berechneZahlbetrag(vaterTabellenbetrag, anzurechnendesKindergeld, eigenesEinkommen);
      const mutterZahlbetrag = this.berechneZahlbetrag(mutterTabellenbetrag, anzurechnendesKindergeld, eigenesEinkommen);
      
      // Wer zahlt an wen?
      let vaterZahlt = 0;
      let mutterZahlt = 0;
      
      if (lebensmittelpunkt === "Vater") {
        // Kind lebt beim Vater, Mutter zahlt
        mutterZahlt = mutterZahlbetrag;
      } else if (lebensmittelpunkt === "Mutter") {
        // Kind lebt bei der Mutter, Vater zahlt
        vaterZahlt = vaterZahlbetrag;
      } else if (lebensmittelpunkt === "Je 50%") {
        // Wechselmodell: Besserverdienender zahlt die Differenz
        if (vaterNettoBereinigt > mutterNettoBereinigt) {
          vaterZahlt = Math.max(0, (vaterZahlbetrag - mutterZahlbetrag) / 2);
        } else {
          mutterZahlt = Math.max(0, (mutterZahlbetrag - vaterZahlbetrag) / 2);
        }
      } else if (Number(alter) >= 18) {
        // Volljähriges Kind, beide Eltern sind barunterhaltspflichtig anteilig nach Einkommen
        const gesamtEinkommen = vaterNettoBereinigt + mutterNettoBereinigt;
        const vaterAnteil = gesamtEinkommen > 0 ? vaterNettoBereinigt / gesamtEinkommen : 0.5;
        const mutterAnteil = gesamtEinkommen > 0 ? mutterNettoBereinigt / gesamtEinkommen : 0.5;
        
        vaterZahlt = Math.round(vaterTabellenbetrag * vaterAnteil);
        mutterZahlt = Math.round(mutterTabellenbetrag * mutterAnteil);
      }
      
      // Zahlbeträge für spätere Mangelfallberechnung speichern
      if (vaterZahlt > 0) vaterZahlbetraege.push(vaterZahlt);
      if (mutterZahlt > 0) mutterZahlbetraege.push(mutterZahlt);
      
      ergebnisse.push({
        kind: {
          nummer,
          alter,
          lebensmittelpunkt,
          status,
          eigenesEinkommen,
          sonstigesEinkommen,
          kindergeldBerechtigter
        },
        berechnung: {
          vaterTabellenbetrag,
          mutterTabellenbetrag,
          anzurechnendesKindergeld,
          vaterZahlbetrag,
          mutterZahlbetrag,
          vaterZahlt,
          mutterZahlt
        }
      });
    }
    
    // Mangelfallberechnung, falls mehrere Kinder
    let vaterMangelfall = null;
    let mutterMangelfall = null;
    
    if (vaterZahlbetraege.length > 0) {
      vaterMangelfall = this.berechneUnterhaltMehrereKinder(
        vaterNettoBereinigt, vaterZahlbetraege, vaterErwerbstaetig
      );
      
      // Angepasste Zahlbeträge bei Mangelfall berücksichtigen
      if (vaterMangelfall.istMangelfall) {
        let index = 0;
        for (let i = 0; i < ergebnisse.length; i++) {
          if (ergebnisse[i].berechnung.vaterZahlt > 0) {
            ergebnisse[i].berechnung.vaterZahlt = vaterMangelfall.angepassteZahlbetraege[index];
            index++;
          }
        }
      }
    }
    
    if (mutterZahlbetraege.length > 0) {
      mutterMangelfall = this.berechneUnterhaltMehrereKinder(
        mutterNettoBereinigt, mutterZahlbetraege, mutterErwerbstaetig
      );
      
      // Angepasste Zahlbeträge bei Mangelfall berücksichtigen
      if (mutterMangelfall.istMangelfall) {
        let index = 0;
        for (let i = 0; i < ergebnisse.length; i++) {
          if (ergebnisse[i].berechnung.mutterZahlt > 0) {
            ergebnisse[i].berechnung.mutterZahlt = mutterMangelfall.angepassteZahlbetraege[index];
            index++;
          }
        }
      }
    }
    
    // Berechnung des verfügbaren Einkommens nach Unterhalt
    const gesamtVaterZahlt = ergebnisse.reduce((sum, ergebnis) => sum + ergebnis.berechnung.vaterZahlt, 0);
    const gesamtMutterZahlt = ergebnisse.reduce((sum, ergebnis) => sum + ergebnis.berechnung.mutterZahlt, 0);
    
    // Kindergeld berechnen, das jeweils erhalten wird
    const vaterErhaeltKindergeld = kinderDaten
      .filter(kind => kind.kindergeldBerechtigter === "Vater")
      .length * this.kindergeld;
      
    const mutterErhaeltKindergeld = kinderDaten
      .filter(kind => kind.kindergeldBerechtigter === "Mutter")
      .length * this.kindergeld;
    
    // Berechnen, wie viel Unterhalt jeweils erhalten wird
    const vaterErhaeltUnterhalt = gesamtMutterZahlt;
    const mutterErhaeltUnterhalt = gesamtVaterZahlt;
    
    // Netto zur Verfügung nach Unterhalt berechnen
    const vaterNettoVerfuegbar = vaterNettoBereinigt - gesamtVaterZahlt + vaterErhaeltUnterhalt + vaterErhaeltKindergeld;
    const mutterNettoVerfuegbar = mutterNettoBereinigt - gesamtMutterZahlt + mutterErhaeltUnterhalt + mutterErhaeltKindergeld;
    
    // Einkommensgruppen-Nummern für das Frontend
    const vaterEinkommensgruppe = this.duesseldorferTabelle.einkommensGruppen.indexOf(vaterGruppe) + 1;
    const mutterEinkommensgruppe = this.duesseldorferTabelle.einkommensGruppen.indexOf(mutterGruppe) + 1;
    
    // Gesamtergebnis
    return {
      eltern: {
        vater: {
          nettoBereinigt: vaterNettoBereinigt,
          einkommensgruppe: vaterEinkommensgruppe,
          zahlt: gesamtVaterZahlt,
          erhaeltUnterhalt: vaterErhaeltUnterhalt,
          erhaeltKindergeld: vaterErhaeltKindergeld,
          nettoVerfuegbar: vaterNettoVerfuegbar,
          mangelfall: vaterMangelfall
        },
        mutter: {
          nettoBereinigt: mutterNettoBereinigt,
          einkommensgruppe: mutterEinkommensgruppe,
          zahlt: gesamtMutterZahlt,
          erhaeltUnterhalt: mutterErhaeltUnterhalt,
          erhaeltKindergeld: mutterErhaeltKindergeld,
          nettoVerfuegbar: mutterNettoVerfuegbar,
          mangelfall: mutterMangelfall
        },
        einkommensgruppen: {
          vater: vaterEinkommensgruppe,
          mutter: mutterEinkommensgruppe,
          eltern: vaterEinkommensgruppe + mutterEinkommensgruppe - 1 // Summe beider Einkommensgruppen - 1
        }
      },
      kinder: ergebnisse
    };
  }
  
  /**
   * Test der Funktionalität mit den Testfällen aus der Dokumentation
   */
  testCalculation() {
    // Testfall 1: Standardfall mit zwei Kindern
    const testfall1 = this.berechneKindesunterhalt({
      vaterNetto: 2500,
      mutterNetto: 4000,
      kinderDaten: [
        { nummer: 1, alter: 14, lebensmittelpunkt: "Vater", status: "Schüler" },
        { nummer: 2, alter: 16, lebensmittelpunkt: "Je 50%", status: "Schüler" }
      ]
    });
    
    console.log("Testfall 1:", testfall1);
    console.log("Mutter zahlt insgesamt:", testfall1.eltern.mutter.zahlt);
    
    // Testfall 2: Mangelfall mit niedrigem Einkommen
    const testfall2 = this.berechneKindesunterhalt({
      vaterNetto: 1600,
      mutterNetto: 2100,
      kinderDaten: [
        { nummer: 1, alter: 12, lebensmittelpunkt: "Mutter", status: "Schüler" }
      ]
    });
    
    console.log("Testfall 2:", testfall2);
    console.log("Vater zahlt (Mangelfall):", testfall2.eltern.vater.zahlt);
    
    // Testfall 3: Volljähriges Kind mit eigenem Haushalt
    const testfall3 = this.berechneKindesunterhalt({
      vaterNetto: 2900,
      mutterNetto: 3700,
      kinderDaten: [
        { nummer: 1, alter: 18, lebensmittelpunkt: "Eigener Haushalt", status: "Student", eigenesEinkommen: 0 }
      ]
    });
    
    console.log("Testfall 3:", testfall3);
    console.log("Vater zahlt:", testfall3.eltern.vater.zahlt);
    console.log("Mutter zahlt:", testfall3.eltern.mutter.zahlt);
    
    // Testfall 4: Negatives bereinigtes Nettoeinkommen
    const testfall4 = this.berechneKindesunterhalt({
      vaterNetto: 0,
      vaterSchulden: 500, // Schulden, die größer als das Einkommen sind
      mutterNetto: 2000,
      kinderDaten: [
        { nummer: 1, alter: 5, lebensmittelpunkt: "Mutter", status: "Schüler" }
      ]
    });
    
    console.log("Testfall 4 (Negatives Einkommen):", testfall4);
    console.log("Vater bereinigte Netto:", testfall4.eltern.vater.nettoBereinigt); // Sollte 0 sein, nicht negativ
    console.log("Vater zahlt:", testfall4.eltern.vater.zahlt); // Sollte 0 sein wegen Mangelfall
    
    return {
      testfall1,
      testfall2,
      testfall3,
      testfall4
    };
  }
}

// Export für andere Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Unterhalt;
} 