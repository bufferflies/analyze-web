<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="12">
      <div>
        <el-checkbox-group v-model="checkloads">
          <el-checkbox
            v-for="workload in workloads"
            :label="workload.name"
            :key="workload.name"
            >{{ workload.name }}</el-checkbox
          >
        </el-checkbox-group>
        <el-table :data="metrics" border>
          <el-table-column prop="name" label="name" />
          <el-table-column
            v-for="{ name } in workloads"
            :prop="name"
            :key="name"
            :label="name"
          >
          </el-table-column>
        </el-table>
        <!-- <v-chart class="chart" :option="option" /> -->
      </div>
    </el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
</template>

<script>
export default {
  name: "hot",

  mounted() {
    const id = this.$route.params.id;
    this.$http.get("/analyze/" + id).then((response) => {
      console.log(response);
      this.fillTable(response.data);
    });
  },
  methods: {
    fillTable(info) {
      var times = ["start_ts", "end_ts"];
      var format = "YYYY-MM-DD HH:mm";
      if (info.length < 0) {
        return;
      }
      var workloads = [];
      var checkloads = [];
      info.forEach((value, item) => {
        Object.assign(value, value.metrics);
        delete value.metrics;
        workloads.push({ name: value.workload });
        checkloads.push(value.workload);
      });
      var data = [];
      for (const [key] of Object.entries(info[0])) {
        var obj = { name: key };
        info.forEach((value, item) => {
          var v = value[key];
          console.log(key);
          console.log(times);
          if (times.includes(key)) {
            console.log(v);
            v = this.moment(parseInt(v, 10) * 1000).format(format);
          }
          obj[value.workload] = v;
        });

        data.push(obj);
      }
      this.metrics = data;
      this.workloads = workloads;
      this.checkloads = checkloads;
    },
    fillCharts(table) {
      var length = 0;
      var legend = [];
      var index = 0;
      for (var i in table) {
        if (table[i].length > length) {
          length = table[i].length;
        }
        legend[index] = i;
        this.option.series[index] = {
          name: i,
          data: table[i],
          type: "line",
        };
        index++;
      }
      var x = [];
      for (var i = 0; i < length; i++) {
        x[i] = i;
      }
      this.option.xAxis.data = x;
      this.option.legend.data = legend;
    },
  },
  data() {
    return {
      info: "null",

      option: {
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
        series: [],
      },
      checkloads: ["test"],
      workloads: [{ name: "test" }, { name: "111" }],
      metrics: [],
    };
  },
};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>