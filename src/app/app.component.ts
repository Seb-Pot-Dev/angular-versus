import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChoiceComponent } from './choice/choice.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChoiceComponent], // Ajoutez ChoiceComponent ici
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrigé à 'styleUrls'
})
export class AppComponent {
  title = 'angular-versus';
}
