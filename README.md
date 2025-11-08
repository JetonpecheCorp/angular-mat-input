# Angular mat input

Rend moins pénible de faire des inputs de angular matérial.   
Les erreurs sont implémentées et traduite dans 5 langues (anglais, francais, espagnol, italien et portugais) selon la **langue du navigateur.**    
**Par defaut anglais**

# Configuration

```js
// app.config.ts
import { provideJpMatInput } from '@jetonpeche/angular-mat-input';

export const appConfig: ApplicationConfig = {
  providers: [
   // ...
    provideJpMatInput()
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
- `formControlName`: Obligatoire
- `label`: Nom de l'input
- `placeholder`: Placeholder de l'input
- `type`: En option, defaut type text, valeurs possibles  
   - text, url, search, tel, email, color
- `suffixIcon`: Définir et place l'icon à gauche (mat icon)
- `prefixIcon`: Définir et place l'icon à droite (mat icon)
- `floatLabel`: Bloquer le label en haut de l'input
- `showMaxLength`: Affiche la longeur max d'une chaine en bas de l'input
- `hiddenRequiredMarker`: Supprimer * quand l'input est obligatoire

## exemple
```html
<jp-input-text label="Nom" formControlName="nom" />
```
```js
let form = new FormGroup({
   nom: new FormControl(
      "",
      [Validators.maxLength(3), Validators.email, Validators.required]
   )
});
```

# Input number

## Attributs
- `formControlName`: Obligatoire
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
```
```js
let form = new FormGroup({
   age: new FormControl(
      "",
      [Validators.max(100), Validators.required]
   )
});
```

# Input password

## passwordValidator
Donne la règle du mot de passe:
- 1 minuscule
- 1 majuscule
- 1 chiffre
- 1 caractère spécial
- 8 caractères minimum au total

## Attributs
- `formControlName`: Obligatoire
- `label`: Nom de l'input
- `placeholder`: Placeholder de l'input
- `floatLabel`: Bloquer le label en haut de l'input
- `hiddenButtonSwitch`: Masquer le bouton qui permet d'afficher le mot de passe
- `hiddenRequiredMarker`: Supprimer * quand l'input est obligatoire
- `showMaxLength`: Affiche la longeur max d'une chaine en bas de l'input

## exemple
```html
<jp-input-password label="Mot de passe" formControlName="mdp" />
```
```js
let form = new FormGroup({
   mdp: new FormControl(
      "",
      [passwordValidator, Validators.required]
   )
});
```

# Input Date

## Validators

- `minDateValidator`: Définir la date minimum possible dans le picker
- `maxDateValidator`: Définir la date maximum possible dans le picker

```js
let date = new FormControl(
   null, [
      minDateValidator("2025-01-01"), // possible avec type Date
      maxDateValidator("2025-01-20"), // possible avec type Date
   ]
);
```

## EDay
Enum des jours de la semaine

## EMonth
Enum des mois de l'année (index 0 à 11)

## Attributs
- `formControlName`: Obligatoire
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
```
```js
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
- `formControlName`: Obligatoire
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
```
```js
let form = new FormGroup({
   info: new FormControl(
      "",
      [Validators.maxLength(3_000)]
   )
});
```

# Input file button

## Attributs
- `formControlName`: Obligatoire
- `label`: Nom de l'input
- `icon`: Icon du bouton (mat icon)
- `accept`: Liste des extensions de fichier acceptés
- `multiple`: Autoriser à mettre plusieurs fichier
- `matButton`: Style du bouton
- `matMiniFab`: Style du bouton
- `matFab`: Style du bouton
- `matIconButton`: Style du bouton
- `extended`: Permet de mettre un label sur un bouton `matFab`

## exemple
```html
<jp-input-file-btn matFab extended label="Info en plus" formControlName="fichier" />
```
```js
let form = new FormGroup({
   fichier: new FormControl<FileList>(null)
});
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
- `formControlName`: Obligatoire
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
