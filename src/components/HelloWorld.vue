<template>
  <div class="hello">
    <h1 v-text="msg"></h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',

  props: {
    msg: String
  }
}
</script>


