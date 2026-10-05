import { booleanAttribute, ChangeDetectionStrategy, Component, DestroyRef, inject, input, model, numberAttribute, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { FloatLabelType, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'jp-search-bar',
    standalone: true,
    templateUrl: './inputSearch.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule]
})
export class SearchBarComponent
{
    private readonly destroyRef = inject(DestroyRef);
    private debounceTimer: ReturnType<typeof setTimeout> | null = null;

    /**
     * Two-way bound query string value.
     */
    value = model<string>('');

    /**
     * Debounce duration in milliseconds before emitting the search event.
     * Set to 0 to disable debouncing.
     * @default 600
     */
    debounceTime = input(600, { transform: numberAttribute });

    /**
     * Floating label text displayed above the input.
     */
    label = input<string>();

    /**
     * Placeholder text displayed when the input is empty.
     */
    placeholder = input<string>('');

    /**
     * Supplementary descriptive text displayed below the field.
     */
    hint = input<string>();

    /**
     * Material icon name displayed before the input field.
     * @default 'search'
     */
    prefixIcon = input<string>('search');

    /**
     * Material icon name displayed after the input field.
     */
    suffixIcon = input<string>();

    /**
     * Determines whether the prefix/suffix icons should render as clickable icon buttons.
     * @default false
     */
    isBtnIcon = input(false, { transform: booleanAttribute });

    /**
     * Whether to show an automatic clear button when the input contains text.
     * @default true
     */
    clearable = input(true, { transform: booleanAttribute });

    /**
     * Label floating behavior forwarded to MatFormField.
     * @default 'auto'
     */
    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });

    /**
     * Emits the trimmed search query after the debounce delay or upon pressing Enter.
     */
    search = output<string>();

    /**
     * Emits when an icon button is clicked.
     */
    clicked = output<void>();

    constructor()
    {
        // Nettoyage automatique du timer si le composant est détruit en cours de frappe
        this.destroyRef.onDestroy(() => this.ResetTimer());
    }

    protected Rechercher(_event: Event): void
    {
        const inputEl = _event.target as HTMLInputElement;
        this.value.set(inputEl.value);

        this.ResetTimer();

        // Si debounceTime <= 0, émission directe
        if (this.debounceTime() <= 0) 
        {
            this.search.emit(this.value().trim());
            return;
        }

        this.debounceTimer = setTimeout(() => 
        {
            this.search.emit(this.value().trim());
        }, this.debounceTime());
    }

    protected ValiderRecherche(): void
    {
        this.ResetTimer();
        this.search.emit(this.value().trim());
    }

    protected Reset(): void
    {
        this.ResetTimer();
        this.value.set('');
        this.search.emit('');
    }

    protected BtnClicker(): void
    {
        this.clicked.emit();
    }

    private ResetTimer(): void
    {
        if (this.debounceTimer) 
        {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
        }
    }
}