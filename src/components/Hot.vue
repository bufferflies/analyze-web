<template>
  <div>
    <el-table
      :data="tableData"
      :span-method="objectSpan"
      style="width: 100%"
      border
    >
      <el-table-column prop="cmd" label="cmd" width="180" />
      <el-table-column prop="start" label="start" width="180" />
      <el-table-column prop="end" label="end" width="180" />
      <el-table-column prop="metrics" label="metrics" width="180" />
      <el-table-column prop="operator" label="operator" width="180" />
      <el-table-column prop="min" label="min" />
      <el-table-column prop="max" label="max" />
      <el-table-column prop="mean" label="mean" />
      <el-table-column prop="std" label="std" />
    </el-table>
    <v-chart class="chart" :option="option" />
  </div>
</template>

<script>
export default {
  name: "hot",

  mounted() {
    const id = this.$route.params.id;
    this.$http.get("/analyze/" + id).then((response) => {
      this.fillTable(response.data.metrics);
      this.fillCharts(response.data.table);
    });
  },
  methods: {
    fillTable(info) {
      var index = 0;
      var data = [];
      for (var i in info) {
        delete info[i].data;
        var arr = i.split("_");
        var o = {
          cmd: arr[0],
          metrics: arr.slice(2, arr.length - 1),
          operator: arr[arr.length - 1],
          start: info[i].start_ts,
          end: info[i].end_ts,
        };
        data[index] = Object.assign(info[i], o);
        index++;
      }
      this.tableData = data;
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
    objectSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex <= 2) {
        if (rowIndex % 4 == 0) {
          return {
            rowspan: 4,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
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
      tableData: [{}],
    };
  },
};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>