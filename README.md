# Angular mat input

*Pourquoi utiliser ce package ?*
Ces composants ont été conçu pour fluidifier l'intégration des champs Angular Material en supprimant la gestion fastidieuse des états et des erreurs.

**L'internationalisation (i18n) en natif :**
Plus besoin de gérer vos propres fichiers de traduction pour les erreurs basiques. Le package supporte 13 langues (FR, EN, ES, IT, PT, DE, AR, JA, NL, PL, RU, SV, ZH). La sélection se fait de manière transparente selon les préférences du navigateur, avec la possibilité d'écraser ce comportement via les `providers`. (Langue de repli par défaut : Anglais).

# Information
Compatible `signal form` et `reactive form`
**NOTE:** `Signal form` possibilité de mettre un message custom en remplacement du par défaut

- 1.1.11 => angular 20.3.0
- 1.2.10 => angular 21
- 2.0 => à partir de angular 22

# Configuration

```js
// app.config.ts
import { provideJpMatInput } from '@jetonpeche/angular-mat-input';

export const appConfig: ApplicationConfig = {
   providers: [
      // ...
      provideJpMatInput({ lang: "fr" }) // option
   ]
};
```
```json
// angular.json
{
   // ...
   "assets": [
   // ajouter en plus
   {
      "glob": "**/*",
      "input": "node_modules/@jetonpeche/angular-mat-input/src/assets",
      "output": "/assets/"
   }]
}
```

# Input texte

## Attributs
- `formControlName`, `field`: Obligatoire
- `label`: Nom de l'input
- `placeholder`: Placeholder de l'input
- `type`: En option, defaut type text, valeurs possibles  
   - text, url, search, tel, email, color
- `suffixIcon`: Définir et place l'icon à gauche (mat icon)
- `prefixIcon`: Définir et place l'icon à droite (mat icon)
- `isBtnIcon`: Transforme l'icone en bouton
- `floatLabel`: Bloquer le label en haut de l'input
- `showMaxLength`: Affiche la longeur max d'une chaine en bas de l'input
- `hiddenRequiredMarker`: Supprimer * quand l'input est obligatoire
- `clicked`: Event click du bouton icon

## exemple
```html
<jp-input-text label="Nom" formControlName="nom" />
<jp-signal-input-text label="Nom" [field]="profile.username" />
```
```js
let profile = signal<any>({
   username: ''
});

let profileForm = form(this.profile, (path) => {
   required(path.username);

   // Le message remplace celui par defaut
   maxLength(path.username, 3, { message: 'Custom message' })
});

let form = new FormGroup({
   nom: new FormControl(
      "",
      [Validators.maxLength(3), Validators.email, Validators.required]
   )
});
```

# Input number

## Attributs
- `formControlName`, `field`: Obligatoire
- `label`: Nom de l'input
- `placeholder`: Placeholder de l'input
- `step`: Pas de l'incrémentation et décrémentation
- `suffixIcon`: Définir et place l'icon à gauche (mat icon)
- `prefixIcon`: Définir et place l'icon à droite (mat icon)
- `floatLabel`: Bloquer le label en haut de l'input
- `textRight`: Aligner le texte à droite
- `hiddenRequiredMarker`: Supprimer * quand l'input est obligatoire
- `hiddenArrows`: Supprimer les flèches d'incrément et d'décrementale

## exemple
```html
<jp-input-number label="Age" formControlName="age" />
<jp-signal-input-number label="Age" [field]="profile.age" />
```
```js
let profile = signal<any>({
   age: 0
});

let profileForm = form(this.profile, (path) => {
   required(path.username);

   // Le message remplace celui par defaut
   max(path.username, 100, { message: 'Custom message' });
});

let form = new FormGroup({
   age: new FormControl(
      "",
      [Validators.max(100), Validators.required]
   )
});
```

# Input password

## passwordValidator
### Reactive form
Donne la règle du mot de passe:
- 1 minuscule
- 1 majuscule
- 1 chiffre
- 1 caractère spécial
- 8 caractères minimum au total

### Signal form
Donne la règle du mot de passe:
- 1 minuscule
- 1 majuscule
- 1 chiffre
- 1 caractère spécial
- X caractères minimum au total (defaut 8)

## Attributs
- `formControlName`, `field`: Obligatoire
- `label`: Nom de l'input
- `placeholder`: Placeholder de l'input
- `floatLabel`: Bloquer le label en haut de l'input
- `hiddenButtonSwitch`: Masquer le bouton qui permet d'afficher le mot de passe
- `hiddenRequiredMarker`: Supprimer * quand l'input est obligatoire
- `showMaxLength`: Affiche la longeur max d'une chaine en bas de l'input

## exemple
```html
<jp-input-password label="Mot de passe" formControlName="mdp" />
<jp-signal-input-password label="Mot de passe" [field]="form.mdp" />
```
```js
let profile = signal<any>({
   mdp: ''
});

let profileForm = form(this.profile, (path) => {
   password(path.mdp, { minLength: 8 });
});

let form = new FormGroup({
   mdp: new FormControl(
      "",
      [passwordValidator, Validators.required]
   )
});
```

# Input Date

## Validators

### Reactive form
- `minDateValidator`: Définir la date minimum possible dans le picker
- `maxDateValidator`: Définir la date maximum possible dans le picker

### Signal form
- `minDate`: Définir la date minimum possible dans le picker
- `maxDate`: Définir la date maximum possible dans le picker  

**NOTE :** Les valeurs peuvent être dynamiques via une lambda

## EDay
Enum des jours de la semaine

## EMonth
Enum des mois de l'année (index 0 à 11)

## Attributs
- `formControlName`, `field`: Obligatoire
- `label`: Nom de l'input
- `iconPicker`: Changer l'icone du picker (mat icon)
- `floatLabel`: Bloquer le label en haut de l'input
- `hiddenRequiredMarker`: Supprimer * quand l'input est obligatoire
- `touchUi`: Afficher le picker en mode téléphone
- `disabledDays`: Jours de la semaine à bloquer
- `disabledDates`: Dates à bloquer dans chaque mois (mois-jour)
- `disabledMonths`: Mois à bloquer
- `disabledPartial`: Désactiver l'input mais garde le picker actif
- `disabledWeekend`: Désactiver le samedi et dimanche
- `disabledWeek`: Désactiver les jours de la semaine sauf samedi et dimanche
- `disabledSundayAndMonday`: Désactiver dimanche et lundi

## exemple
```html
<jp-input-date label="Date naissance" formControlName="date" />
<jp-signal-input-date label="Date naissance" [field]="profileForm.date" />
```
```js
let profile = signal<any>({
   date: ''
});

let profileForm = form(this.profile, (path) => {
   minDate(path.date, "2025-01-20"), // possible avec type Date et lambda
   maxDate(path.date, () => this.MaFonction()) // possible avec type Date et string ici mode dynamique
});

let form = new FormGroup({
   date: new FormControl(
      null, [
         minDateValidator("2025-01-01"), // possible avec type Date
         maxDateValidator("2025-01-20"), // possible avec type Date
         Validators.required
      ]
   )
});
```

# Input textarea

## Attributs
- `formControlName`, `field`: Obligatoire
- `label`: Nom de l'input
- `placeholder`: Placeholder de l'input
- `rows`: Nombre de ligne
- `cols`: Nombre de colonne
- `floatLabel`: Bloquer le label en haut de l'input
- `showMaxLength`: Affiche la longeur max d'une chaine en bas de l'input
- `hiddenRequiredMarker`: Supprimer * quand l'input est obligatoire

## exemple
```html
<jp-textarea label="Info en plus" formControlName="info" />
<jp-signal-textarea label="Info en plus" [field]="profileForm.info" />
```
```js
let profile = signal({
   info: ''
});

let profileForm = form(this.profile, (path) => {
   required(path.info);

   // Le message remplace celui par defaut
   maxLength(path.info, 3, { message: 'Custom message' })
});

let form = new FormGroup({
   info: new FormControl(
      "",
      [Validators.maxLength(3_000)]
   )
});
```

# Input file button

## Attributs
- `formControlName`, `field`: option
- `label`: Nom de l'input
- `icon`: Icon du bouton (mat icon)
- `accept`: Liste des extensions de fichier acceptés
- `multiple`: Autoriser à mettre plusieurs fichier
- `matButton`: Style du bouton
- `matMiniFab`: Style du bouton
- `matFab`: Style du bouton
- `matIconButton`: Style du bouton
- `extended`: Permet de mettre un label sur un bouton `matFab`
- `fileChange`: Event pour récupérer le ou les fichier(s) choisi(s)

## exemple
```html
<jp-input-file-btn matFab extended label="Info en plus" formControlName="fichier" />
<jp-input-file-btn multiple label="Info en plus" (fileChange)="Info($event)" />

<jp-signal-input-file-btn [field]="profileForm.info" />
```
```js
let profile = signal({
   info: null // (FileList | File)
});

let profileForm = form(this.profile, (path) => {
   required(path.info);

   // Le message remplace celui par defaut
   maxLength(path.info, 3, { message: 'Custom message' })
});

let form = new FormGroup({
   // Add multiple attribut => FileList
   fichier: new FormControl<File>(null)
});

Info(_files: FileList)
{
   console.log(_files);
}
```

# Input fil drop zone

## Attributs
- `icon`: Icon du drop zone (mat icon)
- `accept`: Liste des extensions de fichier acceptés
- `notMultiple`: Ne pas autoriser à mettre plusieurs fichier
- `disabled`: Désactiver le drop zone
- `info`: Texte à mettre en plus
- `selectedFiles`: Event qui donne les fichiers

## exemple
```html
<jp-input-file-drop-zone notMultiple (selectedFiles)="onChange($event)" />
```
```ts
onChange(_liste: FileList): void
{
   console.log(_liste);
}
```

# Input autocomplete

## Attributs
- `formControlName`, `field`: Obligatoire
- `dataSource`: Obligatoire
- `label`: Nom de l'input
- `placeholder`: Placeholder de l'input
- `floatLabel`: Bloquer le label en haut de l'input
- `hiddenRequiredMarker`: Supprimer * quand l'input est obligatoire
- `matAutocompletePosition`: Position de l'autocomplete (défaut auto)
- `requireSelection`: La valeur choisi doit être dans les choix proposés
- `disabledFilterComplete`: Désactiver le filtre des choix de l'autocomplete
- `autoDesactiveFirstOption`: Désactiver l'auto selection du premier choix
- `opened`: Event ouverture autocomplete
- `closed`: Event déselection autocomplete
- `autocompleteChange`: Event change de l'input

## exemple
```html
<jp-autocomplete (autocompleteChange)="onChange($event)" 
                 label="Chiffre" 
                 [dataSource]="liste()" 
                 formControlName="info" />

<jp-signal-autocomplete (autocompleteChange)="onChange($event)" 
                 label="Chiffre" 
                 [dataSource]="liste()" 
                 [field]="profileForm.info" />
```
```ts
liste = signal<AutocompleteDataSource[]>([{
   display: "Un",
   value: 1
},
{
   display: "Deux",
   value: 2
}]);

let profile = signal({
   info: ''
});

let profileForm = form(this.profile, (path) => {
   required(path.info);

   // Le message remplace celui par defaut
   maxLength(path.info, 3, { message: 'Custom message' })
});

let form = new FormGroup({
   info: new FormControl<number>(
      "",
      [Validators.Required]
   )
});

onChange(_valeur: string): void
{
   console.log(_valeur);
}
```

# Button loader

## Attributs
- `icon`: Icon du bouton (mat icon)
- `label`: Texte du bouton
- `matTooltip`: Texte du tooltip
- `matTooltipPosition`: Position du tooltip par defaut
- `matButton`: Style du bouton (defaut filled)
- `loading`: Etat pour afficher ou non le spinner
- `matMiniFab`: Style du bouton
- `matFab`: Style du bouton
- `matIconButton`: Style du bouton
- `extended`: Permet de mettre un label sur un bouton `matFab`
- `disabledInteractive`: Désactiver les events et focus du bouton
- `disableRipple`: Désactiver l'effet de clique
- `disabled`: Désactiver le bouton
- `matDialogClose`: Même fonctionnement que `mat-dialog-close`
- `clicked`: Event click du bouton

## Information
`loading` = `true` => `disabledInteractive` activé

## Exemple

## exemple
```html
<jp-button-loader icon="plus" 
                  label="Click !" 
                  matFab
                  extended
                  [loading]="false" 
                  (clicked)="onClick()" />
```
```ts
onClick(): void
{
   console.log("Coucou");
}
```
