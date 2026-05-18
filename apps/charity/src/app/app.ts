import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TopLoaderOverlayComponent } from '@foodlink/shared-core';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';

@Component({
  imports: [RouterModule, HlmToasterImports, TopLoaderOverlayComponent],
  selector: 'charity-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected title = 'charity';
}
