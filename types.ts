export type AnswerState = 'yes' | 'no' | 'na' | 'unanswered';
export type FilterState = AnswerState | 'all';

export interface TodoItem {
  id: number;
  text: string;
  answer: AnswerState;
  groupId: number | null;
}

export interface Group {
  id: number;
  name: string;
}

export interface HeaderData {
    title: string;
    investor: string;
    contractor: string;
    date: string;
}