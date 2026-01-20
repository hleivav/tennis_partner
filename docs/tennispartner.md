# TennisPartner — konverterat kravdokument

# Hitta rätt tennispartner

## Allmänna instruktioner

Vidareutveckla den här React projekt där vi kommer att använda css och javascript i front end i separata filer.

Till en början kommer vi att simulera att vi skickar filerna till back end genom att spara informationen lokalt och temporärt.

Hela webbsidan ska vara responsiv i alla sina delar.

Senare kommer dessa att sparas i back end där vi kommer att använda en mysql databas med H2 för utveckling från en lokal server. Ramverket blir Spring Boot JPA.

Vi kan använda oss av följande färgpaletter i ett ungefärlig procentsats:

1A2A80 40 %

3B38A0 25 %

7A85C1 20%

B2B0E8 15%

## Menyn

Kommer att bestå av följande delar:

### Hem

_Landningssida med menyn, en bakgrundsbild som täcker hela skärmen och en välkomsttext följt av två knappar med texten ”Registrera dig” och ”Logga in”._

Rubrik: Välkommen till tennispartner

Underrubrik: När du har hittat din tennispartner anmäl er via hemsidan.

”Registrera dig” kommer att anropa samma funktion som när man väljer menyn ”Registrering”.

”Logga in” öppnar en modal med två inputfält:

Label: E-postadress

Placeholder: Din e-post

Typ: inputfält av typ e-post.

Label: Lösenord

Placeholder: Ditt lösenord

Typ: inputfält av typ lösenord.

En knapp med texten ”Logga in”.

Under knappen en länk med texten ”Glömt lösenord?”

Genom att klicka på länken anropa en funktion som skickar en slumpgenererad lösenord på fem tecken från a till z till den e-postadressen som angavs tidigare. Bekräfta med att ett nytt lösenord har skickats till den adressen.

Det enda krav är att lösenordet ska bestå av minst 5 tecken.

Undvik komplicerade lösningar med krypteringar.

### Admin

_En sida för administratören som kan ställa in viktiga parametrar för varje turnering._

Skapa ett formulär med tre element:

**Label**: Turneringsnamn

**Typ**: Inputfält

**Placeholder**: Turneringsnamn

**Label**: Sista anmälningsdag

**Typ**: Datumfält

**Label**: Max antal deltagare per grupp

**Typ**: Dragreglage

**Värde**: 2 till 5

**Default**: 2

### Registrering

_En sida där användaren lägger in viktig information så att hen ska kunna hittas av andra användare._

Skapa ett formulär med följande element:

Label: Namn och Efternamn

Typ: Inputfält

Placeholder: Skriv ditt namn och efternamn

Label: Epost

Typ: Inputfält av typ email

Placeholder: Ex: [kalle.anka@gmail.com](mailto:kalle.anka@gmail.com)

Label: Telefon

Typ: inputfält av typ mobiltelefon

Placeholder: Ex: 0707007171

Label: Nivå

Typ: kombinationsruta

Möjliga val: Gruppspel grupp1, Gruppspel grupp2, Gruppspel grupp3, Gruppspel grupp4, Gruppspel grupp5, Gruppspel grupp6, Avancerad, Medel, Nybörjare

Default: Nybörjare.

Förklaring: Om du är bekant med vår gruppspel använd någon av de gruppspelsval som beskriver bäst din nivå. Annars använd en av de andra val.

Label: Avatar

Ett kort som man kan bläddra åt båda håll med pilar på var sin sida av kortet.

Kortet innehåller bara en bild (rundad). Genom att klicka på bilden eller kortet ramas den och just den bilden kommer att sparas när profilen sparas.

Label: Jag söker partner för den här turnering.

Typ: Checkbox

Default: Ej kryssat

Label: Lösenord

Typ: inputfält av typ lösenord

Label: Upprepa lösenord

Typ: input fält av typ lösenord

Text: Spara profil

Typ: Knapp

Default: Ej tillgänglig.

Telefonfältet är inte obligatorisk.  
När samtliga andra fält är ifyllda gör knappen ”Spara profil” tillgänglig. Se till dynamisk att knappen är tillgänglig bara om de nödvändiga fält är ifyllda.

### Sök medspelare

_En sida där en inloggad användare ska kunna bläddra bland övriga användare som är tillgängliga för just denna turnering och där man ska kunna välja vilka spelare man vill spela med._

Skapa ett formulär med följande element:

Label: Sök spelare med namn

Typ: Textfält

Etikett: Skriv namnet eller delar av namnet.

Label: Sortera per nivå:

Typ: Kombinationsruta.

Möjliga val: Alla nivåer som återfinns i kombinationsrutan för registreringssidan plus valet ”Samtliga” som är default.

Underrubrik: Tillgängliga spelare

Visa resultatet av filtreringen som ett kort med informationen som sparas i varje användares profil.

Man visar ett kort i taget.

Det ska gå att bläddra mellan kort med pilar på var sin sida av kortet.

Korten bör ha två typer av bakgrundsfärger: En för en spelare som användaren som är inloggad inte har valt och en annan färg för en spelare som användaren har redan valt.

Förutom informationen från kortet ska det visas en knapp längst ner med texten ”Välj mig”.

Genom att klicka på den knappen visas din profil som ett kort bland den personens inbjudningar. Det innebär att när databasen planeras bör det finnas en tabell där samtliga spelare har ett antal inbjudningar som kommer från andra spelare.

### Profil

_En sida där en användare ska kunna redigera och ändra sin profil._

Visa samtliga komponenter som finns vid registreringen så att de ska gå att redigera.

Lägg en knapp som sparar informationen om den har modifierats.

### Inbjudan

_En sida där du kan se vem som har bjudit in dig._

Du ska se olika filtreringsalternativ i en kombinationsruta. Dessa är:

Ny inbjudan, Avvaktar, Ignorerad.

Förutom den fullständiga information som varje spelare har i sin profil, visas följande knappar:

Acceptera: En modal dyker upp med följande information: ”Viktigt! Kontakta den här spelaren nu. När du har fått bekräftat att ni ska spela tillsammans se till att ni redigerar er profil så att ni avmarkerar att ni är tillgängliga. Om det är en sådan turnering där det tillåts flera spelare och ni anser att ni behöver fler, avvakta med att avmarkera och fortsätt att söka en annan person.”

Avvakta: En modal dyker upp med följande information: ”Den här spelaren kommer fortfarande att finnas med i din lista tills du väljer att ignorera hen”.

Ignorera: En modal dyker upp med följande information: Den här spelaren kommer inte längre att visas på din lista. Vill du ignorera hen?

Två knappar visas:

Ok – Spelaren tas bort från listan och visas inte längre.

Avbryt – Modalen stängs och inget händer.

### Logga in

Det här visas sist i menyn och kan visas i stället som en knapp.

Funktionen som anropas är samma funktion som anropas via knappen i välkomstsidan.