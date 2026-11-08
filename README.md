# Grow Within Today – offizielle Website

*Kleine Schritte. Echtes Wachstum. Jeden Tag.*

Statische Website (HTML5, CSS3, Vanilla-JavaScript) der Marke **Grow Within Today**. Primärsprache ist **Deutsch** (`lang="de"`). Es gibt keine Frameworks und keinen Build-Schritt vor dem Deployment, die Seite lädt nichts von Drittanbietern und ist bereit für GitHub Pages.

---

## Dateistruktur

```
grow-within-today/
├── index.html                  Startseite
├── about/index.html            Über uns              →  /about/
├── topics/index.html           Themen (5 Bereiche)   →  /topics/  (#mindset, #discipline, #habits, #emotional-strength, #transformation)
├── contact/index.html          Kontakt               →  /contact/
├── privacy-policy/index.html   Datenschutzerklärung  →  /privacy-policy/   ← URL für die Pinterest-Developer-App
├── imprint/index.html          Impressum             →  /imprint/
├── 404.html                    Fehlerseite (wird von GitHub Pages automatisch ausgeliefert)
├── assets/
│   ├── css/style.css           Alle Styles (Design-Tokens oben in der Datei)
│   ├── js/main.js              Mobiles Menü, Hero-Parallax, Themen-Navigation, E-Mail kopieren
│   ├── fonts/                  Selbst gehostete Schriften Cormorant Garamond + Manrope (SIL-OFL-Lizenzen liegen bei)
│   ├── img/                    ridge.svg, trail.svg, icons.svg (Icon-Sprite), mark.svg, og-image.jpg
│   └── icons/                  favicon.svg, favicon-32.png, apple-touch-icon.png
├── partials/                   header.html + footer.html (gemeinsame Kopf- und Fußzeile)
├── tools/
│   ├── build.mjs               Überträgt die Partials in alle Seiten, setzt Canonical-URLs, erzeugt sitemap.xml/robots.txt
│   └── check-links.mjs         Prüft alle internen Links und #Anker
├── site.config.json            siteUrl + basePath (siehe unten)
├── robots.txt
├── .nojekyll                   GitHub Pages liefert die Dateien unverändert aus
├── LEGAL-TODO.md               Alle noch fehlenden rechtlichen Angaben
└── README.md
```

### Warum die URLs englisch bleiben
Die Ordnernamen (`/about/`, `/topics/`, `/privacy-policy/` …) wurden aus Version 1 übernommen, damit interne Links, die schon an Pinterest gemeldete Datenschutz-URL und spätere Verweise stabil bleiben. Sichtbar ist auf der Website alles auf Deutsch.

### Vorbereitet für eine spätere englische Version
Empfohlen wird eine englische Fassung im Unterordner `/en/` (z. B. `/en/about/`) mit gegenseitigen `hreflang`-Verweisen (`de` ↔ `en`) im `<head>`. Die englischen Texte aus Version 1 sind noch vorhanden und können als Ausgangspunkt dienen. Dafür müssten `build.mjs` (Sprachpfade, hreflang) und die Partials (Sprachumschalter) erweitert werden. Das ist bewusst noch nicht umgesetzt.

---

## Lokale Vorschau

Die Seiten verwenden Ordner-URLs (`about/`). Öffne sie deshalb über einen kleinen lokalen Webserver, nicht per Doppelklick:

```bash
cd grow-within-today
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

(Alternative mit Node: `npx serve .`)

---

## Bearbeiten

- **Texte:** direkt in der HTML-Datei der jeweiligen Seite ändern.
- **Kopf- oder Fußzeile:** `partials/header.html` bzw. `partials/footer.html` bearbeiten und danach
  `node tools/build.mjs` ausführen. Das Skript überträgt die Änderung in alle Seiten und markiert den aktiven Menüpunkt.
- **Farben, Schriften, Abstände:** Die Design-Tokens stehen oben in `assets/css/style.css`.
- **Links nach Änderungen prüfen:** `node tools/check-links.mjs`
- Node.js 18+ wird nur für diese beiden Hilfsskripte gebraucht. Vor dem Veröffentlichen muss nichts gebaut werden.

### Eigene Fotos ergänzen
Die Landschaften sind leichtgewichtige Vektorillustrationen, die eigens für die Website erstellt wurden. Für eigene Pinterest-Fotos: Bilder als **WebP** exportieren (Hero ca. 2400 px breit, unter 300 KB), in `assets/img/` ablegen und mit `<img … width height alt="…" loading="lazy">` einbinden (beim Hero ohne `loading="lazy"`). Verwende nur Fotos, die dir gehören oder für die du eine Lizenz hast, und ergänze die Bildnachweise im Impressum.

---

## Veröffentlichung auf GitHub Pages

> Es wurde nichts gepusht oder veröffentlicht. Führe diese Schritte selbst aus, wenn du so weit bist.

1. **Repository anlegen** auf GitHub, z. B. `grow-within-today`. Es muss öffentlich sein, weil GitHub Pages im kostenlosen Tarif nur öffentliche Repositories unterstützt.
2. **Dateien hochladen** (im Projektordner):
   ```bash
   git init
   git add .
   git commit -m "Grow Within Today – deutsche Version"
   git branch -M main
   git remote add origin https://github.com/<DEIN-BENUTZERNAME>/grow-within-today.git
   git push -u origin main
   ```
3. **Pages aktivieren:** Repository → *Settings* → *Pages* → *Build and deployment* → Source: **Deploy from a branch** → Branch: **main**, Ordner **/(root)** → *Save*.
4. Nach etwa einer Minute ist die Seite unter `https://<DEIN-BENUTZERNAME>.github.io/grow-within-today/` erreichbar.
5. Auf derselben Einstellungsseite **Enforce HTTPS** aktivieren.
6. **Endgültige URL eintragen:** In `site.config.json` `siteUrl` und `basePath` setzen, dann `node tools/build.mjs` ausführen, committen und erneut pushen. Dadurch werden Canonical-URLs, Open-Graph-URL und -Bild sowie `sitemap.xml` erzeugt und `robots.txt` um den Sitemap-Verweis ergänzt:
   ```json
   { "siteUrl": "https://<DEIN-BENUTZERNAME>.github.io/grow-within-today", "basePath": "/grow-within-today/" }
   ```
   - Bei eigener Domain (z. B. `growwithintoday.com`) oder einem Repository namens `<benutzername>.github.io` gilt: `"basePath": "/"`.
   - `basePath` sorgt dafür, dass die Links der Fehlerseite in jeder URL-Tiefe funktionieren.

### Eigene Domain (optional)
Settings → Pages → *Custom domain* → Domain eintragen (GitHub legt eine `CNAME`-Datei an). Beim DNS-Anbieter nach der aktuellen GitHub-Anleitung „Managing a custom domain for your GitHub Pages site“ vorgehen. Danach `siteUrl` und `basePath` wie oben anpassen.

### Pinterest
- **Datenschutz-URL** für die Developer-App: `https://<deine-seite>/privacy-policy/`. Fülle zuerst die Platzhalter aus (siehe `LEGAL-TODO.md`).
- **Website auf Pinterest beanspruchen:** Den `p:domain_verify`-Meta-Tag in den markierten Kommentar im `<head>` von `index.html` einfügen.
- Die Pinterest-API ist bewusst **nicht** in die Website eingebunden. Die Veröffentlichung läuft separat über n8n.

---

## Hinweise
- Der Code verwendet keine Cookies, keinen Browser-Speicher, keine Analyse- oder Tracking-Dienste, keine Einbettungen und keine externen Schriften oder CDNs. Wenn du später etwas davon ergänzt, aktualisiere vorher die Datenschutzerklärung.
- Barrierefreiheit: Sprunglink „Zum Inhalt springen“, semantische Bereiche, Menü per Tastatur bedienbar (Esc schließt), sichtbarer Fokus, `prefers-reduced-motion` wird berücksichtigt, Textkontraste nach WCAG AA, automatische Silbentrennung für lange deutsche Wörter.
- Ansprache: Die Inhaltsseiten duzen die Leserinnen und Leser. Für eine Umstellung auf „Sie“ müssten alle Seiten angepasst werden.
- Schriften: Cormorant Garamond und Manrope, SIL Open Font License (siehe `assets/fonts/`).
