import { TestBed } from '@angular/core/testing';
import { Preferences } from '@capacitor/preferences';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from './counter.service';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('CounterService', () => {
  let service: CounterService;

  const getMock = vi.mocked(Preferences.get);
  const setMock = vi.mocked(Preferences.set);
  const removeMock = vi.mocked(Preferences.remove);

  const first: SavedCounter = {
    id: 'first',
    name: 'První',
    value: 1,
    createdAt: '2026-09-17T08:00:00.000Z',
  };

  const second: SavedCounter = {
    id: 'second',
    name: 'Druhé',
    value: 2,
    createdAt: '2026-09-17T09:00:00.000Z',
  };

  beforeEach(() => {
    // Vynulujeme počty volání mocků z předchozího testu.
    vi.clearAllMocks();

    // Výchozí stav: v Preferences zatím není uložená historie.
    getMock.mockResolvedValue({ value: null });

    // Zápis i odstranění ve výchozím stavu úspěšně skončí.
    setMock.mockResolvedValue(undefined);
    removeMock.mockResolvedValue(undefined);

    // Pro každý test vytvoříme nové prostředí Angular dependency injection.
    TestBed.configureTestingModule({
      providers: [CounterService],
    });

    // Z testovacího injectoru získáme čerstvou instanci služby.
    service = TestBed.inject(CounterService);
  });

  it('should initialize only once', async () => {
    // Dvě volání bez čekání simulují souběžné požadavky na inicializaci.
    await Promise.all([service.initialize(), service.initialize()]);

    // Další volání proběhne až po dokončení první inicializace.
    await service.initialize();

    // Všechna volání musí sdílet jedinou operaci načtení Preferences.
    expect(getMock).toHaveBeenCalledTimes(1);

    // Služba dokončila inicializaci a při value: null má prázdnou historii.
    expect(service.initialized()).toBe(true);
    expect(service.counters()).toEqual([]);
  });

  // 1. Načtení uložených dat – JSON obsahující pole SavedCounter se po initialize() objeví v counters().
  it('1. should load saved data from Preferences on initialization', async () => {
    const savedData = [first, second];
    getMock.mockResolvedValue({ value: JSON.stringify(savedData) });

    await service.initialize();

    expect(getMock).toHaveBeenCalledWith({ key: 'saved-counters' });
    expect(service.counters()).toEqual(savedData);
  });
  // 2. Přidání záznamu – add() vloží nový záznam na začátek a zavolá Preferences.set() se správným klíčem a JSON hodnotou.
  it('2. should add a new record at the beginning and save it', async () => {
    getMock.mockResolvedValue({ value: JSON.stringify([second]) });
    await service.initialize();

    await service.add(first);

    const updatedCounters = [first, second];
    expect(service.counters()).toEqual(updatedCounters);

    expect(setMock).toHaveBeenCalledWith({
      key: 'saved-counters',
      value: JSON.stringify(updatedCounters),
    });
  });
  // 3. Odstranění jednoho záznamu – remove(id) odstraní pouze odpovídající objekt a nový stav uloží.
  it('3. should only remove by id and save new state', async () => {
    getMock.mockResolvedValue({ value: JSON.stringify([first, second]) });
    await service.initialize();

    await service.remove(first.id);

    const remainingCounters = [second];
    expect(service.counters()).toEqual(remainingCounters);

    expect(setMock).toHaveBeenCalledWith({
      key: 'saved-counters',
      value: JSON.stringify(remainingCounters),
    });
  });
  // 4. Vymazání historie – clear() vyprázdní signal a zavolá Preferences.remove() pouze pro klíč saved-counters.
  it('4. should clear history', async () => {
    getMock.mockResolvedValue({ value: JSON.stringify([first, second]) });
    await service.initialize();

    await service.clear();

    expect(service.counters()).toEqual([]);

    expect(removeMock).toHaveBeenCalledWith({ key: 'saved-counters' });
  });
  // 5. Poškozená uložená hodnota – neplatný JSON nezpůsobí pád testu; služba nastaví prázdnou historii, dokončí inicializaci a zapíše chybu do konzole.
  it('5. should handle corrupted saved value', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    getMock.mockResolvedValue({ value: '{ invalid-json }' });

    await service.initialize();

    expect(service.initialized()).toBe(true);
    expect(service.counters()).toEqual([]);

    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
