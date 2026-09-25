import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, OnInit, Self, signal } from '@angular/core';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TraductionPipe } from '../../traductionPipe';
import { FieldTree, ValidationError, FormField } from '@angular/forms/signals';

@Component({
  selector: 'jp-signal-input-password',
  standalone: true,
  templateUrl: './inputPasswordSignal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TraductionPipe, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, FormField]
})
export class InputPasswordSignal
{
    readonly field = input.required<FieldTree<string>>();

    label = input<string>();
    placeholder = input<string>('');
    type = input<string>('text');
    hint = input<string>();

    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });
    hiddenButtonSwitch = input(false, { transform: booleanAttribute });
    showMaxLength = input(false, { transform: booleanAttribute });
    hiddenRequiredMarker = input(false, { transform: booleanAttribute });

    protected estCacher = signal<boolean>(true);

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
        return typeof etat?.minLength == 'function' ? etat.minLength() : null;
    });

    protected longeurMinMdp = computed<number>(() => (this.field()().errors().find(x => x.kind == "password") as any).min);

    protected ClickEvent(_event: Event): void
    {           
        this.estCacher.set(!this.estCacher());
        _event.stopPropagation();
    }
}
