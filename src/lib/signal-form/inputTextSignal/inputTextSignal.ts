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
    readonly field = input.required<FieldTree<string>>();

    label = input<string>();
    placeholder = input<string>('');
    type = input<string>('text');
    hint = input<string>();
    suffixIcon = input<string>();
    prefixIcon = input<string>();

    /** Événement de clic sur l'icône bouton */
    clicked = output<void>();

    /** Convertir l'icône en bouton cliquable */
    isBtnIcon = input(false, { transform: booleanAttribute });

    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });
    showMaxLength = input(false, { transform: booleanAttribute });
    hiddenRequiredMarker = input(false, { transform: booleanAttribute });

    /** Valeur textuelle courante pour le compteur */
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
        return typeof etat?.maxLength == 'function' ? etat.minLength() : null;
    });

    protected Btnclicker(): void
    {
        this.clicked.emit();
    }
}