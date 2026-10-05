import { booleanAttribute, ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DarkModeDirective } from './darkModeDirective';
import { TraductionPipe } from '../traductionPipe';
import { NgClass } from '@angular/common';

@Component({
  selector: 'jp-input-file-drop-zone',
  standalone: true,
  templateUrl: './inputFileDropZone.html',
  styleUrl: './inputFileDropZone.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TraductionPipe, MatIconModule, DarkModeDirective]
})
export class InputFileDropZone
{
    /**
     * Material icon name displayed within the drop zone area.
     * @default 'upload_file'
     */
    icon = input<string>("upload_file");

    /**
     * Comma-separated list of allowed file extensions or MIME types (e.g., 'image/*', '.pdf').
     */
    accept = input<string>();

    /**
     * Additional explanatory text displayed below the main label (e.g., supported formats, max size).
     */
    info = input<string>();

    /**
     * Emits the selected FileList upon manual selection or drop.
     */
    selectedFiles = output<FileList>();

    /**
     * Whether to restrict file selection to a single file.
     * @default false
     */
    notMultiple = input(false, { transform: booleanAttribute });

    /**
     * Whether user interactions with the drop zone are disabled.
     * @default false
     */
    disabled = input(false, { transform: booleanAttribute });

    protected estDragger = signal<boolean>(false);

    protected DragOver(event: DragEvent): void 
    {
        event.preventDefault();
        event.stopPropagation();
        this.estDragger.set(true);
    }

    protected DragLeave(event: DragEvent): void 
    {
        event.preventDefault();
        event.stopPropagation();
        this.estDragger.set(false);
    }

    protected onDrop(event: DragEvent): void 
    {
        event.preventDefault();
        event.stopPropagation();
        this.estDragger.set(false);

        const LISTE_FICHIER = event.dataTransfer?.files;

        if( LISTE_FICHIER && LISTE_FICHIER.length > 0)
            this.selectedFiles.emit(LISTE_FICHIER);
    }

    protected FichierChoisi(event: Event): void 
    {
        const INPUT = event.target as HTMLInputElement;
        const LISTE_FICHIER = INPUT.files;

        if (LISTE_FICHIER && LISTE_FICHIER.length > 0) 
            this.selectedFiles.emit(LISTE_FICHIER);
    }
}