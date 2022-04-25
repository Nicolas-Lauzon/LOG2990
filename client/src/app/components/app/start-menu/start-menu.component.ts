import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AutomaticSaveService } from 'src/app/services/automatic-save-service/automatic-save.service';
import { DataService } from 'src/app/services/data-service/data.service';

@Component({
  selector: 'app-start-menu',
  templateUrl: './start-menu.component.html',
  styleUrls: ['./start-menu.component.scss']
})

export class MenuComponent {
  menu:
  {
    nom: string;
    path: string;
    icon: string;
  }[] =
  [{ nom: 'Guide', path: 'Guide', icon: 'help' },
    { nom: 'Galerie', path: 'Galerie', icon: 'image_search' },
    { nom: 'Continuer', path: 'ZoneDessin', icon: 'arrow_forward_ios' },
    { nom: 'Nouveau', path: 'Nouveau', icon: 'note_add' }];

  title: string;
  newForm: boolean;
  draw: string;
  exitGallery: boolean;
  automaticSave: AutomaticSaveService;

  constructor(private router: Router, private dataService: DataService, automaticSave: AutomaticSaveService) {
    this.exitGallery = false;
    this.draw = '';
    this.newForm = false;
    this.title = 'PolyDessin';
    this.dataService.drawCurrent.subscribe((message) => (this.draw = message));
    this.automaticSave = automaticSave;
  }

  onClick(menu: string): void {
    if (menu === 'Nouveau') {
      this.newForm = !this.newForm;
      this.exitGallery = false;
    } else if (menu === 'Galerie') {
      this.exitGallery = !this.exitGallery;
      this.newForm = false;
    } else {
      this.router.navigate(['/' + menu]);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): boolean {
    const interrupt = (event.ctrlKey && event.key === 'o') || (event.ctrlKey && event.key === 'g') ;

    if (!interrupt) {
      return true;
    }

    event.preventDefault();
    if (event.ctrlKey && event.key === 'o' && !this.exitGallery ) {
      this.newForm = !this.newForm;
      this.exitGallery = false;
    }

    if (event.ctrlKey && event.key === 'g') {
      this.exitGallery = !this.exitGallery;
      this.newForm = false;
    }
    return true;

  }
}
