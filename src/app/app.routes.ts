import { Routes } from '@angular/router';
import { Routes as RoutesConstants } from 'src/app/app.constants';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ArticleDetailsComponent } from './pages/article-details/article-details.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: RoutesConstants.PREFIX, pathMatch: 'full' },
  {
    path: RoutesConstants.PREFIX,
    component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: RoutesConstants.TIMELINE },
      { path: RoutesConstants.TIMELINE, component: HomeComponent },
      { path: RoutesConstants.MY_ARTICLE, component: ArticleDetailsComponent },
    ]
  },
  { path: RoutesConstants.WILDCARD, component: NotFoundComponent },

];
