import { ReviewStage } from './types';

export const PROJECT_STAGES: ReviewStage[] = [
  {
    id: 'review-1',
    title: 'Project Review I (Semester I)',
    description: 'Problem Statement, Motivation, objectives and Literature Review. Student is expected to deliver presentation covering these aspects.',
    questions: [
      { id: 'q1', text: 'Do Research gap identified lead to find motivation of project?' },
      { id: 'q2', text: 'Does the statement give clear identification about what your project will accomplish?' },
      { id: 'q3', text: 'Is the statement short and concise?' },
      { id: 'q4', text: 'Do similar type of methodology / model exists?' },
      { id: 'q5', text: 'Is the studied literature sufficient to decide scope of the project?' },
      { id: 'q6', text: 'Are the objectives clearly and unambiguously listed?' },
      { id: 'q7', text: 'Can a person who is not familiar with the project understand scope of the project by reading the project problem statement?' },
      { id: 'q8', text: 'Are project objectives of study (what product, process, resource etc.) clearly defined?' },
      { id: 'q9', text: 'Are the objectives set helpful to achieve goal of the project?' },
      { id: 'q10', text: 'Does the project contribute to our society by any means?' },
    ],
  },
  {
    id: 'dev-start',
    title: 'Development Start',
    description: 'Review of project architecture, technology stack, and initial setup.',
    questions: [
      { id: 'ds1', text: 'Is the system architecture well-defined and documented?' },
      { id: 'ds2', text: 'Has the technology stack been finalized and justified?' },
      { id: 'ds3', text: 'Is the project repository set up with version control?' },
      { id: 'ds4', text: 'Are the initial modules and components planned out?' },
    ],
  },
  {
    id: 'mid-dev',
    title: 'Mid-Development Review',
    description: 'Assessing the progress of the development phase and identifying any blockers.',
    questions: [
      { id: 'md1', text: 'Is the project progress on track with the proposed timeline?' },
      { id: 'md2', text: 'Has a significant portion of the core functionality been implemented?' },
      { id: 'md3', text: 'Are there any major technical challenges or roadblocks?' },
      { id: 'md4', text: 'Is the code quality satisfactory and well-documented?' },
    ],
  },
  {
    id: 'dev-complete',
    title: 'Development Complete & Testing',
    description: 'Verifying the completion of all features and the status of testing.',
    questions: [
      { id: 'dc1', text: 'Are all the proposed features implemented?' },
      { id: 'dc2', text: 'Has unit and integration testing been performed?' },
      { id: 'dc3', text: 'Is the project ready for deployment/demonstration?' },
      { id: 'dc4', text: 'Is the final project report in preparation?' },
    ],
  },
  {
    id: 'final-pres',
    title: 'Final Presentation Prep',
    description: 'Final checks before the project presentation and viva.',
    questions: [
      { id: 'fp1', text: 'Is the presentation content complete and well-structured?' },
      { id: 'fp2', text: 'Has the project demonstration been rehearsed?' },
      { id: 'fp3', text: 'Are all project artifacts (report, code, presentation) ready for submission?' },
    ],
  },
];
