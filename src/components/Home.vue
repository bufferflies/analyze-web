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
          <el-table-column prop="id" label="ID"> </el-table-column>
          <el-table-column
            prop="start_ts"
            label="create time"
          ></el-table-column>
          <el-table-column prop="config" label="config"> </el-table-column>
          <el-table-column prop="metrics" label="metrics"> </el-table-column>
          <el-table-column prop="workload" label="workload"> </el-table-column>
          <el-table-column prop="qps" label="target object"> </el-table-column>
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
          :total="20"
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
export default {
  name: "Home",

  mounted() {
    this.getAll();
    this.handlerMetrics();
  },

  methods: {
    handlerMetrics() {
      console.log("changed");
      var data = {};
      this.checkedMetrics.forEach((item) => {
        data[item] = this.echartTemplate;
        data[item].title.text = item;
        data[item].xAxis.data = Array.apply(null, {
          length: this.checkedMetricsSize,
        }).map(Number.call, Number);
        data[item].series[0].data = Array.apply(null, {
          length: this.checkedMetricsSize,
        }).map(Number.call, Number);
      });

      this.metricsData = data;
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
    getAll() {
      var param = {
        limit: this.pageSize,
        page: this.page,
        workload: this.checkedWorkload,
        version: this.checkedVersion,
      };
      this.$http
        .get("/analyze/getAll", {
          params: param,
        })
        .then((response) => {
          console.log(response);
        });
    },
  },
  data() {
    return {
      workloadOptions: ["tpcc", "sysbench"],
      checkedWorkload: "tpcc",
      metrics: ["qps", "cpu", "mem"],
      checkedMetrics: ["qps"],
      versions: ["v5.2", "v5.1"],
      checkedVersion: "v5.2",

      metricsSzie: [10, 50, 100, 500, 1000],
      checkedMetricsSize: 100,

      page: 2,
      pageSize: 10,
      workloads: [
        {
          id: "test",
          start_ts: "12343",
          config: "234",
          metrics: "aaa",
          workload: "sysbench",
          qps: "123",
        },
      ],
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