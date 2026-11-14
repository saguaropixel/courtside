export type AnswerStatus = 'unplayed' | 'correct' | 'missed';

export const ANSWERS_CHANGED = 'rules-court-answers-changed';

export function readStatus(id: string): AnswerStatus {
  try {
    const saved = localStorage.getItem(`rules-court:${id}`);
    if (!saved) return 'unplayed';
    const { result } = JSON.parse(saved);
    return result?.correct ? 'correct' : 'missed';
  } catch {
    return 'unplayed';
  }
}
