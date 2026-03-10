<template>
  <nav class="navbar navbar-expand-lg navbar-custom">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <i class="bi bi-mortarboard-fill me-2"></i>
        منصة التعليم
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <!-- قائمة الأدمن -->
        <ul v-if="authStore.user?.role === 'admin'" class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/admin">
              <i class="bi bi-speedometer2 me-1"></i>
              لوحة التحكم
            </router-link>
          </li>
        </ul>

        <!-- قائمة الأستاذ -->
        <ul
          v-if="authStore.user?.role === 'teacher'"
          class="navbar-nav me-auto"
        >
          <li class="nav-item">
            <router-link class="nav-link" to="/teacher">
              <i class="bi bi-house-door me-1"></i>
              الرئيسية
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/teacher/questions">
              <i class="bi bi-question-circle me-1"></i>
              الأسئلة
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/teacher/exams">
              <i class="bi bi-journal-text me-1"></i>
              الامتحانات
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/teacher/files">
              <i class="bi bi-folder me-1"></i>
              الملفات
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/teacher/results">
              <i class="bi bi-bar-chart me-1"></i>
              النتائج
            </router-link>
          </li>
        </ul>

        <!-- قائمة الطالب -->
        <ul
          v-if="authStore.user?.role === 'student'"
          class="navbar-nav me-auto"
        >
          <li class="nav-item">
            <router-link class="nav-link" to="/student">
              <i class="bi bi-house-door me-1"></i>
              الرئيسية
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/student/files">
              <i class="bi bi-folder me-1"></i>
              الملفات
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/student/results">
              <i class="bi bi-bar-chart me-1"></i>
              نتائجي
            </router-link>
          </li>
        </ul>

        <!-- معلومات المستخدم -->
        <div class="user-info">
          <div
            class="user-avatar"
            :class="{ 'admin-avatar': authStore.user?.role === 'admin' }"
          >
            <i class="bi" :class="getUserIcon"></i>
          </div>
          <div class="user-details">
            <span class="user-name">{{ authStore.user?.name }}</span>
            <span class="user-role">{{ getRoleLabel }}</span>
          </div>
          <button class="btn btn-outline-light btn-sm ms-3" @click="logout">
            <i class="bi bi-box-arrow-right me-1"></i>
            خروج
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from "vue";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "vue-router";

export default {
  name: "HeaderComponent",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const getUserIcon = computed(() => {
      const role = authStore.user?.role;
      if (role === "admin") return "bi-shield-check";
      if (role === "teacher") return "bi-mortarboard-fill";
      return "bi-person-fill";
    });

    const getRoleLabel = computed(() => {
      const role = authStore.user?.role;
      if (role === "admin") return "مدير النظام";
      if (role === "teacher") return "أستاذ";
      return "طالب";
    });

    const logout = () => {
      authStore.logout();
      router.push("/login");
    };

    return { authStore, logout, getUserIcon, getRoleLabel };
  },
};
</script>

<style scoped>
.navbar-custom {
  background: linear-gradient(160deg, #0f172a 0%, #1e293b 100%);
  padding: 14px 0;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
}

.navbar-custom::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(59, 130, 246, 0.5),
    transparent
  );
}

.navbar-brand {
  color: white !important;
  font-weight: 800;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.navbar-brand i {
  color: #3b82f6;
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
}

.navbar-toggler {
  border-color: rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.9%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.nav-link {
  color: rgba(255, 255, 255, 0.85) !important;
  font-weight: 600;
  padding: 12px 18px !important;
  border-radius: 10px;
  margin: 0 3px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.nav-link:hover {
  color: white !important;
  background: rgba(59, 130, 246, 0.15);
}

.nav-link.router-link-active {
  color: white !important;
  background: linear-gradient(
    145deg,
    rgba(59, 130, 246, 0.2) 0%,
    rgba(59, 130, 246, 0.1) 100%
  );
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.3);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 14px;
  color: white;
  padding: 6px 8px 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.user-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(145deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.user-avatar.admin-avatar {
  background: linear-gradient(145deg, #f59e0b 0%, #d97706 100%);
  color: #0f172a;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}

.user-name {
  font-weight: 700;
  font-size: 0.95rem;
}

.user-role {
  font-size: 0.75rem;
  opacity: 0.7;
  color: #94a3b8;
}

.btn-outline-light {
  border-radius: 10px;
  font-weight: 600;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.25s ease;
}

.btn-outline-light:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
  color: #fca5a5;
}

@media (max-width: 991px) {
  .user-info {
    margin-top: 18px;
    padding: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    justify-content: center;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 14px;
  }
}
</style>
