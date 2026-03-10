<template>
  <div class="dashboard-container py-4">
    <div class="container">
      <h2 class="mb-4 page-title">
        <i class="bi bi-bar-chart me-2"></i>نتائج الطلاب
      </h2>

      <!-- فلتر حسب الامتحان -->
      <div class="section-card mb-4">
        <div class="card-body">
          <div class="row align-items-end gap-3">
            <div class="col-md-6">
              <label class="form-label">فلتر حسب الامتحان</label>
              <select class="form-select" v-model="selectedExam">
                <option value="">جميع الامتحانات</option>
                <option
                  v-for="exam in examsStore.exams"
                  :key="exam.id"
                  :value="exam.id"
                >
                  {{ exam.title }}
                </option>
              </select>
            </div>
            <div
              class="col-md-4"
              v-if="selectedExam && filteredResults.length > 0"
            >
              <button
                class="btn btn-outline-danger"
                @click="deleteAllExamResults"
                :disabled="isDeleting"
              >
                <i class="bi bi-trash me-2"></i>
                حذف جميع نتائج هذا الامتحان
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- جدول النتائج -->
      <div v-if="filteredResults.length === 0" class="section-card">
        <div class="card-body">
          <div class="empty-state">
            <i class="bi bi-clipboard-x"></i>
            <h4>لا توجد نتائج</h4>
            <p>لم يقدم أي طالب الامتحانات بعد</p>
          </div>
        </div>
      </div>

      <div v-else class="section-card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-custom mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>اسم الطالب</th>
                  <th>البريد الإلكتروني</th>
                  <th>الامتحان</th>
                  <th>النتيجة</th>
                  <th>الإجابات الصحيحة</th>
                  <th>التاريخ</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(result, index) in filteredResults"
                  :key="result.id || result.firebaseKey"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ result.studentName }}</td>
                  <td class="email-cell">{{ result.studentEmail }}</td>
                  <td>{{ result.examTitle }}</td>
                  <td>
                    <span
                      class="badge"
                      :class="getScoreBadgeClass(result.score)"
                    >
                      {{ result.score }}%
                    </span>
                  </td>
                  <td>
                    {{ result.correctAnswers }} / {{ result.totalQuestions }}
                  </td>
                  <td class="date-cell">
                    {{ formatDate(result.submittedAt) }}
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button
                        class="btn btn-outline-primary"
                        @click="resetExamForStudent(result)"
                        :disabled="isDeleting"
                        title="إعادة الامتحان للطالب"
                      >
                        <i class="bi bi-arrow-repeat"></i>
                      </button>
                      <button
                        class="btn btn-outline-danger"
                        @click="deleteResult(result)"
                        :disabled="isDeleting"
                        title="حذف النتيجة"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- إحصائيات -->
      <div v-if="filteredResults.length > 0" class="row mt-4">
        <div class="col-md-4 mb-3">
          <div class="stats-card">
            <div class="icon primary">
              <i class="bi bi-people"></i>
            </div>
            <h3>{{ filteredResults.length }}</h3>
            <p>إجمالي المشاركين</p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="stats-card">
            <div class="icon success">
              <i class="bi bi-graph-up"></i>
            </div>
            <h3>{{ averageScore }}%</h3>
            <p>متوسط النتائج</p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="stats-card">
            <div class="icon warning">
              <i class="bi bi-trophy"></i>
            </div>
            <h3>{{ highestScore }}%</h3>
            <p>أعلى نتيجة</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useExamsStore } from "@/store/examsStore";

export default {
  name: "ResultsPage",
  setup() {
    const examsStore = useExamsStore();
    const selectedExam = ref("");
    const isDeleting = ref(false);

    // تحميل البيانات من Firebase عند تحميل الصفحة
    onMounted(async () => {
      await Promise.all([examsStore.loadExams(), examsStore.loadResults()]);
    });

    const filteredResults = computed(() => {
      if (!selectedExam.value) return examsStore.results;
      return examsStore.getResultsByExam(selectedExam.value);
    });

    const averageScore = computed(() => {
      if (filteredResults.value.length === 0) return 0;
      const sum = filteredResults.value.reduce((acc, r) => acc + r.score, 0);
      return Math.round(sum / filteredResults.value.length);
    });

    const highestScore = computed(() => {
      if (filteredResults.value.length === 0) return 0;
      return Math.max(...filteredResults.value.map((r) => r.score));
    });

    const getScoreBadgeClass = (score) => {
      if (score >= 90) return "bg-success";
      if (score >= 70) return "bg-primary";
      if (score >= 50) return "bg-warning";
      return "bg-danger";
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // حذف نتيجة واحدة
    const deleteResult = async (result) => {
      if (!confirm(`هل أنت متأكد من حذف نتيجة ${result.studentName}؟`)) return;

      isDeleting.value = true;
      try {
        await examsStore.deleteResult(result.firebaseKey);
      } catch (error) {
        alert("حدث خطأ أثناء حذف النتيجة");
      } finally {
        isDeleting.value = false;
      }
    };

    // إعادة الامتحان لطالب معين
    const resetExamForStudent = async (result) => {
      if (
        !confirm(
          `هل أنت متأكد من إعادة الامتحان للطالب ${result.studentName}؟\nسيتم حذف نتيجته الحالية وسيتمكن من إعادة الامتحان.`
        )
      )
        return;

      isDeleting.value = true;
      try {
        await examsStore.resetExamForStudent(
          result.examId,
          result.studentEmail
        );
        alert(`تم إعادة الامتحان للطالب ${result.studentName} بنجاح`);
      } catch (error) {
        alert("حدث خطأ أثناء إعادة الامتحان");
      } finally {
        isDeleting.value = false;
      }
    };

    // حذف جميع نتائج امتحان معين
    const deleteAllExamResults = async () => {
      const exam = examsStore.exams.find(
        (e) =>
          e.id === selectedExam.value || e.firebaseKey === selectedExam.value
      );
      const examTitle = exam?.title || "هذا الامتحان";

      if (
        !confirm(
          `هل أنت متأكد من حذف جميع نتائج "${examTitle}"؟ لا يمكن التراجع عن هذا الإجراء.`
        )
      )
        return;

      isDeleting.value = true;
      try {
        await examsStore.deleteResultsByExam(selectedExam.value);
        selectedExam.value = "";
      } catch (error) {
        alert("حدث خطأ أثناء حذف النتائج");
      } finally {
        isDeleting.value = false;
      }
    };

    return {
      examsStore,
      selectedExam,
      filteredResults,
      averageScore,
      highestScore,
      getScoreBadgeClass,
      formatDate,
      deleteResult,
      resetExamForStudent,
      deleteAllExamResults,
      isDeleting,
    };
  },
};
</script>

<style scoped>
.page-title {
  font-weight: 700;
}

.email-cell {
  font-size: 0.85rem;
  color: var(--gray);
}

.date-cell {
  font-size: 0.85rem;
  white-space: nowrap;
}

.btn-outline-danger {
  transition: all 0.2s ease;
}

.btn-outline-danger:hover:not(:disabled) {
  transform: scale(1.05);
}

.btn-outline-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
