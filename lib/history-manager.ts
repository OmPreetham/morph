import type { ConversionFormat } from "./conversion-service"

export type HistoryItem = {
  id: string
  sourceFormat: ConversionFormat
  targetFormats: ConversionFormat[]
  outputs: Record<ConversionFormat, string>
  input: string
  timestamp: number
}

export const saveToHistory = (
  history: HistoryItem[],
  input: string,
  outputs: Record<ConversionFormat, string>,
  sourceFormat: ConversionFormat,
  targetFormats: ConversionFormat[],
): HistoryItem[] => {
  const newHistoryItem: HistoryItem = {
    id: Date.now().toString(),
    sourceFormat,
    targetFormats,
    outputs,
    input,
    timestamp: Date.now(),
  }

  return [newHistoryItem, ...history]
}

export const deleteHistoryItem = (history: HistoryItem[], id: string): HistoryItem[] => {
  return history.filter((item) => item.id !== id)
}

export const clearHistory = (): HistoryItem[] => {
  return []
}

