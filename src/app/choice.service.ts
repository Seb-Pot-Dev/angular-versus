import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ImageChoice } from './choice.model';

@Injectable({
  providedIn: 'root'
})
export class ChoiceService {
  private allImageChoices: ImageChoice[] = [
    { id: 1, imageUrl: 'https://static.actu.fr/uploads/2022/07/15f265e10539b398d4c12d5f9e3cec7f7dc0cf4d.jpg', points: 0 },
    { id: 2, imageUrl: 'https://static.nationalgeographic.fr/files/styles/image_3200/public/ouverture-espace-une-nouvelle-ere-de-decouvertes-ng289.jpg?w=1190&h=688', points: 0 },
    { id: 3, imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/09/maxresdefault_copy.jpg?w=4096&format=jpeg', points: 0 },
    { id: 4, imageUrl: 'https://arc-anglerfish-eu-central-1-prod-leparisien.s3.amazonaws.com/public/PTBLQOVVYPOSWQYRVR6MSBYSOI.jpg', points: 0 },
  ];

  // Démarrer avec les deux premières images
  private currentIndex = 0; 

  // Pour stocker les paires qui ont déjà été affichées
  private shownPairs: Set<string> = new Set();

  constructor() { }

  getCurrentImageChoices(): Observable<ImageChoice[]> {
        let newPair = false;
        let tries = 0; // Pour éviter une boucle infinie si toutes les combinaisons ont été vues

    while (!newPair && tries < this.allImageChoices.length ** 2) {
        const potentialNextIndex = (this.currentIndex + 2) % this.allImageChoices.length;
        const nextPairKey = `${this.allImageChoices[this.currentIndex].id}-${this.allImageChoices[potentialNextIndex].id}`;

        // Vérifiez si cette paire a été affichée
        if (!this.shownPairs.has(nextPairKey)) {
        newPair = true;
        this.shownPairs.add(nextPairKey); // Marquez cette paire comme montrée
        this.currentIndex = potentialNextIndex; // Mettez à jour l'index pour afficher cette nouvelle paire
        } else {
        this.currentIndex = (this.currentIndex + 1) % this.allImageChoices.length; // Essayez la prochaine image
        }
        console.log(this.shownPairs)
        tries++;
        }
        // Corrigez la sélection de l'index de fin pour gérer le cas de boucle :
        const endIndex = (this.currentIndex + 2) % this.allImageChoices.length;
        let imagesToReturn = [];

        if (endIndex > this.currentIndex) { // Cas normal
            imagesToReturn = this.allImageChoices.slice(this.currentIndex, this.currentIndex + 2);
        } else { // Cas de boucle
            imagesToReturn = [...this.allImageChoices.slice(this.currentIndex, this.allImageChoices.length), ...this.allImageChoices.slice(0, endIndex)];
        }

        return of(imagesToReturn);
        }

        vote(imageChoiceId: number): void {
            const imageChoice = this.allImageChoices.find(ic => ic.id === imageChoiceId);
            if (imageChoice) {
            imageChoice.points += 1;
        }
    }


    getTopVotedImages(): Observable<ImageChoice[]> {
            // Trier les choix d'images en fonction de leurs points, du plus grand au plus petit
        const sortedImages = this.allImageChoices.slice().sort((a, b) => b.points - a.points);
        // Trouver le score le plus élevé
        const highestScore = sortedImages[0]?.points;

        // Retourner toutes les images qui ont ce score le plus élevé
        const winners = sortedImages.filter(image => image.points === highestScore);
        return of(winners);
    }
    
    areAllPairsShown(): boolean {
        // Vérifie si toutes les paires possibles ont été montrées
        return this.shownPairs.size >= (this.allImageChoices.length * (this.allImageChoices.length - 1)) / 2;
    }
    
}

