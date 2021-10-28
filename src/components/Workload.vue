<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="6">
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
      <div>
        <h2>workload</h2>
        <el-select
          v-model="checkedWorkload"
          placeholder="select workload"
          @change="handleCheckWorkload"
          filterable
        >
          <el-option
            v-for="item in workloadOptions"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
        <el-button type="danger" @click="removeWorkLoad()">Delete</el-button>
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
     
    </el-col>
    <el-col :span="12">
      <v-chart
        class="chart"
        v-for="item in checkedMetrics"
        :option="metricsData[item]"
        :key="item"
        height="100px"
      />
      <div>
        <el-table :data="workloads" style="width: 100%" align="center" border>
          <el-table-column prop="ID" label="Id"> </el-table-column>
          <el-table-column prop="Name" label="Name"> </el-table-column>
          <el-table-column prop="BenchName" label="BenchName">
          </el-table-column>
          <el-table-column prop="Start" label="Start "></el-table-column>
          <el-table-column prop="End" label="End"> </el-table-column>
          <el-table-column prop="Config" label="Config"> </el-table-column>
          <el-table-column prop="TargetObject" label="target_object">
          </el-table-column>

          <el-table-column fixed="right" label="operate">
            <template slot-scope="scope">
              <el-button @click="detail(scope.row)" type="text" size="small">
                detail
              </el-button>
              <el-button @click="remove(scope.row)" type="text" size="small">
                delete
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
      
    </el-col>
    <el-col :span="6"><div></div></el-col>
  </el-row>
</template>

<script>
import qs from "qs";
export default {
  name: "Workload",
  mounted() {
    this.session();
  },

  methods: {
    session() {
      const id = this.$route.params.session_id;
      this.$http.get("/project/session/" + id, {}).then((response) => {
        if (response.status != 200) {
          console.log(response);
          return;
        }
        var data = response.data;
        this.metrics = data.object.split(",");
        this.checkedMetrics=["tidb_command_per_second","tikv_cpu_avg","tikv_cpu_std","tikv_cpu_std/avg"];
        this.refreshWorkloadName();
      });
    },
    handleCheckWorkload() {
      this.refreshWorkloads();
      this.refreshMetrics();
    },
    handlerMetrics() {
      this.refreshMetrics();
    },

    refreshWorkloadName() {
      const id = this.$route.params.session_id;
      this.$http.get("/analyze/config/" + id).then((response) => {
        if (response.status != 200 || response.data.length == 0) {
          console.log(response);
          return;
        }
        var data = response.data;
        var names = [];
        data.forEach((item) => {
          names.push(item.Name);
        });
        this.workloadOptions = names;
        this.checkedWorkload = this.workloadOptions[0];
        this.refreshWorkloads();
        this.refreshMetrics();
      });
    },
    refreshMetrics() {
      var params = {
        workload: this.checkedWorkload,
        metrics: this.checkedMetrics,
        limit: this.checkedMetricsSize,
      };
      const id = this.$route.params.session_id;
      this.$http
        .get("/analyze/metrics/" + id, {
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
          var body = response.data;
          var data = {};

          for (const [key, value] of Object.entries(body)) {
            if (value.length == 0) {
              continue;
            }

            var echart = JSON.parse(JSON.stringify(this.echartTemplate));
            echart.title.text = key;
            echart.xAxis.data = value.map((v) => v.Start);
            echart.series[0].data = value.map((v) => v.Value);
            echart.series[0].name = key;
            data[key] = echart;
          }
          this.metricsData = data;
        });
    },
    refreshWorkloads() {
      const id = this.$route.params.session_id;
      var param = {
        size: this.pageSize,
        page: this.page,
        workload: this.checkedWorkload,
        version: this.checkedVersion,
      };
      this.$http
        .get("/analyze/workload/" + id, {
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
        });
    },
    detail(row) {
      const id = this.$route.params.session_id;
      this.$router.push({ path: "/hot/" + id + "/" + row.BenchName });
    },
    removeWorkLoad() {
      const id = this.$route.params.session_id;
      this.$http
        .delete("/analyze/session/" + id, {
          params: { workload_name: this.checkedWorkload },
        })
        .then((response) => {
          if (response.status != 200) {
            return;
          }

          this.refreshWorkloads();
        });
    },
    remove(row) {
      this.$http.delete("/analyze/workload/" + row.ID).then((response) => {
        if (response.status != 200) {
          return;
        }
        this.refreshWorkloads();
      });
    },
    handlerSize(size) {
      this.pageSize = size;
      this.refreshWorkloads();
    },
    handlerPage(page) {
      this.page = page;
      this.refreshWorkloads();
    },
  },
  data() {
    return {
      workloadOptions: ["read_write", "sysbench"],
      checkedWorkload: "read_write",
      metrics: [],
      checkedMetrics: [],
      targetMetrics: "cpu",
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
.el-checkbox-width {
  width: 100px;
  height: 25px;
}
</style>>