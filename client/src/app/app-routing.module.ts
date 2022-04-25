import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDrawingComponent } from './components/app/create-drawing/create-drawing.component';
import { MainNavComponent } from './components/app/guide/main-nav/main-nav.component';
import {MainPageComponent} from './components/app/main-page/main-page.component';
import { MenuComponent } from './components/app/start-menu/start-menu.component';
const routes: Routes = [
  {path: '', component: MenuComponent},
  {path: 'ZoneDessin', component: MainPageComponent},
  {path: 'Nouveau', component: CreateDrawingComponent},
  {path: 'Guide', component: MainNavComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
export const routingComponents = [MenuComponent, CreateDrawingComponent, MainPageComponent, MainNavComponent];
