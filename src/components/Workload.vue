<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="6">
      <div>
        <h2>workload</h2>
        <el-select v-model="checkedWorkload" placeholder="select workload">
          <el-option
            v-for="item in workloadOptions"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        <h2>version</h2>
        <el-select v-model="checkedVersion" placeholder="select version">
          <el-option
            v-for="version in versions"
            :key="version"
            :label="version"
            :value="version"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        <h2>metrics</h2>
        <el-checkbox-group
          v-model="checkedMetrics"
          border
          @change="handlerMetrics"
        >
          <el-checkbox
            v-for="item in metrics"
            :label="item"
            :key="item"
            style="display: block"
          >
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </el-col>
    <el-col :span="12">
      <div>
        <el-table :data="workloads" style="width: 100%" align="center" border>
          <el-table-column prop="ID" label="ID"> </el-table-column>
          <el-table-column prop="Name" label="Name"> </el-table-column>
          <el-table-column prop="Start" label="Start "></el-table-column>
          <el-table-column prop="End" label="End"> </el-table-column>
          <el-table-column prop="Config" label="Config"> </el-table-column>
          <el-table-column prop="qps" label="qps"> </el-table-column>
          <el-table-column fixed="right" label="operate">
            <template slot-scope="scope">
              <el-button @click="detail(scope.row)" type="text" size="small">
                detail
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handlerSize"
          @current-change="handlerPage"
          :current-page="1"
          :page-sizes="[10, 25, 100, 200]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <div>
        <h4>
          show the last
          <el-select v-model="checkedMetricsSize" @change="handlerMetrics">
            <el-option
              v-for="size in metricsSzie"
              :key="size"
              :label="size"
              :value="size"
            >
              {{ size }}
            </el-option>
          </el-select>
          result
        </h4>
      </div>
      <v-chart
        class="chart"
        v-for="item in checkedMetrics"
        :option="metricsData[item]"
        :key="item"
        height="100px"
      />
    </el-col>
    <el-col :span="6"><div></div></el-col>
  </el-row>
</template>

<script>
import qs from "qs";
export default {
  name: "Workload",
  mounted() {
    this.config();
    this.getAll();
    this.handlerMetrics();
  },

  methods: {
    config() {
      const id = this.$route.params.session_id;
      console.log(id);
      this.$http.get("/project/session/" + id, {}).then((response) => {
        if (response.status != 200) {
          console.log(response);
          return;
        }
      });
    },
    handlerMetrics(body) {
      var params = {
        workload: this.checkedWorkload,
        metrics: this.checkedMetrics,
        limit: this.checkedMetricsSize,
      };
      this.$http
        .get("/analyze/getMetrics", {
          params: params,
          paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
        })
        .then((response) => {
          if (response.status != 200) {
            console.log(response);
            return;
          }
          body = response.data;
          var data = {};

          for (const [key, value] of Object.entries(body)) {
            if (value.length == 0) {
              continue;
            }
            data[key] = this.echartTemplate;
            data[key].title.text = key;
            data[key].xAxis.data = value.map((v) => v.Start);
            data[key].series[0].data = value.map((v) => v.Value);
          }
          this.metricsData = data;
        });
    },
    getAll() {
      var param = {
        size: this.pageSize,
        page: this.page,
        workload: this.checkedWorkload,
        version: this.checkedVersion,
      };
      this.$http
        .get("/analyze/getAll", {
          params: param,
          paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
        })
        .then((response) => {
          if (response.status != 200) {
            return;
          }
          var body = response.data;
          this.total = body.count;
          this.workloads = body.workloads;
          console.log(response);
        });
    },
    detail(row) {
      console.log(row);
      this.$router.push({ path: "/hot/" + row.id });
    },
    handlerSize(size) {
      this.pageSize = size;
      this.getAll();
    },
    handlerPage(page) {
      this.page = page;
      this.getAll();
    },
  },
  data() {
    return {
      workloadOptions: ["read_write", "sysbench"],
      checkedWorkload: "read_write",
      metrics: ["tikv_read_std_max", "tikv_read_std_mean", "mem"],
      checkedMetrics: ["tikv_read_std_max", "cpu"],
      versions: ["v5.2", "v5.1"],
      checkedVersion: "v5.2",

      metricsSzie: [10, 50, 100, 500, 1000],
      checkedMetricsSize: 100,

      page: 1,
      pageSize: 10,
      total: 10,
      workloads: [],
      metricsData: {},
      echartTemplate: {
        title: {
          text: "test",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [],
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "line",
            smooth: true,
            name: "qps",
          },
        ],
      },
    };
  },
};
</script>


<style >
x-vue-echarts {
  width: 100%;
  height: 400px;
  display: block;
}
</style>>