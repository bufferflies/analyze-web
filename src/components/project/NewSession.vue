<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="16">
      <el-input
        type="textarea"
        autosize
        placeholder="enter name"
        v-model="name"
      >
      </el-input>

      <div style="margin: 20px 0"></div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        placeholder="enter description"
        v-model="description"
      >
      </el-input>
      <div style="margin: 20px 0"></div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        placeholder="enter pd Address,like localhost:2379"
        v-model="pdAddress"
      >
      </el-input>
      <div style="margin: 20px 0"></div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        placeholder="enter tidb Address like localhost:4000"
        v-model="tidbAddress"
      >
      </el-input>
      <div style="margin: 20px 0"></div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        placeholder="enter prom Address,please write schema like http://localhost:9090"
        v-model="promAddress"
      >
      </el-input>
      <div style="margin: 20px 0"></div>

      <el-transfer
        v-model="objects"
        :props="{
          key: 'value',
          label: 'label',
        }"
        :data="metrics"
        :titles="['Source', 'Target']"
        style="text-align: left; display: inline-block"
      >
      </el-transfer>

      <div style="margin: 20px 0"></div>
      <h3>
        target Objects
        <el-select v-model="targetObject">
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
import qs from "qs";
export default {
  name: "session-new",
  mounted() {
    this.session();
  },
  methods: {
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
      });
    },
    save() {
      var data = {
        id: parseInt(this.$route.params.session_id),
        pid: parseInt(this.$route.params.project_id, 10),
        name: this.name,
        description: this.description,
        object: this.objects.join(","),
        target_object: this.targetObject,

        pd_address: this.pdAddress,
        tidb_address: this.tidbAddress,
        prom_address: this.promAddress,
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
      metrics: [
        {
          value: "tikv_cpu_mean_max",
          label: "tikv_cpu_mean_max",
        },
        {
          value: "tikv_read_mean_max",
          label: "tikv_read_mean_max",
        },
        {
          value: "tikv_read_std_min",
          label: "tikv_read_std_min",
        },
        {
          value: "tikv_read_mean_min",
          label: "tikv_read_mean_min",
        },
        {
          value: "tikv_cpu_std_max",
          label: "tikv_cpu_std_max",
        },
        {
          value: "tikv_cpu_mean_mean",
          label: "tikv_cpu_mean_mean",
        },
        {
          value: "tikv_cpu_std_min",
          label: "tikv_cpu_std_min",
        },
        {
          value: "tikv_read_std_std",
          label: "tikv_read_std_std",
        },
      ],
    };
  },
};
</script>