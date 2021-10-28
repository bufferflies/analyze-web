import Vue from 'vue'
import App from './App.vue'
import router from './router'

// element import
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import axios from "axios";


import ECharts from 'vue-echarts'
import { use } from 'echarts/core'

import moment from 'moment'

import qs from  'qs'  



Vue.use(ElementUI);

Vue.prototype.$http=axios;
console.log("env",process.env.VUE_APP_URL)
axios.defaults.baseURL=process.env.VUE_APP_URL
Vue.config.productionTip = false


// import ECharts modules manually to reduce bundle size
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart,
  LineChart,
  PieChart,
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  LineChart
]);
Vue.component('v-chart', ECharts)

Vue.prototype.$moment = moment

Vue.prototype.$qs = qs
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
