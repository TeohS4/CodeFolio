import { Routes } from '@angular/router';
import { WeatherComponent } from './pages/weather/weather';
import { MovieComponent } from './pages/movie/movie-list/movie';
import { HomeComponent } from './pages/home/home';
import { TaskComponent } from './pages/task/task';
import { WatchListComponent } from './pages/movie/watch-list/watch-list';
import { ContactUsComponent } from './pages/contact-us/contact-us';
import { NewsComponent } from './pages/news/news-list/news';
import { BookmarkComponent } from './pages/news/bookmark/bookmark';
import { EmployeeComponent } from './pages/employee/employee';
import { LoginComponent } from './pages/auth/login/login';
import { MainLayout } from './main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';
import { Sidebar } from './shared/components/sidebar/sidebar';
import { ProductComponent } from './pages/erp/product/product';
import { OrderComponent } from './pages/erp/order/order';
import { CustomerComponent } from './pages/erp/customer/customer';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: Sidebar,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'weather', component: WeatherComponent },
      { path: 'movie', component: MovieComponent },
      { path: 'task', component: TaskComponent },
      { path: 'watch-list', component: WatchListComponent },
      { path: 'contact-us', component: ContactUsComponent },
      { path: 'news', component: NewsComponent },
      { path: 'bookmark', component: BookmarkComponent },
      { path: 'employee', component: EmployeeComponent },
      { path: 'product', component: ProductComponent },
      { path: 'order', component: OrderComponent },
      { path: 'customer', component: CustomerComponent },
    ]
  },

  { path: '**', redirectTo: 'login' }
];