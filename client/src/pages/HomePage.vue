<script setup>
import { computed, onMounted, ref } from 'vue';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import api from '../api';
import { useGlobalStore } from '../stores/global';
import BlogForm from '../components/BlogForm.vue';

const globalStore = useGlobalStore();
const notyf = new Notyf();

const posts = ref([]);
const loading = ref(false);
const editingPost = ref(null);
const deletingPostId = ref(null);

function extractPosts(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.posts)) return payload.posts;
  if (Array.isArray(payload?.blogs)) return payload.blogs;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

async function fetchPosts() {
  loading.value = true;
  try {
    const { data } = await api.get('/blogs/getPosts');
    posts.value = extractPosts(data);
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Failed to load blog posts.');
    posts.value = [];
  } finally {
    loading.value = false;
  }
}

function handleStartEdit(post) {
  editingPost.value = post;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handlePostSaved() {
  editingPost.value = null;
  fetchPosts();
}

function handleCancelEdit() {
  editingPost.value = null;
}

function isPostOwner(post) {
  const author = post.author;
  const username = globalStore.user.username;

  return Boolean(author === username);
}

function canDeletePost(post) {
  return Boolean(globalStore.user.isAdmin) || isPostOwner(post);
}

function canEditPost(post) {
  return isPostOwner(post);
}

async function handleDeletePost(post) {
  const postId = post._id || post.id;
  if (!postId || !canDeletePost(post)) return;

  deletingPostId.value = postId;
  try {
    await api.delete(`/blogs/${postId}`);
    if (editingPost.value && (editingPost.value._id || editingPost.value.id) === postId) {
      editingPost.value = null;
    }
    notyf.success('Post deleted.');
    await fetchPosts();
  } catch (err) {
    notyf.error(err.response.data.message || 'Failed to delete post.');
  } finally {
    deletingPostId.value = null;
  }
}

onMounted(() => {
  if (globalStore.user.token) {
    fetchPosts();
  }
});
</script>

<template>
  <div class="py-4">
    <div class="mb-5">
      <BlogForm
        :post-to-edit="editingPost"
        @post-saved="handlePostSaved"
        @cancel-edit="handleCancelEdit"
      />
    </div>

    <div>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="mb-0">Recent Posts</h3>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          :disabled="loading"
          @click="fetchPosts"
        >
          Refresh
        </button>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="posts.length === 0" class="text-center text-muted py-5 bg-light rounded-3 border">
        <p class="mb-0">No blog posts yet. Create the first one above!</p>
      </div>

      <div v-else class="row g-3">
        <div class="col-12" v-for="post in posts" :key="post._id || post.id">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                <h5 class="card-title mb-0">{{ post.title }}</h5>
                <div class="d-flex gap-2">
                  <button
                    v-if="canEditPost(post)"
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    @click="handleStartEdit(post)"
                  >
                    Edit
                  </button>

                  <button
                    v-if="canDeletePost(post)"
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    :disabled="deletingPostId === (post._id || post.id)"
                    @click="handleDeletePost(post)"
                  >
                    <span
                      v-if="deletingPostId === (post._id || post.id)"
                      class="spinner-border spinner-border-sm me-1"
                      role="status"
                    ></span>
                    {{ deletingPostId === (post._id || post.id) ? 'Deleting...' : 'Delete' }}
                  </button>
                </div>
              </div>

              <p class="card-text text-secondary mb-2">
                {{ post.content }}
              </p>

              <small class="text-muted">
                <span v-if="post.author">By {{ post.author }}</span>
                <span v-if="post.date">
                  {{ post.author ? ' • ' : '' }}{{ new Date(post.date).toLocaleDateString() }}
                </span>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>