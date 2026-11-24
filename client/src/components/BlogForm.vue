<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import api from '../api';
import { useGlobalStore } from '../stores/global';

const props = defineProps({
  postToEdit: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['post-saved', 'cancel-edit']);
const globalStore = useGlobalStore();
const notyf = new Notyf();

const submitting = ref(false);
const form = reactive({
  title: '',
  content: '',
  author: '',
});

const isEditing = computed(
  () => Boolean(props.postToEdit && (props.postToEdit._id || props.postToEdit.id))
);

function getCurrentAuthor() {
  return globalStore.user?.email || localStorage.getItem('email') || '';
}

function resetForm() {
  form.title = '';
  form.content = '';
  form.author = getCurrentAuthor();
}

watch(
  () => props.postToEdit,
  (post) => {
    if (post) {
      form.title = post.title || '';
      form.content = post.content || '';
      form.author = post.author || getCurrentAuthor();
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

function cancelEdit() {
  resetForm();
  emit('cancel-edit');
}

async function handleSubmit() {
  if (!form.title || !form.content) return;

  const authorValue = form.author || getCurrentAuthor();
  if (!authorValue) {
    notyf.error('Author information is missing. Please log in again.');
    return;
  }

  submitting.value = true;
  const payload = {
    title: form.title,
    content: form.content,
    author: authorValue,
  };

  try {
    if (isEditing.value) {
      const postId = props.postToEdit._id || props.postToEdit.id;
      await api.patch(`/blogs/${postId}`, payload);
      notyf.success('Post updated!');
    } else {
      await api.post('/blogs/addPost', payload);
      notyf.success('Post published!');
    }

    resetForm();
    emit('post-saved');
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Failed to save post.');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="card shadow-sm text-start">
    <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
      <h5 class="mb-0">
        {{ isEditing ? 'Edit Post' : 'Create a New Post' }}
      </h5>
      <button
        v-if="isEditing"
        type="button"
        class="btn btn-sm btn-outline-secondary"
        @click="cancelEdit"
      >
        Cancel Edit
      </button>
    </div>

    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="blogTitle" class="form-label fw-semibold">Title</label>
          <input
            id="blogTitle"
            v-model.trim="form.title"
            type="text"
            class="form-control"
            placeholder="Enter post title..."
            required
          />
        </div>

        <div class="mb-3">
          <label for="blogContent" class="form-label fw-semibold">Content</label>
          <textarea
            id="blogContent"
            v-model.trim="form.content"
            class="form-control"
            rows="4"
            placeholder="Write your blog post..."
            required
          ></textarea>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button
            v-if="isEditing"
            type="button"
            class="btn btn-outline-secondary"
            :disabled="submitting"
            @click="cancelEdit"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <span
              v-if="submitting"
              class="spinner-border spinner-border-sm me-1"
              role="status"
            ></span>
            {{ submitting ? (isEditing ? 'Updating...' : 'Publishing...') : (isEditing ? 'Update Post' : 'Publish Post') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>