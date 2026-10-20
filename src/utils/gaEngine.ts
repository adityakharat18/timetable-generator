import {
  DayOfWeek,
  GAHyperparameters,
  GATelemetry,
  ScheduledClass,
} from '../types/schedule';
import { DAYS, PERIOD_SLOTS, ROOMS, SUBJECTS, FACULTY_MEMBERS } from '../data/mockData';

export interface Chromosome {
  id: string;
  genes: ScheduledClass[];
  fitness: number;
  hardViolations: number;
  softPenalties: number;
}

export function evaluateChromosome(genes: ScheduledClass[]): {
  fitness: number;
  hardViolations: number;
  softPenalties: number;
} {
  let hardViolations = 0;
  let softPenalties = 0;

  // 1. Check for Faculty Double-Booking (Hard)
  const facultySlots = new Map<string, number>();
  // 2. Check for Room Over-Allocation (Hard)
  const roomSlots = new Map<string, number>();
  // 3. Check for Cohort Simultaneous Slot Clash (Hard)
  const cohortSlots = new Map<string, number>();
  // 4. Faculty daily load count (Soft)
  const facultyDailyLoad = new Map<string, number>();

  for (const c of genes) {
    const timeKey = `${c.day}-${c.periodNumber}`;

    // Faculty clash
    const facKey = `${timeKey}-${c.facultyId}`;
    if (facultySlots.has(facKey)) {
      hardViolations += 1;
    } else {
      facultySlots.set(facKey, 1);
    }

    // Room clash
    const rmKey = `${timeKey}-${c.roomId}`;
    if (roomSlots.has(rmKey)) {
      hardViolations += 1;
    } else {
      roomSlots.set(rmKey, 1);
    }

    // Cohort clash
    const cohKey = `${timeKey}-${c.cohort}`;
    if (cohortSlots.has(cohKey)) {
      hardViolations += 1;
    } else {
      cohortSlots.set(cohKey, 1);
    }

    // Faculty daily load
    const facDayKey = `${c.day}-${c.facultyId}`;
    const currDaily = (facultyDailyLoad.get(facDayKey) || 0) + 1;
    facultyDailyLoad.set(facDayKey, currDaily);
    if (currDaily > 4) {
      softPenalties += 2;
    }
  }

  // Raw fitness score calculation (0 - 100)
  // Hard violations strictly penalize; soft penalties degrade marginally
  const rawFitness = 100 - (hardViolations * 25) - (softPenalties * 0.4);
  const clampedFitness = Math.max(10, Math.min(99.4, Number(rawFitness.toFixed(1))));

  return {
    fitness: clampedFitness,
    hardViolations,
    softPenalties,
  };
}

export function mutateChromosome(chromosome: Chromosome, mutationRate: number): Chromosome {
  const newGenes = [...chromosome.genes];
  if (Math.random() < mutationRate && newGenes.length > 2) {
    const idxA = Math.floor(Math.random() * newGenes.length);
    const idxB = Math.floor(Math.random() * newGenes.length);

    // Swap time/day assignment
    const geneA = newGenes[idxA];
    const geneB = newGenes[idxB];

    newGenes[idxA] = {
      ...geneA,
      day: geneB.day,
      periodNumber: geneB.periodNumber,
    };
    newGenes[idxB] = {
      ...geneB,
      day: geneA.day,
      periodNumber: geneA.periodNumber,
    };
  }

  const evalResult = evaluateChromosome(newGenes);
  return {
    id: `chrom-${Math.random().toString(36).substring(2, 9)}`,
    genes: newGenes,
    fitness: evalResult.fitness,
    hardViolations: evalResult.hardViolations,
    softPenalties: evalResult.softPenalties,
  };
}

export function crossoverChromosomes(
  parentA: Chromosome,
  parentB: Chromosome,
  crossoverRate: number
): [Chromosome, Chromosome] {
  if (Math.random() > crossoverRate || parentA.genes.length !== parentB.genes.length) {
    return [{ ...parentA }, { ...parentB }];
  }

  const length = parentA.genes.length;
  const point1 = Math.floor(Math.random() * (length / 2));
  const point2 = point1 + Math.floor(Math.random() * (length / 2)) + 1;

  const childAGenes = [...parentA.genes];
  const childBGenes = [...parentB.genes];

  for (let i = point1; i < point2 && i < length; i++) {
    childAGenes[i] = { ...parentB.genes[i] };
    childBGenes[i] = { ...parentA.genes[i] };
  }

  const evalA = evaluateChromosome(childAGenes);
  const evalB = evaluateChromosome(childBGenes);

  return [
    {
      id: `chrom-${Math.random().toString(36).substring(2, 9)}`,
      genes: childAGenes,
      fitness: evalA.fitness,
      hardViolations: evalA.hardViolations,
      softPenalties: evalA.softPenalties,
    },
    {
      id: `chrom-${Math.random().toString(36).substring(2, 9)}`,
      genes: childBGenes,
      fitness: evalB.fitness,
      hardViolations: evalB.hardViolations,
      softPenalties: evalB.softPenalties,
    },
  ];
}

export function tournamentSelect(population: Chromosome[], k: number): Chromosome {
  let best = population[Math.floor(Math.random() * population.length)];
  for (let i = 1; i < k; i++) {
    const candidate = population[Math.floor(Math.random() * population.length)];
    if (candidate.fitness > best.fitness) {
      best = candidate;
    }
  }
  return best;
}

export function stepGeneration(
  population: Chromosome[],
  params: GAHyperparameters
): {
  newPopulation: Chromosome[];
  best: Chromosome;
  meanFitness: number;
  minFitness: number;
  diversity: number;
} {
  // Sort descending by fitness
  const sorted = [...population].sort((a, b) => b.fitness - a.fitness);
  const elitismCount = Math.max(1, params.elitismKeepers);
  const nextGen: Chromosome[] = sorted.slice(0, elitismCount);

  while (nextGen.length < params.populationSize) {
    const p1 = tournamentSelect(sorted, params.tournamentK);
    const p2 = tournamentSelect(sorted, params.tournamentK);
    const [c1, c2] = crossoverChromosomes(p1, p2, params.crossoverRate);
    const m1 = mutateChromosome(c1, params.mutationRate);
    const m2 = mutateChromosome(c2, params.mutationRate);
    nextGen.push(m1);
    if (nextGen.length < params.populationSize) {
      nextGen.push(m2);
    }
  }

  // Calculate statistics
  let totalFit = 0;
  let minFit = Infinity;
  for (const c of nextGen) {
    totalFit += c.fitness;
    if (c.fitness < minFit) minFit = c.fitness;
  }
  const meanFit = totalFit / nextGen.length;

  // Diversity estimate based on fitness variance
  let varianceSum = 0;
  for (const c of nextGen) {
    varianceSum += Math.pow(c.fitness - meanFit, 2);
  }
  const stdDev = Math.sqrt(varianceSum / nextGen.length);
  const diversity = Math.min(1, Number((stdDev / 12).toFixed(2)));

  const best = nextGen[0];

  return {
    newPopulation: nextGen,
    best,
    meanFitness: Number(meanFit.toFixed(1)),
    minFitness: Number((minFit === Infinity ? 60 : minFit).toFixed(1)),
    diversity,
  };
}

export function createRandomPopulation(
  baseSchedule: ScheduledClass[],
  popSize: number
): Chromosome[] {
  const pop: Chromosome[] = [];

  // Base individual
  const baseEval = evaluateChromosome(baseSchedule);
  pop.push({
    id: `chrom-base-0`,
    genes: [...baseSchedule],
    fitness: baseEval.fitness,
    hardViolations: baseEval.hardViolations,
    softPenalties: baseEval.softPenalties,
  });

  // Generate variants with random swaps
  for (let i = 1; i < popSize; i++) {
    const genes = [...baseSchedule];
    const swapCount = Math.floor(Math.random() * 8) + 1;
    for (let s = 0; s < swapCount; s++) {
      const idxA = Math.floor(Math.random() * genes.length);
      const idxB = Math.floor(Math.random() * genes.length);
      const gA = genes[idxA];
      const gB = genes[idxB];
      genes[idxA] = { ...gA, day: gB.day, periodNumber: gB.periodNumber };
      genes[idxB] = { ...gB, day: gA.day, periodNumber: gA.periodNumber };
    }
    const evalRes = evaluateChromosome(genes);
    pop.push({
      id: `chrom-init-${i}`,
      genes,
      fitness: evalRes.fitness,
      hardViolations: evalRes.hardViolations,
      softPenalties: evalRes.softPenalties,
    });
  }

  return pop;
}
