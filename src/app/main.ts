import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'web-animations-js/web-animations.min';
import './polyfills.ts';
import 'rxjs/add/operator/toPromise';

import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
