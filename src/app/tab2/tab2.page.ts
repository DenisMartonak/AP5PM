import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToolbar,
  IonSelect,
  IonSelectOption,
  IonSearchbar,
  AlertController,
  ToastController,
} from '@ionic/angular';
import { CounterService } from '../services/counter.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSpinner,
    IonTitle,
    IonToolbar,
    IonSelect,
    IonSelectOption,
    IonSearchbar,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);
  sortType = signal<'date' | 'name' | 'value'>('date');
  searchQuery = signal<string>('');
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

  counterTotal = computed(() => {
    return this.counterService.counters().reduce((sum, item) => sum + item.value, 0);
  });

  positiveCounters = computed(() => {
    return this.counterService.counters().filter((counter) => counter.value > 0).length;
  });

  zeroCounters = computed(() => {
    return this.counterService.counters().filter((counter) => counter.value === 0).length;
  });

  filteredAndSortedCounters = computed(() => {
    let counters = [...this.counterService.counters()];
    const query = this.searchQuery().toLowerCase().trim();

    if (query) {
      counters = counters.filter((counters) => counters.name.toLowerCase().includes(query));
    }

    const sort = this.sortType();

    if (sort === 'name') {
      return counters.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'value') {
      return counters.sort((a, b) => b.value - a.value);
    }
    return counters;
  });

  async confirmClear(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Opravdu smazat?',
      message: 'Opravdu chcete smazat celou historii?',
      buttons: [
        {
          text: 'Zrusit',
          role: 'cancel',
        },
        {
          text: 'Smazat',
          role: 'confirm',
          handler: () => {
            this.counterService.clear();
          },
        },
      ],
    });
    await alert.present();
  }

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);

    const toast = await this.toastController.create({
      message: 'Uspesne vymazano',
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    await toast.present();
  }

  async clear(): Promise<void> {
    await this.counterService.clear();
  }
}
