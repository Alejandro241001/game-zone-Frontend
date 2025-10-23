import { bootstrapApplication, type BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// 1. Modifique la función 'bootstrap' para que acepte el argumento 'context'
const bootstrap = (context: BootstrapContext) =>
  // 2. Pase el 'context' como el TERCER argumento separado
  bootstrapApplication(AppComponent, config, context); 

export default bootstrap;
