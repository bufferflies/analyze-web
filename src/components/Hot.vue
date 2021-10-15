<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="4"
      ><div class="grid-content bg-purple">
        <el-checkbox v-model="checkAll" @change="handleCheckAll">
          all
        </el-checkbox>
        <el-checkbox-group v-model="checkloads">
          <el-row>
            <el-checkbox
              v-for="workload in workloads"
              :label="workload.name"
              :key="workload.name"
              @change="handlerChanged"
            >
              <template slot-scope="scope">
                <h2>
                  {{ scope.row }}
                </h2>
              </template>
            </el-checkbox>
          </el-row>
        </el-checkbox-group>
      </div></el-col
    >
    <el-col :span="18">
      <div>
        <el-table
          :data="metrics"
          border
          max-height="1000"
          :default-sort="{ prop: 'name', order: 'ascending' }"
          :cell-style="cellStyle"
        >
          <el-table-column fixed sortable prop="name" label="name" />
          <el-table-column
            v-for="{ name } in showloads"
            :prop="name"
            :key="name"
            :label="name"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.name == 'Start'">
                <el-link type="primary" :href="link">
                  {{ scope.row[scope.column.property] }}
                </el-link>
              </div>
              <div
                v-else-if="
                  scope.row.name == 'Cmd' || scope.row.name == 'Config'
                "
              >
                <el-popover
                  placement="bottom"
                  title="cmd"
                  trigger="click"
                  width="200"
                  :content="scope.row[scope.column.property]"
                >
                  <el-button
                    type="info"
                    icon="el-icon-message"
                    circle
                    slot="reference"
                    size="mini"
                    >detail</el-button
                  >
                </el-popover>
              </div>
              <div
                v-else-if="scope.row.name == 'End' || scope.row.name == 'ID'"
              >
                {{ scope.row[scope.column.property] }}
              </div>
              <div v-else>
                {{ scope.row[scope.column.property] }}
                <nobr
                  style="color: red"
                  v-if="!scope.column.property.endsWith('no-schedule')"
                >
                  ({{ scope.row[scope.column.property + "-delta"] }})
                </nobr>
              </div>
            </template>
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
    handleCheckAll() {
      if (this.checkAll) {
        this.checkloads = this.workloads.map((w) => w.name);
      } else {
        this.checkloads = [];
      }
      this.handlerChanged();
    },
    handlerChanged() {
      var showloads = this.workloads.filter((metric) =>
        this.checkloads.includes(metric.name)
      );
      this.showloads = showloads;
    },
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
          // fill data
          for (const [key] of Object.entries(body[0])) {
            if (this.excludeName.includes(key)) {
              continue;
            }
            var obj = { name: key };

            body.forEach((value) => {
              obj[value.Name] = value[key];
            });
            if (!this.noCompareMetrics.includes(key)) {
              body.forEach((value) => {
                if (!value.Name.endsWith("no-schedule")) {
                  var base = parseFloat(obj[value.Name + "-no-schedule"]);
                  if (base != 0) {
                    var delta = ((value[key] - base) / base).toFixed(2);
                    obj[value.Name + "-delta"] = delta;
                  }
                }
                obj[value.Name] = parseFloat(value[key]).toFixed(2);
              });
            }

            data.push(obj);
          }

          this.metrics = data;
          this.workloads = workloads;
          this.checkloads = checkloads;
          this.showloads = workloads;
        });
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (!column.property.endsWith("no-schedule") && columnIndex !== 0) {
        return "background:#f0f9eb";
      }
    },
  },
  data() {
    return {
      session: null,
      checkloads: ["test"],
      workloads: [],
      showloads: [],
      metrics: [],
      excludeName: ["BenchName", "SessionID", "Version", "Name"],
      noCompareMetrics: ["Cmd", "Config", "End", "ID", "Start"],
      checkAll: true,
    };
  },
  computed: {
    link: function () {
      var url = this.session.grafana_address;
      return url;
    },
  },
};
</script>

<style >
.el-checkbox,
.el-checkbox__input {
  display: flex;
  position: relative;
  white-space: nowrap;
  flex-direction: row;
  align-items: flex-end;
}
.redClass {
  background: red;
}
</style>