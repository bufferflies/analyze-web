<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="12">
      <el-row>
        <h3>
          name:
          <el-input
            type="textarea"
            autosize
            placeholder="请输入内容"
            v-model="name"
          >
          </el-input>
        </h3>
      </el-row>
      <div style="margin: 20px 0"></div>
      <h3>
        description
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入内容"
          v-model="description"
        >
        </el-input>
      </h3>
      <el-row>
        <el-button @click.native="cancel">cancal</el-button>
        <el-button type="primary" @click.native="submit">submit</el-button>
      </el-row>
    </el-col>

    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
</template>

<script>
export default {
  name: "project-new",

  methods: {
    cancel() {
      this.$router.push({ path: "/project/" });
    },
    submit() {
      this.$http
        .post("/project/new", null, {
          params: {
            name: this.name,
            description: this.description,
          },
        })
        .then((response) => {
          this.$router.push({ path: "/" });
        });
    },
  },
  data() {
    return {
      name: "",
      description: "",
    };
  },
};
</script>