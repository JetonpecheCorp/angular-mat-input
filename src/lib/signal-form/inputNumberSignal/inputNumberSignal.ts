import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, numberAttribute, output } from "@angular/core";
import { TraductionPipe } from "../../traductionPipe";
import { MatButtonModule } from "@angular/material/button";
import { FloatLabelType, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { FieldTree, FormField, ValidationError } from "@angular/forms/signals";

@Component({
    selector: 'jp-signal-input-number',
    standalone: true,
    templateUrl: './InputNumberSignal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TraductionPipe, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, FormField]
})
export class InputNumberSignal
{
    /**
     * Target signal form field tree representing the state and validation metadata.
     */
    readonly field = input.required<FieldTree<number>>();

    /**
     * Floating label text displayed above the input field.
     */
    label = input<string>();

    /**
     * Placeholder text displayed when the input field is empty.
     * @default ''
     */
    placeholder = input<string>('');

    /**
     * Stepping interval used for incremental numerical adjustments.
     * Transformed automatically from a string or number input.
     * @default 0
     */
    step = input<number>(0, { transform: numberAttribute });

    /**
     * Supplementary descriptive text displayed below the input field.
     */
    hint = input<string>();

    /**
     * Material icon name displayed after the input field.
     */
    suffixIcon = input<string>();

    /**
     * Material icon name displayed before the input field.
     */
    prefixIcon = input<string>();

    /**
     * Emits when a prefix or suffix icon button is clicked.
     */
    clicked = output<void>();

    /**
     * Whether prefix or suffix icons should be rendered as clickable icon buttons.
     * @default false
     */
    isBtnIcon = input(false, { transform: booleanAttribute });

    /**
     * Floating label behavior forwarded to MatFormField.
     * @default 'always'
     */
    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });

    /**
     * Whether to hide the required asterisk marker on the label.
     * @default false
     */
    hiddenRequiredMarker = input(false, { transform: booleanAttribute });

    /**
     * Whether to hide the increment and decrement spinner arrows on number inputs.
     * @default false
     */
    hiddenArrows = input(false, { transform: booleanAttribute });

    /**
     * Text align right on input number
     * @default false
     */
    textRight = input(false, { transform: booleanAttribute });

    protected listeErreur = computed(() =>
    {
        let liste = this.field()().errors() ?? [];
        const map: Record<string, ValidationError.WithFieldTree> = {};

        for (const element of liste)
            map[element.kind] = element;
        
        return map;
    });

    protected max = computed<number | null>(() => 
    {
        const etat = this.field()() as any;
        return typeof etat?.max == 'function' ? etat.max() : null;
    });

    protected min = computed<number | null>(() => 
    {
        const etat = this.field()() as any;
        return typeof etat?.min == 'function' ? etat.min() : null;
    });

    protected Btnclicker(): void
    {
        if(this.clicked)
            this.clicked.emit();
    }
}