# Sæt din maskine op

*English version: [SETUP.md](SETUP.md).*

**Del 1** er til før dagen: tre ting, der skal installeres på den Windows-maskine, du skal bruge. Det tager cirka 20 minutter, det meste er ventetid på downloads, og det kræver ikke en administrator-adgangskode. Hvis noget ikke virker, så skriv til facilitatoren; vent ikke til selve dagen.

**Del 2** er til selve dagen, med facilitatoren i lokalet: en GitHub-konto, jeres gruppes spil og din slot i det.

Du skal bruge én ting fra facilitatoren, før du går i gang: dit **Claude-login**, enten en invitation til firmaets Claude-konto eller en besked om, at du skal bruge din egen.

## Del 1: før dagen

### 1. Installér VS Code

VS Code er den editor, du arbejder i. Alt andet kobles på den.

1. Gå til [code.visualstudio.com](https://code.visualstudio.com) og klik **Download for Windows**. Du får "User Installer", som ikke kræver en administrator-adgangskode.
2. Kør den. Behold standardvalgene, men sørg for, at **"Add to PATH"** stadig er krydset af.
3. Lav en ny mappe til dagen, for eksempel `Hackathon` i din Dokumenter-mappe. Åbn VS Code, vælg **File → Open Folder**, og åbn den mappe. Hvis VS Code spørger, om du stoler på forfatterne, så klik **Yes, I trust the authors**.

### 2. Installér Claude og log ind

Claude er den AI-assistent, du bygger sammen med. Den bor inde i VS Code som en extension.

1. Klik på **Extensions**-ikonet i venstre bjælke (fire firkanter), eller tryk **Ctrl+Shift+X**.
2. Søg efter **Claude Code**, fra Anthropic, og klik **Install**.
3. Klik på **Claude**-ikonet, der dukker op i venstre bjælke, eller tryk **Ctrl+Shift+P**, skriv **Claude**, og vælg **Claude Code: Open**.
4. Klik **Sign in**. En browser åbner. Log ind med kontoen fra facilitatorens mail: tag imod invitationen til firmaets Claude-organisation, hvis du har fået en, ellers brug din egen Claude-konto.
5. Tilbage i VS Code: skriv **hej** i Claude-panelet og tryk Enter. Svarer den, er du logget ind.

### 3. Lad Claude installere Git

Git er det program, der holder styr på ændringer og taler med GitHub. Både VS Code og Claude har brug for det, og ingen af dem har det med. Claude kan installere det for dig, og det er samtidig din første smagsprøve på, hvordan dagen fungerer: den beder om lov, før den gør noget, du læser, hvad den vil gøre, og klikker **Yes**.

Sæt dette ind i Claude-panelet, med dit eget navn og din egen mail i stedet for det, der står med stort:

> Sæt min maskine op til et hackathon. Jeg har ikke administratorrettigheder, så installér alt kun for min bruger.
> 1. Installér Git for Windows: hent den nyeste 64-bit installer fra https://git-scm.com/download/win og kør den i silent mode for den nuværende bruger med standardindstillingerne. Installeren accepterer parametrene /VERYSILENT /NORESTART /CURRENTUSER.
> 2. Sæt Git op med mit navn "DIT NAVN" og min mail "DIN MAIL".
> 3. Installér disse to VS Code-extensions med `code`-kommandoen: ritwickdey.LiveServer og GitHub.vscode-pull-request-github.
> 4. Tjek, at `git --version` virker, og fortæl mig, hvad du har gjort. Installér ikke andet.

Når Claude siger, at den er færdig, så **luk VS Code helt og åbn den igen**, med den samme mappe. VS Code og Claude finder først Git efter en genstart. Spørg så Claude en gang til:

> Virker `git --version`?

Svarer den med et versionsnummer, er du klar til dagen. Hvis Claude ikke kunne installere Git, så se "Manuelt" sidst i dette dokument.

### Tjekliste før dagen

- [ ] VS Code installeret
- [ ] Claude-extension installeret og logget ind; den svarede på "hej"
- [ ] Git installeret af Claude, VS Code genstartet, `git --version` svarer
- [ ] De to extensions installeret: Live Server og GitHub Pull Requests

Skriv "klar" til facilitatoren, når alle fire er krydset af.

## Del 2: på dagen

Facilitatoren giver dig to ting i lokalet: **linket** til jeres gruppes repo på GitHub og dit **slot-nummer** (slot 1 til slot 6), som er din fil i spillet.

### 4. En GitHub-konto

GitHub er der, hvor gruppens spil bor, og hvor jeres arbejde bliver delt. Spring til næste skridt, hvis du allerede har en konto.

1. Gå til [github.com](https://github.com) og klik **Sign up**, med en hvilken som helst mailadresse, du kan læse i dag. Vælg et brugernavn, du gerne vil sige højt; gruppen kommer til at se det.
2. Bekræft din mailadresse, når GitHub beder om det.
3. Slå **two-factor authentication** til: GitHub kommer snart til at kræve det, og det er bedre at gøre nu end midt på dagen. Gå til **Settings → Password and authentication → Two-factor authentication**. Det nemmeste er appen **GitHub Mobile** på din telefon.
4. Fortæl facilitatoren dit **brugernavn**. Facilitatoren tilføjer dig til jeres gruppes repo, så du kan sende dit arbejde til det. GitHub viser dig derefter en notifikation, og sender en mail, hvor du bliver bedt om at acceptere. Acceptér den. Du kan allerede læse og clone repoet uden; du skal først bruge det fra skridt 7.

### 5. Log ind på GitHub inde i VS Code

Det gør, at VS Code og Claude kan hente og sende dit arbejde uden at spørge om adgangskoder.

1. Klik på **Accounts**-ikonet, den lille person nederst til venstre i VS Code.
2. Vælg **Sign in with GitHub**. En browser åbner; klik **Authorize** og gå tilbage.

### 6. Få spillet ned på din maskine

Åbn Claude-panelet og sæt dette ind, med det link til jeres gruppes repo, som facilitatoren har givet dig:

> Clone repoet https://github.com/JERES-ORGANISATION/JERES-GRUPPE-REPO ned i en mappe ved navn `kart` inde i denne mappe. Hvis et browservindue beder mig logge ind på GitHub, klarer jeg det selv. Når clone er færdig, så åbn `kart`-mappen i dette VS Code-vindue (code -r).

Hvis et browservindue åbner og beder dig logge ind på GitHub, så gør det; det sker kun én gang.

VS Code genindlæser med spil-mappen åben. Hvis den spørger, om du stoler på forfatterne, så klik **Yes, I trust the authors**. Hvis den foreslår at installere anbefalede extensions, så lad den gøre det.

### 7. Gør krav på din slot

Åbn Claude-panelet igen og sæt dette ind, med dit slot-nummer og dit navn:

> Jeg ejer src/features/slot-N.js. Opret en branch ved navn setup/DIT-NAVN ud fra main. Skriv mit navn "DIT NAVN" på den linje i min slot-fil, hvor der står "Owner:", og ikke andet. Commit det med beskeden "Claim slot N", og læg branchen op på GitHub (publish). Forklar derefter i almindeligt sprog, hvad de fem funktioner i min slot-fil er til.

Når Claude melder, at branchen ligger på GitHub, kan din maskine tale med GitHub. Læs dens forklaring af de fem funktioner; det er dem, du kommer til at udfylde i dag.

Hvis VS Code bagefter tilbyder **Create Pull Request**, så klik på den, giv den en titel, klik **Create**, og klik derefter **Merge pull request** på den side, der åbner. Hvis det forvirrer dig, så spørg en hjælper; det er det loop, du kommer til at bruge hele dagen, og Git cheat sheetet i repoet viser hvert klik.

### 8. Start spillet

1. I fillisten til venstre: højreklik på `index.html` og vælg **Open with Live Server**.
2. Din browser åbner med spillet. Klik én gang inde på siden, og hold så **W** nede. Den røde kart kører. Hold **pil op** nede: den blå kart kører.

At dobbeltklikke på `index.html` i en mappe virker *ikke*; spillet skal have Live Server. Edge er fin som browser, og det er Chrome også.

### Tjekliste for dagen

- [ ] GitHub-konto med two-factor authentication
- [ ] Tilføjet til gruppens repo, GitHubs notifikation accepteret
- [ ] Logget ind på GitHub inde i VS Code
- [ ] Spillet clonet; en branch med dit navn i din slot ligger på GitHub
- [ ] Spillet kører i browseren; begge karts kører

## Manuelt: hvis Claude ikke kunne

**Git.** Gå til [git-scm.com/download/win](https://git-scm.com/download/win), hent 64-bit-installationsprogrammet og kør det. Klik **Next** gennem alle siderne; standardvalgene er rigtige. Hvis Windows beder om en administrator-adgangskode, du ikke har, så vælg muligheden for kun at installere for din egen bruger. Åbn derefter Start-menuen, skriv **PowerShell**, åbn den, og sæt disse to linjer ind med dit eget navn og din egen mail, og tryk Enter efter hver:

```powershell
git config --global user.name "Dit Navn"
git config --global user.email "din@mail"
```

Genstart VS Code bagefter.

**Extensions.** I VS Code: tryk **Ctrl+Shift+X**, søg efter **Live Server** (fra Ritwick Dey) og **GitHub Pull Requests** (fra GitHub), og klik **Install** på hver.

**Spillet.** Klik på **Source Control**-ikonet i venstre bjælke (de forgrenede linjer), så **Clone Repository**, så **Clone from GitHub**, og vælg jeres gruppes repo. Vælg din `Hackathon`-mappe som placering, og klik **Open**, når du bliver spurgt.

**Din slot.** Klik på branch-navnet nederst til venstre i VS Code og vælg **Create new branch**; kald den `setup/dit-navn`. Åbn `src/features/slot-N.js` og skriv dit navn på `Owner:`-linjen. Gem. Klik **Source Control**, skriv "Claim slot N", klik **Commit** (sig **Always**, hvis den spørger om staging), og klik så **Publish Branch**. Git cheat sheetet i repoet, `GIT-CHEATSHEET.md`, beskriver hvert klik.

## Hvis noget ikke virker

- **Claude siger, at den ikke kan downloade, eller installationen fejler.** Din maskine sidder måske bag en firma-proxy eller en politik, der blokerer installationsprogrammer. Prøv skridtene manuelt ovenfor. Fejler det også, så sig det til facilitatoren; det er en opgave for IT-afdelingen, ikke for dig.
- **"git is not recognized"**, eller VS Code siger, at den ikke kan finde Git. Luk VS Code helt og åbn den igen.
- **Claudes login-side kommer aldrig tilbage til VS Code.** Login-siden viser en kode; kopiér den og sæt den ind i Claude-panelet.
- **"Open with Live Server" er ikke i menuen.** Live Server-extensionen er ikke installeret. Se "Manuelt".
- **Browseren åbner, men siden er grå eller tom.** Tryk **F12**, åbn **Console**, og vis den røde tekst til en hjælper.
- **At lægge branchen op fejler med "permission denied".** Du er endnu ikke tilføjet til repoet, eller du har ikke accepteret GitHubs notifikation. Skridt 4.4. Tjek, at VS Code er logget ind på den samme GitHub-konto, som du gav facilitatoren.
