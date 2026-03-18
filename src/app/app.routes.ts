import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PlansComponent } from './components/plans/plans.component';
import { BmiCalculatorComponent } from './components/bmi-calculator/bmi-calculator.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ContactComponent } from './components/contact/contact.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { PaymentComponent } from './components/payment/payment.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'plans', component: PlansComponent },
  { path: 'bmi', component: BmiCalculatorComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'order-details', component: OrderDetailsComponent },
  { path: 'payment/:subscriptionId', component: PaymentComponent },
  { path: '**', redirectTo: '' }
];
