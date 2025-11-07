import { booleanAttribute, Component, inject, input, output } from '@angular/core';
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
  imports: [NgClass, MatTooltipModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule]
})
export class ButtonLoader
{
    btnClickEvent = output<void>({ alias: "clicked" });

    icon = input<string>();
    label = input<string>();
    matTooltip = input<string>();
    matTooltipPosition = input<TooltipPosition>("below");
    ariaDescribedby = input<string>();
    matButton = input<MatButtonAppearance>("filled");

    /** Display spinner progress instead of your content */
    loading = input<boolean>(false);

    matIconButton = input(false, { transform: booleanAttribute });
    matFab = input(false, { transform: booleanAttribute });
    extended = input(false, { transform: booleanAttribute });
    matMiniFab = input(false, { transform: booleanAttribute });
    disabledInteractive = input(false, { transform: booleanAttribute });
    disableRipple = input(false, { transform: booleanAttribute });
    disabled = input(false, { transform: booleanAttribute });
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