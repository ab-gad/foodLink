import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsDemo } from './form';


@Component({
  imports: [RouterModule, ReactiveFormsDemo],
  selector: 'admin-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected title = 'admin';
}
