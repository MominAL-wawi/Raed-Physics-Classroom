<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-icon">
            <i class="bi bi-mortarboard-fill"></i>
          </div>
          <h2>منصة التعليم الإلكتروني</h2>
          <p>سجل دخولك للمتابعة</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div
            v-if="error"
            class="alert alert-danger d-flex align-items-center"
            role="alert"
          >
            <i class="bi bi-exclamation-circle-fill me-2"></i>
            {{ error }}
          </div>

          <div class="form-group">
            <label for="email">البريد الإلكتروني</label>
            <div class="input-wrapper">
              <i class="bi bi-envelope"></i>
              <input
                type="email"
                id="email"
                placeholder="أدخل البريد الإلكتروني"
                v-model="email"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">كلمة المرور</label>
            <div class="input-wrapper">
              <i class="bi bi-lock"></i>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                placeholder="أدخل كلمة المرور"
                v-model="password"
                required
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <i
                  class="bi"
                  :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
                ></i>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-login" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>
              <i class="bi bi-box-arrow-in-left me-2"></i>
              تسجيل الدخول
            </span>
          </button>
        </form>

        <div class="login-footer">
          <p>منصة تعليمية متكاملة للأساتذة والطلاب</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";

export default {
  name: "LoginPage",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const email = ref("");
    const password = ref("");
    const error = ref("");
    const loading = ref(false);
    const showPassword = ref(false);

    const handleLogin = async () => {
      error.value = "";
      loading.value = true;

      try {
        const result = await authStore.login(email.value, password.value);

        if (result.success) {
          if (result.role === "admin") {
            router.push("/admin");
          } else if (result.role === "teacher") {
            router.push("/teacher");
          } else {
            router.push("/student");
          }
        } else {
          error.value = result.message;
        }
      } catch (err) {
        error.value = "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.";
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      error,
      loading,
      showPassword,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-page::before {
  content: "";
  position: absolute;
  top: -30%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.15) 0%,
    transparent 70%
  );
  animation: pulse-glow 8s ease-in-out infinite;
}

.login-page::after {
  content: "";
  position: absolute;
  bottom: -30%;
  left: -20%;
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(16, 185, 129, 0.12) 0%,
    transparent 70%
  );
  animation: pulse-glow 10s ease-in-out infinite reverse;
}

@keyframes pulse-glow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

.login-container {
  width: 100%;
  max-width: 440px;
  position: relative;
  z-index: 1;
}

.login-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 28px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  padding: 50px 40px;
  backdrop-filter: blur(20px);
}

.login-header {
  text-align: center;
  margin-bottom: 35px;
}

.logo-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(145deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  transform-style: preserve-3d;
  animation: float-icon 4s ease-in-out infinite;
}

@keyframes float-icon {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.logo-icon i {
  font-size: 50px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.login-header h2 {
  color: #0f172a;
  font-weight: 800;
  font-size: 1.75rem;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}

.login-header p {
  color: #64748b;
  margin: 0;
  font-size: 1rem;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  color: #0f172a;
  font-weight: 700;
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper > i:first-child {
  position: absolute;
  right: 18px;
  color: #94a3b8;
  font-size: 1.2rem;
  pointer-events: none;
  transition: color 0.3s ease;
}

.input-wrapper:focus-within > i:first-child {
  color: #3b82f6;
}

.input-wrapper input {
  width: 100%;
  padding: 18px 54px 18px 54px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

.toggle-password {
  position: absolute;
  left: 16px;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 8px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  z-index: 10;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.toggle-password:hover {
  color: #4361ee;
  background: rgba(67, 97, 238, 0.1);
}

.toggle-password:focus {
  outline: none;
  color: #4361ee;
}

.btn-login {
  width: 100%;
  padding: 18px;
  background: linear-gradient(145deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 1.15rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.35);
  position: relative;
  overflow: hidden;
}

.btn-login::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

.btn-login:hover::before {
  left: 100%;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.5);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-footer {
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.login-footer p {
  color: #64748b;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
}

.alert {
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 22px;
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-danger {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #dc2626;
  border: 1px solid rgba(220, 38, 38, 0.15);
}

@media (max-width: 480px) {
  .login-card {
    padding: 40px 28px;
    border-radius: 24px;
  }

  .logo-icon {
    width: 85px;
    height: 85px;
    border-radius: 22px;
  }

  .logo-icon i {
    font-size: 42px;
  }

  .login-header h2 {
    font-size: 1.5rem;
  }

  .input-wrapper input {
    padding: 16px 48px 16px 48px;
  }

  .btn-login {
    padding: 16px;
    font-size: 1.05rem;
  }
}
</style>
