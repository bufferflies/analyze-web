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
    const session_id = this.$route.params.session_id;
    const name = this.$route.params.name;
    this.$http
      .get("/analyze/bench/" + session_id + "/" + name)
      .then((response) => {
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
      info.forEach((value) => {
        var dict = {};
        value.Metrics.forEach((item) => {
          dict[item.Key] = item.Value;
        });
        Object.assign(value, dict);
        delete value.Metrics;
        var obj = { name: value.Name };
        workloads.push(obj);
        checkloads.push(value.Name);
      });
      var data = [];

      for (const [key] of Object.entries(info[0])) {
        var obj = { name: key };
        info.forEach((value) => {
          obj[value.Name] = value[key];
        });

        data.push(obj);
      }
      this.metrics = data;
      this.workloads = workloads;
      this.checkloads = checkloads;
    },
  },
  data() {
    return {
      info: "null",
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