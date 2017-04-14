export namespace IInterviewPanel {

  export interface Question {
    question: string;
    time_limit: number;
  }

  export interface InterviewTest {
    start_in: number;
    problem: Array<Question>;
  }
}
