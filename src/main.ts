import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Add Amplify imports
import { Amplify } from 'aws-amplify';
import amplifyconfig from '../src/amplifyconfiguration.json';

// Merge existing Amplify config with custom API configuration
const customConfig = {
  ...amplifyconfig,
  API: {
    REST: {
      categories: {
        endpoint: 'https://hc4mdt2ga4.execute-api.eu-central-1.amazonaws.com/dev',
        region: 'eu-central-1',
      },
    },

//     endpoints: [
//       {
//         name: 'categoriesAPI',
//         endpoint: 'https://hc4mdt2ga4.execute-api.eu-central-1.amazonaws.com/dev',
//         region: 'eu-central-1',
//       },
//     ],
  },
};

Amplify.configure(customConfig);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
