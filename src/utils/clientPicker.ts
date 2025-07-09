/**
 * Client-side picker utility to reduce server load
 * This handles the random selection logic on the client side
 */

export interface PickerOptions {
  options: string[];
  excludePrevious?: boolean;
  previousPick?: string;
}

export interface PickResult {
  pick: string;
  index: number;
  timestamp: number;
}

/**
 * Generate a cryptographically secure random number
 * Falls back to Math.random() if crypto is not available
 */
function getSecureRandom(): number {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  }
  return Math.random();
}

/**
 * Client-side random picker with enhanced features
 * Reduces server load by handling logic locally
 */
export function pickRandomOption({
  options,
  excludePrevious = false,
  previousPick
}: PickerOptions): PickResult {
  // Validate input
  if (!Array.isArray(options) || options.length === 0) {
    throw new Error('Options array cannot be empty');
  }

  if (options.length === 1) {
    return {
      pick: options[0],
      index: 0,
      timestamp: Date.now()
    };
  }

  let availableOptions = options;
  let availableIndices = options.map((_, index) => index);

  // Exclude previous pick if requested and possible
  if (excludePrevious && previousPick && options.length > 1) {
    const previousIndex = options.indexOf(previousPick);
    if (previousIndex !== -1) {
      availableOptions = options.filter((_, index) => index !== previousIndex);
      availableIndices = availableIndices.filter(index => index !== previousIndex);
    }
  }

  // Select random option
  const randomIndex = Math.floor(getSecureRandom() * availableOptions.length);
  const selectedOption = availableOptions[randomIndex];
  const originalIndex = availableIndices[randomIndex];

  return {
    pick: selectedOption,
    index: originalIndex,
    timestamp: Date.now()
  };
}

/**
 * Weighted random picker for future enhancements
 */
export function pickWeightedOption(
  options: string[],
  weights: number[]
): PickResult {
  if (options.length !== weights.length) {
    throw new Error('Options and weights arrays must have the same length');
  }

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  if (totalWeight <= 0) {
    throw new Error('Total weight must be positive');
  }

  const random = getSecureRandom() * totalWeight;
  let currentWeight = 0;

  for (let i = 0; i < options.length; i++) {
    currentWeight += weights[i];
    if (random <= currentWeight) {
      return {
        pick: options[i],
        index: i,
        timestamp: Date.now()
      };
    }
  }

  // Fallback (should never reach here)
  return {
    pick: options[options.length - 1],
    index: options.length - 1,
    timestamp: Date.now()
  };
}

/**
 * Batch picker for multiple selections
 */
export function pickMultipleOptions(
  options: string[],
  count: number,
  allowDuplicates = false
): PickResult[] {
  if (count <= 0) {
    return [];
  }

  if (!allowDuplicates && count > options.length) {
    throw new Error('Cannot pick more unique options than available');
  }

  const results: PickResult[] = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < count; i++) {
    let availableOptions = options;
    let availableIndices = options.map((_, index) => index);

    if (!allowDuplicates) {
      availableOptions = options.filter((_, index) => !usedIndices.has(index));
      availableIndices = availableIndices.filter(index => !usedIndices.has(index));
    }

    if (availableOptions.length === 0) {
      break;
    }

    const randomIndex = Math.floor(getSecureRandom() * availableOptions.length);
    const selectedOption = availableOptions[randomIndex];
    const originalIndex = availableIndices[randomIndex];

    results.push({
      pick: selectedOption,
      index: originalIndex,
      timestamp: Date.now()
    });

    if (!allowDuplicates) {
      usedIndices.add(originalIndex);
    }
  }

  return results;
}