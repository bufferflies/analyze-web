<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="6"
      ><div class="grid-content bg-purple">
        <el-checkbox-group v-model="checkloads">
          <el-checkbox
            v-for="workload in workloads"
            :label="workload.name"
            :key="workload.name"
            >{{ workload.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div></el-col
    >
    <el-col :span="16">
      <div>
        <el-table :data="metrics" border>
          <el-table-column prop="name" label="name" />
          <el-table-column
            v-for="{ name } in workloads"
            :prop="name"
            :key="name"
            :label="name"
          >
            <!-- <template slot-scope="scope">
              <div v-if="scope.row.name == 'Start'">
                <el-link> {{ scope.row["read_write-no-schedule"] }}</el-link>
              </div>
              <div v-else-if="scope.row.name != 'Start'">
                {{ scope.row["name"] }}
              </div>
            </template> -->
          </el-table-column>
        </el-table>
      </div>
    </el-col>
    <el-col :span="2"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
</template>

<script>
export default {
  name: "hot",

  mounted() {
    this.getSession();
  },
  methods: {
    getSession() {
      const id = this.$route.params.session_id;
      this.$http.get("/project/session/" + id, {}).then((response) => {
        if (response.status != 200) {
          console.log(response);
          return;
        }
        this.session = response.data;
        this.fillTable();
      });
    },
    fillTable() {
      const session_id = this.$route.params.session_id;
      const name = this.$route.params.name;
      this.$http
        .get("/analyze/bench/" + session_id + "/" + name)
        .then((response) => {
          var body = response.data;
          if (body.length < 0) {
            return;
          }
          var workloads = [];
          var checkloads = [];
          body.forEach((value) => {
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

          for (const [key] of Object.entries(body[0])) {
            if (this.excludeName.includes(key)) {
              continue;
            }
            var obj = { name: key };
            body.forEach((value) => {
              obj[value.Name] = value[key];
            });

            data.push(obj);
          }
          this.metrics = data;
          this.workloads = workloads;
          this.checkloads = checkloads;
        });
    },
  },
  data() {
    return {
      session: null,
      checkloads: ["test"],
      workloads: [{ name: "test" }, { name: "111" }],
      metrics: [],
      excludeName: ["BenchName", "SessionID", "Version"],
    };
  },
};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>