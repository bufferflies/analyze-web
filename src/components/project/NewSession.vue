<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="16">
      <el-row>
        <el-input placeholder="enter name" v-model="name">
          <template slot="prepend">Name</template>
        </el-input>
      </el-row>
      <el-row style="margin: 20px 0">
        <el-input placeholder="enter description" v-model="description">
          <template slot="prepend">Description</template>
        </el-input>
      </el-row>
      <el-row style="margin: 20px 0">
        <el-input
          placeholder="enter pd address,like 127.0.0.1:2379"
          v-model="pdAddress"
        >
          <template slot="prepend">pd address</template>
        </el-input>
      </el-row>
      <el-row style="margin: 20px 0">
        <el-input
          placeholder="enter tidb address like localhost:4000"
          v-model="tidbAddress"
        >
          <template slot="prepend">tidb address</template>
        </el-input>
      </el-row>
      <el-row style="margin: 20px 0">
        <el-input
          placeholder="enter prom address,please write schema like http://localhost:9090"
          v-model="promAddress"
        >
          <template slot="prepend">prom address</template>
        </el-input>
      </el-row>
      <el-row style="margin: 20px 0">
        <el-input
          placeholder="enter grafana address,please write schema like http://localhost:3000"
          v-model="grafanaAddress"
        >
          <template slot="prepend">grafana address</template>
        </el-input>
      </el-row>
      <el-row style="margin: 20px 0">
        <el-input
          placeholder="enter grafana Authorization,like  Bearer eyJrIjoiZEZDNHh2NnYyMlg1enRPOGpmd1QyaGpKRmdUcUY3bloiLCJuIjoicmVncmVzc2lvbiIsImlkIjox11=="
          v-model="grafanaAuthorization"
        >
          <template slot="prepend">grafana Authorization</template>
        </el-input>
      </el-row>
      <div style="margin: 20px 0"></div>

      <el-transfer
        v-model="objects"
        filterable
        :props="{
          key: 'value',
          label: 'label',
        }"
        :data="metrics"
        :titles="['Source', 'Target']"
        min-width="400px"
      >
        <div class="transfer-footer" slot="left-footer" size="small">
          <el-input v-model="newMetrics"></el-input>
          <el-button @click="addMetrics"> Add </el-button>
        </div>
      </el-transfer>

      <div style="margin: 20px 0"></div>
      <h3>
        target Objects
        <el-select v-model="targetObject" filterable>
          <el-option
            v-for="item in objects"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </h3>
      <el-row>
        <el-button @click.native="cancel">cancal</el-button>
        <el-button type="primary" @click.native="save">save</el-button>
      </el-row>
    </el-col>
    <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
</template>

<script>
export default {
  name: "session-new",
  mounted() {
    this.session();
  },
  methods: {
    addMetrics() {
      if (!this.newMetrics) {
        alert("new metrics is null");
        return;
      }
      var arr = this.newMetrics.split(",");
      arr.forEach((item) => {
        var obj = { value: item, label: item };
        if (this.metrics.filter((m) => m.value === item).length > 0) {
          return true;
        }
        this.metrics.push(obj);
      });
    },
    session() {
      var session_id = this.$route.params.session_id;
      if (!session_id) {
        return;
      }
      this.$http.get("/project/session/" + session_id, {}).then((response) => {
        if (response.status != 200) {
          console.log(response);
          return;
        }
        var data = response.data;
        this.name = data.name;
        this.description = data.description;
        this.objects = data.object.split(",");
        this.targetObject = data.target_object;
        this.pdAddress = data.pd_address;
        this.tidbAddress = data.tidb_address;
        this.promAddress = data.prom_address;
        this.grafanaAddress = data.grafana_address;
        this.grafanaAuthorization = data.grafana_authorization;
      });
    },
    save() {
      var data = {
        id: parseInt(this.$route.params.session_id, 10),
        pid: parseInt(this.$route.params.project_id, 10),
        name: this.name,
        description: this.description,
        object: this.objects.join(","),
        target_object: this.targetObject,
        pd_address: this.pdAddress,
        tidb_address: this.tidbAddress,
        grafana_address: this.grafanaAddress,
        prom_address: this.promAddress,
        grafana_authorization: this.grafanaAuthorization,
      };
      this.$http.post("/project/session/new", data).then(() => {
        this.cancel();
      });
    },
    cancel() {
      const id = this.$route.params.project_id;
      this.$router.push({ path: "/session/" + id });
    },
  },
  data() {
    return {
      name: "",
      description: "",
      objects: [],
      targetObject: "",
      pdAddress: "",
      tidbAddress: "",
      promAddress: "",
      grafanaAddress: "",
      grafanaAuthorization: "",
      newMetrics: "",

      metrics: [
        {
          value: "tikv_cpu_avg",
          label: "tikv_cpu_avg",
        },
        {
          value: "tikv_cpu_std",
          label: "tikv_cpu_std",
        },
        {
          value: "tikv_cpu_std/avg",
          label: "tikv_cpu_std/avg",
        },
        {
          value: "tidb_command_per_second",
          label: "tidb_command_per_second",
        },
        {
          value: "tidb_duration_P80",
          label: "tidb_duration_P80",
        },
        {
          value: "tidb_duration_P999",
          label: "tidb_duration_P999",
        },
        {
          value: "store_write_query_avg",
          label: "store_write_query_avg",
        },
        {
          value: "store_write_query_std",
          label: "store_write_query_std",
        },{
          value: "store_write_rate_bytes_avg",
          label: "store_write_rate_bytes_avg",
        },
        {
          value: "store_write_rate_bytes_std",
          label: "store_write_rate_bytes_std",
        },
        {
          value: "store_write_rate_bytes_std/avg",
          label: "store_write_rate_bytes_std/avg",
        },{
          value: "store_write_rate_keys_avg",
          label: "store_write_rate_keys_avg",
        },
        {
          value: "store_write_rate_keys_std",
          label: "store_write_rate_keys_std",
        },
        {
          value: "store_write_rate_keys_std/avg",
          label: "store_write_rate_keys_std/avg",
        },{
          value: "store_read_query_avg",
          label: "store_read_query_avg",
        },
        {
          value: "store_read_query_std",
          label: "store_read_query_std",
        },{
          value: "store_read_rate_bytes_avg",
          label: "store_read_rate_bytes_avg",
        },
        {
          value: "store_read_rate_bytes_std",
          label: "store_read_rate_bytes_std",
        },
        {
          value: "store_read_rate_bytes_std/avg",
          label: "store_read_rate_bytes_std/avg",
        },{
          value: "store_read_rate_keys_avg",
          label: "store_read_rate_keys_avg",
        },
        {
          value: "store_read_rate_keys_std",
          label: "store_read_rate_keys_std",
        },
        {
          value: "store_read_rate_keys_std/avg",
          label: "store_read_rate_keys_std/avg",
        },
      ],
    };
  },
};
</script>

<style >
.el-transfer-panel .el-transfer-panel__footer {
  height: 80px;
}
.el-transfer-panel {
  min-width: 400px;
}
</style>