/*=========================================================================================
  File Name: rapidSoftFilter.js
  Description: Filtros usados no app
==========================================================================================*/

import Vue from 'vue'
import moment from 'moment'


Vue.filter('formatDateTime', function(value) {
    if (value) {
      return moment(new Date(value)).format('DD/MM/YYYY hh:mm');
    }
});

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(new Date(value)).format('DD/MM/YYYY');
  }
})
