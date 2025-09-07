<template>
  <div>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" :class=" currentPage === 1 ? 'change-page-button-disable' : 'change-page-button'">{{this.$store.getters.t('previous')}}</button>

      <span v-if="totalPages > 3" class="page-number" :class="{ active: currentPage === 1 }" @click="goToPage(1)">
        1
      </span>

      <span v-if="shouldShowEllipsisLeft" style="font-size: 24px;position: relative;bottom: 5px">...</span>

      <span v-for="page in visiblePages" :key="page" class="page-number"
            :class="{ active: currentPage === page }" @click="goToPage(page)">
        {{ page }}
      </span>

      <span v-if="shouldShowEllipsisRight" style="font-size: 24px;position: relative;bottom: 5px">...</span>

      <span v-if="totalPages > 3" class="page-number" :class="{ active: currentPage === totalPages }" @click="goToPage(totalPages)">
        {{ totalPages }}
      </span>

      <button @click="nextPage" :disabled="currentPage === totalPages" :class=" currentPage === totalPages ? 'change-page-button-disable' : 'change-page-button'">{{this.$store.getters.t('next-number')}}</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemsLength: {
      type: Array,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      default: 5,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.itemsLength / this.itemsPerPage);
    },
    visiblePages() {
      const pages = [];
      const total = this.totalPages;

      if (total <= 3) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
        return pages;
      }

      const startPage = Math.max(2, this.currentPage - 1);
      const endPage = Math.min(total - 1, this.currentPage + 1);

      if (startPage > 2) {
        pages.push(startPage - 1); // Show page before the first visible page
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < total - 1) {
        pages.push(endPage + 1); // Show page after the last visible page
      }

      return pages;
    },
    shouldShowEllipsisLeft() {
      return this.visiblePages[0] > 2;
    },
    shouldShowEllipsisRight() {
      return this.visiblePages[this.visiblePages.length - 1] < this.totalPages - 1;
    },
  },
  methods: {
    nextPage() {
      // if (this.currentPage < this.totalPages) {
      //   this.currentPage++;
      // }
      this.$emit('change-page', this.currentPage + 1)
    },
    prevPage() {
      // if (this.currentPage > 1) {
      //   this.currentPage--;
      // }
      this.$emit('change-page', this.currentPage - 1)
    },
    goToPage(page) {
      // this.currentPage = page;
      this.$emit('change-page', page)
    },
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
button {
  padding: 5px 10px;
  margin: 0 5px;
}
.page-number {
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.2rem;
  color: rgb(41, 41, 51);
  border: 1px solid rgb(41, 41, 51);
  border-radius: 50%;
}
.page-number:hover {
  background-color: #f0f0f0;
}
.active {
  font-weight: bold;
  text-decoration: underline;
  background-color:rgb(27, 118, 255) ;
  color: white;
}
.change-page-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #75758F;
}
.change-page-button-disable {
  background-color: transparent;
  border: none;
  cursor: not-allowed;
}
</style>