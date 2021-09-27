<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="16">
      <h3>
        name
        <el-input
          type="textarea"
          autosize
          placeholder="enter name"
          v-model="name"
        >
        </el-input>
      </h3>
      <div style="margin: 20px 0"></div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        placeholder="enter objects"
        v-model="description"
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
        <el-button type="primary" @click.native="submit">submit</el-button>
      </el-row>
    </el-col>
    <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
</template>

<script>
import qs from "qs";
export default {
  name: "session-new",

  methods: {
    submit() {
      this.$http
        .post("/project/session/new", null, {
          params: {
            name: this.name,
            description: this.description,
            objects: this.objects,
            target_object: this.targetObject,
            project_id: this.$route.params.project_id,
          },
          paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
        })
        .then((response) => {
          this.$router.push({ path: "/project" });
        });
      const id = this.$route.params.project_id;
      this.$router.push({ path: "/session/" + id });
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