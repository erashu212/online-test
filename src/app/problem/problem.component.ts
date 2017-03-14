import {Component, OnInit} from '@angular/core';
import {TestService} from '../test.service';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent {
  problem: string;

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    //  this.problem = this.testService.getProblem();
    this.testService.getProblem().subscribe(
        problem => this.problem = String(problem));
  }

  submit() {}
}
