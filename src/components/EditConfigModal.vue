<template>
  <div class="modal fade" id="configEditModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
    <div class="modal-dialog  modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Configuration</h5>
          <span v-if="isLocked" class="badge bg-warning">Locked</span>
          <button type="button" class="btn-close" data-bs-dismiss="modal" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="configEditForm">
            <div class="form-group">
              <label class="form-label">Parameter Key</label>
              <input v-model="config.paramKey" :disabled="isLocked" type="text" class="form-control" required />
            </div>
            <div class="form-group">
              <label class="form-label">Value</label>
              <input v-model="config.value" :disabled="isLocked" type="text" class="form-control" required />
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <input v-model="config.description" :disabled="isLocked" type="text" class="form-control" required />
            </div>
            <div class="mt-2">
              <button type="submit" class="btn btn-primary me-2" @click="closeModal">
                Save
              </button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConfigService from "../services/configService.js";

export default {
  data() {
    return {
      config: {
        id: "",
        paramKey: "",
        description: "",
        value: "",
      },
      isLocked: false,
      lockStatusInterval: null,
      lockStatusTimeout: null,
    }
  },
  created() {
  },
  beforeUnmount() {
    clearInterval(this.lockStatusInterval);
    clearTimeout(this.lockStatusTimeout);
    this.lockStatusInterval = null;
    this.lockStatusTimeout = null;
  },
  watch: {
    async isLocked(newVal, oldVal) {
      this.config = await ConfigService.getById(this.config.id);
      console.log('Config updated by id: ' + this.config.id);
    },
  },
  methods: {
    closeModal() {
      clearInterval(this.lockStatusInterval);
      clearTimeout(this.lockStatusTimeout);
      this.lockStatusInterval = null;
      this.lockStatusTimeout = null;
    },
    async assignDataToEditModal(config) {
      this.config = config;
      await this.checkLockStatus(config.id);
      const interval = import.meta.env.VITE_CHECK_LOCK_INTERVAL || 1000;
      const timeout = import.meta.env.VITE_CHECK_LOCK_TIMEOUT || 60000;
      this.lockStatusTimeout = setTimeout(() => {
        clearInterval(this.lockStatusInterval);
        this.lockStatusInterval = null;
        console.log('Lock status interval stopped after: ' + timeout + 'ms');
      }, timeout);
      this.lockStatusInterval = setInterval(() => {
        this.checkLockStatus(config.id);
        console.log('Checking lock status: ' + config.id);
      }, interval);

    },
    async checkLockStatus(configId) {
      this.isLocked = await ConfigService.checkLockByConfigId(configId);
    },
    async configEditForm() {
      try {
        await ConfigService.update(this.config.id, {
          paramKey: this.config.paramKey,
          description: this.config.description,
          value: this.config.value,
          updatedAt: this.config.updatedAt,
        });
        alert("Configuration updated successfully");
        this.$emit("configEdited", this.config)
      } catch (error) {
        if (error.response.data.message === 'conflict') {
          alert('Conflict: Another user has updated the configuration.\nPlease, try again.');
        } else {
          alert("Error updating configuration.\nPlease, try again.");
        }
      }
    },
  }
}
</script>

<style scoped>
.custom-modal-footer {
  position: relative;
}
</style>