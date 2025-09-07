<template>
<div class="form-fragment">
  <slot></slot>
</div>
</template>

<script>
export default {
  name: "FormFragment"
}
</script>

<style scoped>
.form-fragment {
  width: 100%;
  height: 35rem;
  display: flex;
  justify-content: center;

}
@media (min-width: 768px) and (max-width: 1024px) {
  .form-fragment {
    align-items: flex-start;
  }
}
@media (min-width: 320px) and (max-width: 540px) {
  .form-fragment {
    align-items: flex-start;
  }
}
@media (min-width: 541px) and (max-width: 767px){
  .form-fragment {
    align-items: flex-start;
  }
}
</style>