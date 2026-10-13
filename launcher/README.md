# GlassOS — launcher Android stile iPhone (Liquid Glass)

App Home per Android che sostituisce la schermata principale del telefono con
un'interfaccia in stile iOS 26: icone stile iPhone, dock e widget in vetro
liquido, Centro di Controllo, ricerca, Libreria app.

L'interfaccia è la cartella `glass/` del repository (la stessa che funziona
anche nel browser); qui c'è solo la parte nativa (WebView + ponte verso Android).

## Installazione
1. Ogni push su `glass/` o `launcher/` compila l'APK con GitHub Actions e lo
   pubblica nella release **glassos-latest** del repository.
2. Dal telefono apri la release, scarica `GlassOS.apk` e installalo
   (consenti "Installa app sconosciute" al browser quando richiesto).
3. Premi il tasto Home e scegli **GlassOS** → "Sempre",
   oppure Impostazioni › App › App predefinite › App Home.

Per tornare al launcher originale: Impostazioni › App › App predefinite › App Home.

## Gesti
- Pressione lunga su un'icona: menu (Modifica Home, Rimuovi, Info app, Disinstalla)
- In modifica: trascina le icone per spostarle, anche nel dock
- Scorri giù dall'alto a destra: Centro di Controllo · a sinistra: notifiche Android
- Scorri giù al centro della Home: Ricerca
- Ultima pagina a destra: Libreria app (tutte le app installate)

## Note
- `glassos.keystore` è una chiave di firma solo per questo launcher personale:
  serve a far installare gli aggiornamenti sopra la versione precedente.
- La barra di stato, la tendina notifiche e le altre app restano quelle di Android:
  un launcher non può modificarle senza root.
