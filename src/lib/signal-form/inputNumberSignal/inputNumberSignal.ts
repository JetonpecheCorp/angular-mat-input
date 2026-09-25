import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output } from "@angular/core";
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
    readonly field = input.required<FieldTree<number>>();

    label = input<string>();
    placeholder = input<string>('');
    step = input<number>(0);
    hint = input<string>();
    suffixIcon = input<string>();
    prefixIcon = input<string>();

    /** Événement de clic sur l'icône bouton */
    clicked = output<void>();

    /** Convertir l'icône en bouton cliquable */
    isBtnIcon = input(false, { transform: booleanAttribute });

    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });
    hiddenRequiredMarker = input(false, { transform: booleanAttribute });

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
        this.clicked.emit();
    }
}