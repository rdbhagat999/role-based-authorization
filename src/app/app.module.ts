import { NgModule, VERSION } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '@env/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorInterceptor, FakeBackendInterceptor, JwtInterceptor } from '@helpers/index';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    console.log(`
    ENV: ${environment.production ? 'PRODUCTION' : 'DEVELOPMENT'}
    NG_VERSION: ${VERSION.full}
    `);
  }
}
