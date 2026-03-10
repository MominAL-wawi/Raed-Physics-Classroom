<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <i class="bi bi-mortarboard-fill"></i>
          <span>منصة التعليم الإلكتروني</span>
        </div>
        <p class="mb-0">جميع الحقوق محفوظة &copy; {{ currentYear }}</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent",
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped>
.footer {
  background: linear-gradient(160deg, #0f172a 0%, #1e293b 100%);
  color: rgba(255, 255, 255, 0.7);
  padding: 28px 0;
  margin-top: auto;
  position: relative;
}

.footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(59, 130, 246, 0.4),
    transparent
  );
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
}

.footer-brand i {
  color: #3b82f6;
  font-size: 1.4rem;
  filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.5));
}

.footer p {
  color: #94a3b8;
  font-size: 0.9rem;
}

@media (max-width: 576px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
