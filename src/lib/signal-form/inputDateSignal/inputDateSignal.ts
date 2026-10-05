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
   /**
     * Target signal form field tree representing the state and validation metadata.
     */
    readonly field = input.required<FieldTree<Date | string | null>>();

    /**
     * Floating label text displayed above the date input field.
     */
    label = input<string>();

    /**
     * Custom Material icon name used for the datepicker toggle button.
     */
    iconPicker = input<string>();

    /**
     * List of calendar months to disable within the datepicker.
     * @default []
     */
    disabledMonths = input<EMonth[]>([]);

    /**
     * List of weekdays to disable within the datepicker.
     * @default []
     */
    disabledDays = input<EDay[]>([]);

    /**
     * Specific recurring calendar dates to disable formatted as 'M-D' without leading zeros (e.g., '12-25').
     * @default []
     */
    disabledDates = input<string[]>([]);

    /**
     * Floating label behavior forwarded to MatFormField.
     * @default 'always'
     */
    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });

    /**
     * Whether the datepicker UI opens as a dialog rather than a popup panel.
     * @default false
     */
    readonly touchUi = input(false, { transform: booleanAttribute });

    /**
     * Whether to hide the required asterisk marker on the label.
     * @default false
     */
    hiddenRequiredMarker = input(false, { transform: booleanAttribute });

    /**
     * Sets the text input to readonly while keeping the datepicker toggle active.
     * @default false
     */
    disabledPartial = input(false, { transform: booleanAttribute });

    /**
     * Whether to disable weekend days (Saturday and Sunday).
     * @default false
     */
    disabledWeekend = input(false, { transform: booleanAttribute });

    /**
     * Whether to disable all weekdays, leaving only weekends selectable.
     * @default false
     */
    disabledWeek = input(false, { transform: booleanAttribute });

    /**
     * Whether to disable Sundays and Mondays.
     * @default false
     */
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