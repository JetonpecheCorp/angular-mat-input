import { booleanAttribute, Component, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DarkModeDirective } from './darkModeDirective';
import { TraductionPipe } from '../traductionPipe';
import { NgClass } from '@angular/common';

@Component({
  selector: 'jp-input-file-drop-zone',
  standalone: true,
  templateUrl: './inputFileDropZone.html',
  styleUrl: './inputFileDropZone.css',
  imports: [NgClass, TraductionPipe, MatIconModule, DarkModeDirective]
})
export class InputFileDropZone
{
    icon = input<string>("upload_file");
    accept = input<string>();

    /** Donner des informations en plus comme les fichiers acceptés ou autre */
    info = input<string>();
    selectedFiles = output<FileList>();

    notMultiple = input(false, { transform: booleanAttribute });
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