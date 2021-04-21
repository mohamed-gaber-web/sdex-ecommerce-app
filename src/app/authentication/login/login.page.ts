import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { emailValidator, matchingPasswords } from '../../../theme/app-validators';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AuthService } from '../auth.service';
import { LoginCustomer } from 'src/app/shared/models/customer-login';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoading: boolean = false;
  hide: boolean = true;
  returnUrl: string;
  loginUser: LoginCustomer;
  subs: Subscription[] = [];
  loginCredentials: LoginCustomer;

  loginFormErrors = {
    Email: '',
    Password: '',
  };

  loginValidationMessages = {
    Email: {
      required: 'Email field is required',
      invalidEmail: 'Email field must be a valid email',
    },
    Password: {
      required: 'Password field is required',
    },
  };

  constructor(
    public formBuilder: FormBuilder, 
    public router:Router, 
    public toastController: ToastController,
    public route: ActivatedRoute,
    public storageService: StorageService,
    public translate: TranslateService,
    public auth: AuthService) {}



  ngOnInit() {
    
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/tabs/tab1';
    this.loginCredentials = new LoginCustomer();
    this.buildLoginForm();

  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      Email: ['', Validators.compose([Validators.required, emailValidator])],
      Password: ['', Validators.required],
    });
    this.loginForm.valueChanges.subscribe((data) => this.validateLoginForm());
  }

  validateLoginForm(isSubmitting = false) {
    for (const field of Object.keys(this.loginFormErrors)) {
      this.loginForm[field] = '';

      const input = this.loginForm.get(field) as FormControl;
      if (input.invalid && (input.dirty || isSubmitting)) {
        for (const error of Object.keys(input.errors)) {
          this.loginForm[field] = this.loginValidationMessages[field][error];
        }
      }
    }
  }

  public onLoginFormSubmit(values): void {
    this.validateLoginForm(true);
    if (this.loginForm.valid) {
      this.isLoading = true;
      Object.assign(this.loginCredentials, this.loginForm.value);
      this.auth.signInUser(this.loginCredentials).subscribe(
        async (response) => {
          
          if(response['success'] === true) {
            
            this.storageService.setAccessToken(response['result']);
            this.storageService.setExpiresIn(
              new Date(response['.expires']).getTime() / 1000 // .expires
            );
            // this.signInService.IsLoggedIn();
           var toast = await this.toastController.create({
             message: "You signed in successfully!",
             duration: 2000,
             color:"success"
           });
           toast.present();
           this.router.navigateByUrl(this.returnUrl);
          } else {
            var toast = await this.toastController.create({
              message: response['arrayMessage'][0],
              duration: 2000,
              color:"danger"
            });
            toast.present();
            this.router.navigate(['/'])
          }
        },
        (error) => {
          Object.keys(error).forEach(async (key) => {
            var toast = await this.toastController.create({
              message:error[key][0],
              duration: 2000,
              color:"danger"
            });
            toast.present();

          });

          this.loginForm.reset();
          this.isLoading = false;
        },
        () => (this.isLoading = false)
      );
    }
  }


  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

}
