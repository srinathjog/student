import 'zone.js/node';

import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';


export function bootstrap(context: any) {
	return bootstrapApplication(App, config, context);
}

export default bootstrap;
