import * as $ from 'jquery';
import App from './app.ts';
import { Router } from 'director';

$(() => {
  App.init();
  new Router({
    '/:filter': (filter) => {
      App.filter = filter;
      App.render();
    }
  }).init('/all');
});
