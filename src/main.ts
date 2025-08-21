import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Add Amplify imports
import { Amplify } from 'aws-amplify';
import { environment } from './environments/environment';
// import amplifyconfig from '../src/amplifyconfiguration.json';

// Amplify.configure(amplifyconfig);


Amplify.configure({
  Auth: {
    Cognito:{
      userPoolId: environment.userPoolId,
      userPoolClientId: environment.userPoolClientId,  
    }
  }
   
});


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
