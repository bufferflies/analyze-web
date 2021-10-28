<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="12">
      <el-table :data="projects" style="width: 100%" align="center" border>
        <el-table-column prop="ID" label="ID"> </el-table-column>
        <el-table-column prop="Name" label="Name"> </el-table-column>
        <el-table-column
          prop="Description"
          label="Description "
        ></el-table-column>
        <el-table-column fixed="right" label="operate">
          <template slot-scope="scope">
            <el-button @click="detail(scope.row)" type="text" size="small">
              detail
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-button @click.native="create">delete</el-button>
        <el-button type="primary" @click.native="create">create</el-button>
      </el-row>
    </el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
</template>

<script>
export default {
  name: "project",
  mounted() {
    this.GetProject();
  },
  methods: {
    GetProject() {
      this.$http.get("/project/").then((response) => {
        if (response.status != 200) {
          return;
        }
        this.projects = response.data;
      });
    },
    detail(row) {
      this.$router.push({ path: "/session/" + row.ID });
    },
    create() {
      this.$router.push({ path: "/project/new" });
    },
    delete() {},
  },
  data() {
    return {
      projects: [],
    };
  },
};
</script>