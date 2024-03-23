import { Component, OnInit } from '@angular/core';
import { ImageChoice } from '../choice.model';
import { ChoiceService } from '../choice.service';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.css'],
  standalone: true,
  imports: [NgFor, NgIf] 
})
export class ChoiceComponent implements OnInit {

  imageChoices: ImageChoice[] = [];
  allPairsShown: boolean = false;
  showWinner: boolean = false; // Nouveau flag pour afficher le vainqueur


  constructor(private choiceService: ChoiceService) {}

  ngOnInit(): void {
    this.loadCurrentImageChoices();
  }

  onVote(imageChoiceId: number): void {
    this.choiceService.vote(imageChoiceId);
    // Après chaque vote, vérifiez si toutes les paires ont été affichées
    this.loadCurrentImageChoices();
  
  }

  private loadCurrentImageChoices(): void {
    if (!this.allPairsShown) {
        this.choiceService.getCurrentImageChoices().subscribe(imageChoices => {
            this.imageChoices = imageChoices;
            if (this.choiceService.areAllPairsShown()) {
                this.allPairsShown = true; // Empêche la recherche de nouvelles paires
                this.showWinner = true; // Prêt à afficher le vainqueur
                this.choiceService.getTopVotedImages().subscribe(topImages => {
                    this.imageChoices = topImages;
                });
            }
        });
    }
  }
}
