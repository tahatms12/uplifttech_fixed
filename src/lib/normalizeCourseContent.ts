export interface NormalizationChange {
  rule: string;
  before: string;
  after: string;
}

export interface NormalizationResult {
  output: string;
  changes: NormalizationChange[];
}

import {
  normalizeCourseContent as normalizeCourseContentImpl,
  normalizeCourseContentWithReport as normalizeCourseContentWithReportImpl,
} from './normalizeCourseContent.mjs';

export const normalizeCourseContent = normalizeCourseContentImpl as (input: string) => string;
export const normalizeCourseContentWithReport = normalizeCourseContentWithReportImpl as (
  input: string
) => NormalizationResult;
