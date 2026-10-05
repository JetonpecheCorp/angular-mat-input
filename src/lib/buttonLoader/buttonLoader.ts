import { booleanAttribute, ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonAppearance, MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { MatDialogRef } from '@angular/material/dialog';
import { NgClass } from '@angular/common';

@Component({
  selector: 'jp-button-loader',
  standalone: true,
  templateUrl: './buttonLoader.html',
  styleUrl: './buttonLoader.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, MatTooltipModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule]
})
export class ButtonLoader
{
  /**
     * Emits when the button is clicked. Aliased as 'clicked'.
     */
    btnClickEvent = output<void>({ alias: "clicked" });

    /**
     * Material icon name displayed within the button.
     */
    icon = input<string>();

    /**
     * Text label displayed inside the button or used as aria-label.
     */
    label = input<string>();

    /**
     * Tooltip message text displayed on hover or focus.
     */
    matTooltip = input<string>();

    /**
     * Preferred placement position for the tooltip.
     * @default 'below'
     */
    matTooltipPosition = input<TooltipPosition>("below");

    /**
     * The ID of an element that describes this button for accessibility.
     */
    ariaDescribedby = input<string>();

    /**
     * Visual style appearance applied to standard Material buttons (e.g., 'filled', 'outlined', 'text').
     * @default 'filled'
     */
    matButton = input<MatButtonAppearance>("filled");

    /**
     * Displays a progress spinner instead of the button content and marks the button as busy.
     * @default false
     */
    loading = input<boolean>(false);

    /**
     * Whether to render as a compact icon-only button.
     * @default false
     */
    matIconButton = input(false, { transform: booleanAttribute });

    /**
     * Whether to render as a standard floating action button (FAB).
     * @default false
     */
    matFab = input(false, { transform: booleanAttribute });

    /**
     * Expands the FAB layout to include both an icon and a text label.
     * Only applies when `matFab` is true.
     * @default false
     */
    extended = input(false, { transform: booleanAttribute });

    /**
     * Whether to render as a mini floating action button (Mini FAB).
     * @default false
     */
    matMiniFab = input(false, { transform: booleanAttribute });

    /**
     * Keeps the button focusable and accessible to assistive technology while disabled.
     * @default false
     */
    disabledInteractive = input(false, { transform: booleanAttribute });

    /**
     * Whether to disable the ink ripple effect.
     * @default false
     */
    disableRipple = input(false, { transform: booleanAttribute });

    /**
     * Whether the button is disabled.
     * @default false
     */
    disabled = input(false, { transform: booleanAttribute });

    /**
     * Optional result value returned when closing a parent MatDialog on click.
     */
    matDialogClose = input<any>();

    private dialogRef = inject(MatDialogRef, { optional: true });

    protected OnClick(_event: Event): void
    { 
        _event.stopPropagation();
        this.btnClickEvent.emit();

        if (this.dialogRef && this.matDialogClose() !== undefined)
            this.dialogRef.close(this.matDialogClose());
    }
}