import
    {
        booleanAttribute,
        ChangeDetectionStrategy,
        Component,
        computed,
        input
    } from '@angular/core';
import { FieldTree, FormField, ValidationError } from '@angular/forms/signals';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { EDay } from '../../EDay';
import { EMonth } from '../../EMonth';
import { TraductionPipe } from '../../traductionPipe';

@Component({
    selector: 'jp-signal-input-date',
    standalone: true,
    templateUrl: './inputDateSignal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideNativeDateAdapter()],
    imports: [
        TraductionPipe,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        FormField
    ]
})
export class InputDateSignal
{
    readonly field = input.required<FieldTree<Date | string | null>>();

    label = input<string>();

    /** Changer le logo du picker */
    iconPicker = input<string>();

    /** Mois à bloquer */
    disabledMonths = input<EMonth[]>([]);

    /** Jours de la semaine à bloquer */
    disabledDays = input<EDay[]>([]);

    /**
     * Numéro du jour à bloquer  
     * Ne pas mettre de 0 sur un chiffre (exemple 01 => 1)  
     * format: MM-DD
     */
    disabledDates = input<string[]>([]);

    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });
    touchUi = input<boolean>(false, { transform: booleanAttribute });
    hiddenRequiredMarker = input<boolean>(false, { transform: booleanAttribute });

    /** Désactiver l'input mais pas le bouton picker */
    disabledPartial = input(false, { transform: booleanAttribute });

    /** Désactiver le samedi et dimanche */
    disabledWeekend = input(false, { transform: booleanAttribute });

    /** Désactiver tout sauf le samedi et dimanche */
    disabledWeek = input(false, { transform: booleanAttribute });

    /** Désactiver le dimanche et lundi */
    disabledSundayAndMonday = input(false, { transform: booleanAttribute });

    /** Liste des erreurs indexées par leur type (kind) */
    protected listeErreur = computed(() =>
    {
        const erreurs = this.field()().errors() ?? [];
        const map: Record<string, ValidationError.WithFieldTree> = {};

        for (const element of erreurs)
        {
            map[element.kind] = element;
        }

        return map;
    });

    protected estDesactive = computed(() =>
    {
        const etat = this.field()() as any;
        console.log(etat.disabled());
        
        return typeof etat?.disabled === 'function' ? etat.disabled() : false;
    });

    protected min = computed<Date | string | null>(() =>
    {
        const erreur = this.listeErreur()['minDate'];
        return erreur?.message ? new Date(erreur.message) : null;
    });

    protected max = computed<Date | string | null>(() =>
    {
        const erreur = this.listeErreur()['maxDate'];
        return erreur?.message ? new Date(erreur.message) : null;
    });

    protected dateFilter = (_date: Date | string | null | undefined): boolean =>
    {
        if (!_date)
            return false;

        let date: Date;

        if(typeof _date === "string")
            date = new Date(_date);

        else
            date = _date;

        const day = date.getDay();

        if (this.disabledMonths().includes(date.getMonth()))
            return false;

        if (this.disabledDays().includes(day))
            return false;

        if (this.disabledWeek())
        {
            if (day != 0 && day != 6)
                return false;
        }

        if (this.disabledWeekend())
        {
            if (day == 0 || day == 6)
                return false;
        }

        if (this.disabledSundayAndMonday())
        {
            if (day == 0 || day == 1)
                return false;
        }

        if (this.disabledDates().length > 0)
        {
            const moisJour = `${date.getMonth() + 1}-${date.getDate()}`;
            if (this.disabledDates().includes(moisJour))
                return false;
        }

        return true;
    };
}