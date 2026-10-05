import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output } from "@angular/core";
import { TraductionPipe } from "../../traductionPipe";
import { MatButtonModule } from "@angular/material/button";
import { FloatLabelType, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { FieldTree, FormField, ValidationError } from "@angular/forms/signals";

@Component({
    selector: 'jp-signal-input-text',
    standalone: true,
    templateUrl: './InputTextSignal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TraductionPipe, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, FormField]
})
export class InputTextSignal
{
    /**
     * Target signal form field tree representing the state and validation metadata.
     */
    readonly field = input.required<FieldTree<string>>();

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
     * Native input element type (e.g., 'text', 'password', 'email', 'tel').
     * @default 'text'
     */
    type = input<string>('text');

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
     * Whether to display the character counter hint when a maximum length is defined.
     * @default false
     */
    showMaxLength = input(false, { transform: booleanAttribute });

    /**
     * Whether to hide the required asterisk marker on the label.
     * @default false
     */
    hiddenRequiredMarker = input(false, { transform: booleanAttribute });

    protected valeurLongueur = computed(() => (this.field()().value() ?? '').length);

    protected listeErreur = computed(() =>
    {
        let liste = this.field()().errors() ?? [];
        const map: Record<string, ValidationError.WithFieldTree> = {};
        for (const element of liste)
            map[element.kind] = element;

        return map;
    });

    protected longeurMax = computed<number | null>(() => 
    {
        const etat = this.field()() as any;
        return typeof etat?.maxLength == 'function' ? etat.maxLength() : null;
    });

    protected longeurMin = computed<number | null>(() => 
    {
        const etat = this.field()() as any;
        return typeof etat?.minLength == 'function' ? etat.minLength() : null;
    });

    protected Btnclicker(): void
    {
        this.clicked.emit();
    }
}