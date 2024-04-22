import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { TitleComponent } from '../../../shared/title/title.component';

@Component({
  selector: 'app-change-detection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TitleComponent, CommonModule],
  template: `
    <app-title title="{{ currentFramework() }}"></app-title>
    <p>{{ frameworkAsSignal() | json }}</p>
    <p>{{ frameworkAsProperty | json }}</p>
  `,
})
export default class ChangeDetectionComponent {
  public currentFramework = computed(
    () => `Change Detection - ${this.frameworkAsSignal().name} `
  );

  public frameworkAsSignal = signal({
    name: 'Angular',
    releaseDate: '2010',
  });

  public frameworkAsProperty = {
    name: 'Angular',
    releaseDate: '2010',
  };

  constructor() {
    setTimeout(() => {
      // this.frameworkAsProperty.name = 'React';
      this.frameworkAsSignal.update((value) => ({
        ...value,
        name: 'React',
      }));

      console.log('Hecho');
    }, 3000);
  }
}
