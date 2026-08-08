import { describe, expect, it } from 'vitest';
import { extractId, formatDateDDMMYYYY, formatHeightMeters, formatMassKg, formatPopulation } from '../utils/formatters';

describe('formatHeightMeters', () => {
  it('converts centimeters to meters with two decimals', () => {
    expect(formatHeightMeters('172')).toBe('1.72 m');
  });

  it('handles unknown heights gracefully', () => {
    expect(formatHeightMeters('unknown')).toBe('Unknown');
    expect(formatHeightMeters('')).toBe('Unknown');
  });
});

describe('formatMassKg', () => {
  it('formats a plain numeric mass', () => {
    expect(formatMassKg('77')).toBe('77 kg');
  });

  it('strips thousands separators before formatting', () => {
    expect(formatMassKg('1,358')).toBe('1,358 kg');
  });

  it('handles unknown mass gracefully', () => {
    expect(formatMassKg('unknown')).toBe('Unknown');
  });
});

describe('formatDateDDMMYYYY', () => {
  it('formats an ISO timestamp as dd-MM-yyyy', () => {
    expect(formatDateDDMMYYYY('2014-12-09T13:50:51.644000Z')).toBe('09-12-2014');
  });
});

describe('formatPopulation', () => {
  it('adds thousands separators', () => {
    expect(formatPopulation('200000')).toBe('200,000');
  });

  it('handles unknown population gracefully', () => {
    expect(formatPopulation('unknown')).toBe('Unknown');
  });
});

describe('extractId', () => {
  it('pulls the trailing numeric id from a SWAPI resource URL', () => {
    expect(extractId('https://www.swapi.tech/api/planets/1/')).toBe('1');
    expect(extractId('https://www.swapi.tech/api/people/22')).toBe('22');
  });
});
