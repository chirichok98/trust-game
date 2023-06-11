import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'de',
  },
  {
    path: ':lang',
    component: QuizComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
