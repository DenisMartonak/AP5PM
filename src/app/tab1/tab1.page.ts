import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonInput,
    IonTitle,
    IonToolbar,
  ],
})
export class Tab1Page {
  counterName = '';
  count = 0;
  step = 0;

  increment(): void {
    this.count++;
  }

  increment5(): void {
    this.count += 5;
  }

  decrement(): void {
    if (this.count > 0) {
      this.count--;
    }
  }

  decrement5(): void {
    if (this.count >= 5) {
      this.count -= 5;
    }
  }

  incrementStep(step: number) {
    this.count += step;
  }

  decrementStep(step: number): void {
    if (this.count >= step) {
      this.count -= step;
    }
  }

  reset(): void {
    this.count = 0;
  }

  resetAll(): void {
    this.count = 0;
    this.counterName = '';
  }

  counterColor() {
    if (this.count == 0) {
      return "#FFFFFF";
    }
    return "#00f942";
  }

  preventNegativeNumber(event: KeyboardEvent) {
    if (event.key == '-') {
      event.preventDefault();
    }
  }
}