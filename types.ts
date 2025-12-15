
export interface LabResult {
  date: Date;
  examType: string;
  examName: string;
  value: number;
}

export type ViewMode = 'historical' | 'recent';
