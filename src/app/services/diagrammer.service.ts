import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DiagrammerService {
  public viewActionsFile = signal(false);
  public viewActionsDev = signal(false);

  public onChangeviewActionsFile(value: boolean): void {
    this.viewActionsFile.set(value);
  }
  public getViewActionsFile(): boolean {
    return this.viewActionsFile();
  }

  public onChangeviewActionsDev(value: boolean): void {
    this.viewActionsDev.set(value);
  }

  public getViewActionsDev(): boolean {
    return this.viewActionsDev();
  }
}
