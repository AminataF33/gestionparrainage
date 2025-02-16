import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-import-electeur',
  standalone: true,
  templateUrl: 'import-electeur.component.html',
  styleUrls: ['import-electeur.component.css'],
  imports: [ReactiveFormsModule ,CommonModule],
})
export class ImportElecteursComponent {
  importForm: FormGroup;
  file: File | null = null;
  checksum: string = '';
  calculatedChecksum: string = ''; 
  uploadError: string | null = null;

  constructor() {
    this.importForm = new FormGroup({
      checksum: new FormControl('', [Validators.required]),
      file: new FormControl(null, [Validators.required]),
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    if (file) {
      if (file.name.endsWith('.csv')) {
        this.file = file;
        this.importForm.patchValue({ file: file });
        this.uploadError = null;

        // Calcul du SHA256 du fichier
        this.calculateSHA256(file).then(hash => {
          this.calculatedChecksum = hash;
          console.log('SHA256 du fichier:', this.calculatedChecksum);
        });
      } else {
        this.uploadError = "Le fichier doit être au format CSV.";
        this.importForm.patchValue({ file: null });
      }
    }
  }

  async calculateSHA256(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    this.calculateSHA256(file).then(hash => {
      this.calculatedChecksum = hash;
      console.log('SHA256 du fichier en Angular:', this.calculatedChecksum);
    });
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  }

  

  onChecksumChange(event: any) {
    this.importForm.patchValue({ checksum: event.target.value });
  }

  validateFile() {
    console.log("Bouton cliqué !");
    console.log("État du formulaire :", this.importForm.valid);
    console.log("Fichier sélectionné :", this.importForm.value.file);
    console.log("Checksum saisi :", this.importForm.value.checksum);
    console.log("Checksum calculé :", this.calculatedChecksum);

    if (this.importForm.valid && this.file) {
      if (this.importForm.value.checksum !== this.calculatedChecksum) {
        this.uploadError = "L'empreinte SHA256 ne correspond pas au fichier.";
      } else {
        console.log('Fichier validé, en attente de confirmation du backend...');
        alert('Importation réussie !');
        this.uploadError = null;
      }
    } else {
      this.uploadError = 'Erreur lors du téléchargement du fichier ou de la saisie du checksum';
    }
  }
}
