import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { Tab1Page } from './tab1.page';
import { CounterService } from '../services/counter.service';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn().mockResolvedValue({ value: null }),
    set: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
  },
}));
describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  let counterService: CounterService;

  beforeEach(() => {
    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    counterService = TestBed.inject(CounterService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add the newest saved counter to the beginning', () => {
    const first: SavedCounter = {
      id: 'first',
      name: 'První',
      value: 1,
      createdAt: new Date().toISOString(),
    };
    const second: SavedCounter = {
      id: 'second',
      name: 'Druhé',
      value: 2,
      createdAt: new Date().toISOString(),
    };

    const errorSpy = vi.spyOn(counterService, 'add');

    component.onSaved(first);
    component.onSaved(second);

    expect(errorSpy).toHaveBeenCalledWith(first);
    expect(errorSpy).toHaveBeenCalledWith(second);
  });
});
