export interface ReviewQuestion {
  id: string;
  text: string;
}

export interface ReviewStage {
  id: string;
  title: string;
  description: string;
  questions: ReviewQuestion[];
}

export interface QuestionEntry {
  date: string;
  grade: string;
  guideSign: string;
}

export interface StageFormData {
  [key: string]: QuestionEntry | string;
  remarks: string;
  reviewer1: string;
  reviewer2: string;
}

export interface ProjectData {
  [stageId: string]: StageFormData;
}

export interface Project {
  id: string;
  title: string;
  students: string[];
  guide: string;
  coGuide: string;
  reviewData: ProjectData;
}

export interface ParsedProjectEntry {
  grpNo: string;
  studentName: string;
  projectDomain: string;
  guide: string;
  coGuide: string;
}