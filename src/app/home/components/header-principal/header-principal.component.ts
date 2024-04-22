import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeService } from '../../../services/home.service';

@Component({
  selector: 'app-header-principal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, DatePipe],
  templateUrl: './header-principal.component.html',
  styleUrl: './header-principal.component.css',
})
export class HeaderPrincipalComponent implements OnInit {
  public serviceHome = inject(HomeService);

  public infoDate = signal<Date>(new Date());

  ngOnInit() {
    setInterval(() => this.infoDate.update(() => new Date()), 1000);
  }

  public changeViewInfo() {
    this.serviceHome.onChangeviewActions();
  }
}
