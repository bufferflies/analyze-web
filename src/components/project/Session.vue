<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="12">
      <el-table :data="sessions" align="center" border>
        <el-table-column prop="ID" label="ID"> </el-table-column>
        <el-table-column prop="Name" label="Name"> </el-table-column>
        <el-table-column prop="TargetObject" label="target"> </el-table-column>
        <el-table-column prop="CreatedAt" label="Create"> </el-table-column>
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
  name: "session",
  mounted() {
    this.GetSessions();
  },
  methods: {
    GetSessions() {
      const id = this.$route.params.project_id;
      this.$http.get("/project/sessions/" + id).then((response) => {
        if (response.status != 200) {
          return;
        }
        this.sessions = response.data;
      });
    },
    detail(row) {
      this.$router.push({ path: "/workload/" + row.ID });
    },
    create() {
      const id = this.$route.params.project_id;
      this.$router.push({ path: "/session/new/" + id });
    },
  },
  data() {
    return {
      sessions: [],
    };
  },
};
</script>
<style >
</style>>