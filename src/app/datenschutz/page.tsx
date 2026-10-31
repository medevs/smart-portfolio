import { formatLegalAddress, legal } from "@/config/legal";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung für medevsmaker.",
};

export default function DatenschutzPage() {
  const address = formatLegalAddress(legal.address);

  return (
    <main className="paper-page">
      <div className="wrap">
        <p>
          <Link href="/">← Farm</Link>
        </p>
        <h1>Datenschutz</h1>
        <p>Stand: 31. Oktober 2026</p>

        <h2>Verantwortlicher</h2>
        <p>
          {legal.name}
          <br />
          {legal.address.street}
          <br />
          {legal.address.postalCode} {legal.address.city}
          <br />
          {legal.address.country}
          <br />
          E-Mail: <a href={`mailto:${legal.email}`}>{legal.email}</a>
        </p>
        <p>Das Angebot wird unter dem Namen medevsmaker betrieben. Anschrift des Verantwortlichen: {address}.</p>

        <h2>Hosting</h2>
        <p>
          Die Seiten liegen bei Vercel Inc. (USA). Beim Aufruf verarbeitet der Hoster technisch erforderliche
          Verbindungsdaten, insbesondere IP-Adresse, Zeitpunkt, aufgerufene Adresse und Browserkennungen, um die
          Seite auszuliefern und abzusichern. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Hinweise des Hosters:{" "}
          <a href="https://vercel.com/legal/privacy-policy">vercel.com/legal/privacy-policy</a>.
        </p>

        <h2>Lokal im Browser</h2>
        <p>
          Die Farm speichert den digitalen Spielstand lokal in diesem Browser: erledigte Aufgaben, Wasser und
          Äpfel im Inventar, die letzte sichere Gehposition sowie den Einführungsstatus. Auch Grafik-, Bewegungs-,
          Tageslicht- und Lautstärkeeinstellungen werden lokal gespeichert. Die Seite überträgt diesen lokalen
          Spielstand nicht an den Server. Im Spieljournal lässt sich der Fortschritt nach einer Bestätigung
          zurücksetzen; die Einstellungen bleiben dabei erhalten. Das Löschen der Website-Daten im Browser entfernt
          auch diese Einstellungen.
        </p>
        <p>
          Tageslicht kann manuell gewählt oder in einem optionalen virtuellen Zyklus verändert werden. Die
          Geräuschkulisse beginnt nur nach einem Klick und ist bei jedem neuen Aufruf zunächst ausgeschaltet.
          Es werden keine Tracking-Cookies und keine Analysewerkzeuge gesetzt.
        </p>

        <h2>Patenschaftsformular</h2>
        <p>
          Wenn jemand einen Platz auf der Farm anfragt, werden Name, optional ein Link, optional eine Nachricht sowie
          der gewählte Platz und die gewählten Extras übermittelt. Zweck ist die manuelle Prüfung vor der
          Veröffentlichung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Schritte). Eine dauerhafte
          Speicherung in einer Datenbank ist noch nicht angebunden; die Anfrage wird derzeit nicht dauerhaft
          gespeichert (TODO). Links von Patinnen und Paten, die später öffentlich erscheinen, sind als
          gesponsert gekennzeichnet.
        </p>

        <h2>PayPal</h2>
        <p>
          Ein Zahlungslink führt auf die Seiten von PayPal. Kartendaten nimmt diese Website nicht entgegen. Es gilt
          dann die Datenschutzerklärung von PayPal. Solange in der Konfiguration nur ein Platzhalter hinterlegt ist,
          wird kein Zahlungslink geöffnet.
        </p>

        <h2>Rechte</h2>
        <p>
          Betroffene Personen haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
          Datenübertragbarkeit und Widerspruch, soweit die gesetzlichen Voraussetzungen erfüllt sind. Außerdem besteht
          ein Beschwerderecht bei einer Aufsichtsbehörde. Zuständig für Delmenhorst ist die Landesbeauftragte für den
          Datenschutz Niedersachsen, Prinzenstraße 5, 30159 Hannover,{" "}
          <a href="https://lfd.niedersachsen.de">lfd.niedersachsen.de</a>.
        </p>
      </div>
    </main>
  );
}
