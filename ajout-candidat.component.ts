import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CandidatService } from '../services/candidat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saisie-candidat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'ajout-candidat.component.html',
  styleUrls: ['ajout-candidat.component.css'],
})
export class CandidatSaisieComponent {
  candidatForm: FormGroup;
  candidatTrouve: boolean = false;
  candidatExistant: boolean = false;
  infosCandidat: any = null;
  messageErreur: string = ''; 
  verificationEffectuee: boolean = false;  
  candidatExiste: boolean = false; 

  constructor(private fb: FormBuilder, private candidatService: CandidatService) {
    this.candidatForm = this.fb.group({
      numeroCarte: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{9,15}$')]],
      parti: [''],
      slogan: [''],
      couleurs: [''],
      url: ['']
    });
  }
  verifierCandidat() {
    const numeroCarte = this.candidatForm.get('numeroCarte')?.value;
    this.verificationEffectuee = true;  

    this.candidatService.verifierCandidat(numeroCarte).subscribe(
      (data) => {
        if (data.existant) {
          this.candidatExistant = true;  
          this.candidatTrouve = false;
          this.infosCandidat = null;  
          this.candidatExiste = true; 
        } else if (data.trouve) {
          this.candidatTrouve = true; 
          this.candidatExistant = false;  
          this.infosCandidat = data.candidat;  
          this.candidatExiste = false; 
        } else {
          this.candidatTrouve = false;
          this.candidatExistant = false;
          this.candidatExiste = false; 
        }
      },
      (error) => {
        this.messageErreur = 'Une erreur est survenue lors de la vérification du candidat.'; 
        console.error('Erreur API', error);
      }
    );
  }

  enregistrerCandidat() {
    if (this.candidatForm.valid) {
      this.candidatService.enregistrerCandidat(this.candidatForm.value).subscribe(
        (response) => {
          console.log('Candidat enregistré :', response);
          alert('Candidat enregistré avec succès. Un code de sécurité a été envoyé.');
        },
        (error) => {
          this.messageErreur = 'Une erreur est survenue lors de l\'enregistrement du candidat.'; 
          console.error('Erreur API', error);
        }
      );
    }
  }
}
