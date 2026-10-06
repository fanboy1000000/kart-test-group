# Velkommen til kart-hackathonet

*Læs den før dagen, eller lyt, når facilitatoren læser den højt ved starten. Det tager cirka otte minutter. English version: [INTRODUCTION.md](INTRODUCTION.md).*

## Hvad dagen går ud på

I dag bygger I et computerspil. Ikke alene, og ikke fra bunden. Jeres gruppe starter med et kart-spil, der allerede kører, og inden dagen er omme, har det omgangstæller, speedometer, items, boost pads, lyd, et minimap, eller hvad jeres gruppe nu beslutter sig for. Hver af jer bygger én del af det, og en AI-assistent skriver koden sammen med jer.

Ingen her behøver at kunne programmere. Det, I skal kunne, er at sige, hvad I vil have, se på det, I fik, og afgøre, om det er rigtigt. Det er opgaven i dag, og det er en rigtig opgave: det er sådan, en stor del af al software bliver lavet lige nu.

## Spillet

To spillere ved ét tastatur. Den ene kører med W, A, S og D, den anden med piletasterne. Hver spiller har sin egen halvdel af skærmen, set bagfra sin kart, ligesom i de kart-spil, I måske husker. Banen er en cirkel på en græsmark, og græsset er langsomt.

Det er alt, hvad spillet kan lige nu. Alt andet står på menuen for i dag: omgange, et stopur, en nedtælling, bananer, skaller, drifting, en AI-modstander, der kører selv. I vælger.

## Sådan er spillet bygget, og derfor får I hver jeres fil

Spillet består af cirka et dusin filer af to slags.

Fem af dem er **engine**: banen, kartsene og hvordan de kører, tastaturet, kameraet og det loop, der får det hele til at køre. Engine virker allerede, og ingen redigerer i den i dag, medmindre hele gruppen er enige. Mere om det nedenfor.

Resten er **feature-filer**, én per person: `slot-1.js`, `slot-2.js` og så videre. Hver af dem er et tomt stik med et par funktioner i: én, der kører, når spillet starter, én, der kører hver frame, og nogle, der tegner. Spillet kører hver slot, hver frame, og giver den alt: kartsene, banen, tastaturet, skærmen. Så en feature-fil kan næsten hvad som helst. En omgangstæller bor helt og holdent i én slot: den holder øje med, hvor kartsene er, og skriver "Lap 2" på skærmen. Den rører aldrig kart-filen eller bane-filen.

Dit navn står øverst i din slot, og alt, hvad du bygger, ligger derinde. Brug for mere plads? Lav nye filer ved siden af, med din slots navn foran, for eksempel `slot-3-sounds.js`. Fordi din kode ligger i din egen fil, redigerer du aldrig i andres, ingen redigerer i din, og Git skal aldrig vælge mellem to personers arbejde. Det er det, der gør det muligt for seks mennesker at bygge det samme spil på samme tid.

Hvis to af jer vil arbejde sammen, så del én slot på én maskine. Den ene taster, den anden tænker. Byt en gang imellem.

## Sådan arbejder du med AI'en

Du åbner din slot, åbner AI-chatten og fortæller den, hvad du vil have. For eksempel: *"Jeg ejer slot-3.js. Tilføj en omgangstæller, der viser 'Lap 2' i øverste højre hjørne."* Den skriver koden. Du gemmer, spillet genindlæser i browseren, du kører, og du kigger.

Seks ting, der er værd at vide, før du går i gang:

1. **Én lille ting ad gangen.** "Tilføj en omgangstæller" er en god bestilling. "Tilføj omgange, items og lyd" er tre bestillinger. Tag dem én ad gangen.
2. **At genindlæse spillet er testen.** Virker det på skærmen, virker det. Gør det ikke, ser du det med det samme.
3. **Beskriv, hvad du ser, ikke hvad du forventede.** "Tælleren siger Lap 2, før jeg krydser stregen" giver AI'en noget at arbejde med. "Det er forkert" gør ikke.
4. **Den lyder sikker, også når den tager fejl.** Den skriver gladeligt kode, der ikke virker, og fortæller dig, at den gør. Du er dommeren, ikke AI'en.
5. **Bed den forklare.** "Hvorfor gør den linje det?" er altid tilladt. Det er det, dagen er til.
6. **Sort skærm?** Tryk F12 i browseren, åbn **Console**, og sæt den røde linje ind i chatten til AI'en. Det er som regel én linje, der skal rettes.

## Sådan deler du dit arbejde

Deling foregår gennem GitHub i et loop, som I kommer til at køre nogle gange i dag. Ordene er nye, ideerne er det ikke:

- **Branch**: din egen private kopi af spillet at arbejde i. Intet, du gør der, påvirker andre, før du siger til.
- **Commit**: et gemt øjebliksbillede med en kort note, for eksempel "Lap counter shows laps". Gør det, hver gang noget virker.
- **Pull request**: "vær sød at lægge mit arbejde ind i gruppens spil".
- **Merge**: knappen, der gør det.
- **Sync**: hent alt det, de andre har merget, ned på din egen maskine, og send dit op.

Git cheat sheetet har hvert eneste klik. Hvis Git nogensinde melder en conflict, står der i cheat sheetet, hvad du gør, og en hjælper kan føre dig igennem det på to minutter. Med én fil per person burde du ikke støde på en.

## Hvis du vil ændre i engine

Før eller siden ser en idé ud til at kræve en ændring i engine: en anden baneform, en tredje spiller, andre taster. Før du rører ved noget:

1. **Spørg AI'en, om det kan gøres inde i din slot.** Det kan det som regel. En slot kan ændre en karts fart, styring og farve, erstatte den måde, en kart tegnes på, tilføje en tredje kart, der kører selv, eller tegne noget helt nyt på banen.
2. **Hvis det virkelig ikke kan, er det en holdbeslutning**, fordi alles spil afhænger af de filer. Fortæl gruppen, hvad du vil ændre, og hvorfor, og bliv enige.
3. **Så laver én person ændringen**, så lille som muligt, i sin egen pull request uden andet i, og merger den. Alle andre syncer med det samme, så I igen bygger på den samme engine.

At ændre i engine uden at sige det til nogen er den ene måde at ødelægge en andens eftermiddag på i dag.

## To features kan slås

Git brokker sig ikke, når to features ændrer den samme ting i spillet, men spillet kan stadig blive forvirret. En boost pad, der sætter kartens fart til 650, og et item, der sætter den til 420, slås om farten hver eneste frame. To features, der begge nulstiller kartsene, når man trykker R, nulstiller dem to gange.

Det er normalt, og løsningen er en samtale, ikke et værktøj:

- **Sig, hvad du bygger, før du bygger det.** Skriv det øverst i din slot, og fortæl gruppen. Hvis to af jer vil det samme, så snak sammen, og del det op eller vælg noget andet.
- **Læs advarslerne i feature-menuen.** Hvor to features har det med at træde hinanden over tæerne, står det der.
- **Giv dine ting dine egne navne.** `kart.lapCount` i stedet for `kart.count`. Bed AI'en om det; den ved, hvad du mener.
- **Når gruppen spiller, og noget opfører sig mærkeligt**, finder de to personer, hvis features rører den samme ting, ud af det indbyrdes, hver i sin egen fil.

## Sådan kommer du i gang

1. Få spillet ned på din maskine, og kør en omgang. Del 2 af opsætningsguiden, [OPSÆTNING.md](OPSÆTNING.md), fører dig igennem det skridt for skridt.
2. Byg speedometeret fra README'en. Det tager fem minutter og tager dig gennem hele loopet én gang: spørg AI'en, reload, commit, branch, pull request, merge, sync. Derefter har du gjort alt det, du skal gøre i dag, bare i mindre skala.
3. Vælg en feature fra menuen, eller find på en. Fortæl gruppen. Skriv den øverst i din slot.
4. Byg den i små skridt. Merge den, når den virker, også selvom den ikke er færdig. Sync, spil, vælg næste skridt.
5. Hver time eller to syncer alle, og gruppen spiller sit spil sammen. Det er dagens bedste øjeblik. Spring det ikke over.

## Reglerne

1. **Du ejer én slot-fil.** Du redigerer aldrig i andres, og ingen redigerer i din.
2. **Engine er fælles.** Ændr den kun, når holdet er enige, i en lille pull request for sig selv, og bed alle om at synce.
3. **Sig, hvad du bygger.** Før du bygger det, højt og øverst i din slot.
4. **Det fælles spil skal altid køre.** Reload og kør en omgang, før du merger.
5. **Små skridt.** Én bestilling til AI'en ad gangen. Reload. Tjek. Commit, når det virker.
6. **Gået i stå i ti minutter? Spørg et menneske.** Hjælperne er her til præcis det.

## Sådan ser en god dag ud

Du kommer til at gå i stå på et tidspunkt. Det gør alle. AI'en kommer til at skrive noget, der ikke virker. Det gør den altid, før eller siden. Ingen af delene betyder, at du gør det forkert; det betyder, at du gør det.

En halv feature, der virker, er en feature. En feature, du forstår, er mere værd end én, du ikke forstår. Og pointen i dag er ikke spillet. Det er, at du går hjem med en fornemmelse af, hvordan det er at lave software med en AI: hvad man beder om, hvordan man tjekker det, og hvornår man kan stole på det.

Gå nu hen og få spillet ned på din maskine.

## Ord, du kommer til at høre i dag

- **Repo**: mappen med spillet, gemt på GitHub og kopieret til din maskine.
- **Clone**: at kopiere repoet til din maskine, én gang.
- **Engine**: de fem fælles filer, der får spillet til at køre. Ikke dine at redigere i.
- **Slot**: din feature-fil. Den eneste fil, du redigerer i.
- **Reload**: tryk F5 i browseren, eller bare gem; spillet genindlæser sig selv.
- **HUD**: teksten og målerne, der tegnes oven på spillet, for eksempel et speedometer.
- **Console**: panelet bag F12 i browseren, hvor fejl står med rødt.
- **main**: den fælles, officielle version af spillet. Den skal altid køre.
- **Branch, commit, pull request, merge, sync**: se ovenfor. Cheat sheetet viser klikkene.
