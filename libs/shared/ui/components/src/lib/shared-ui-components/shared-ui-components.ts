import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-shared-ui-components',
  imports: [],
  templateUrl: './shared-ui-components.html',
  styleUrl: './shared-ui-components.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiComponents {}
