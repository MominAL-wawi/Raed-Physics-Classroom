import { defineStore } from "pinia";
import { firebaseDB } from "@/firebase/config";

const DB_PATH = "/links";

export const useLinksStore = defineStore("links", {
  state: () => ({
    links: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchLinks() {
      this.loading = true;
      this.error = null;
      try {
        const data = await firebaseDB.get(DB_PATH);
        this.links = firebaseDB.objectToArray(data);
      } catch (err) {
        console.error("خطأ في جلب اللينكات:", err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async addLink(linkData) {
      this.loading = true;
      this.error = null;
      try {
        const dataToAdd = {
          ...linkData,
          createdAt: new Date().toISOString(),
          createdBy: linkData.teacherId,
        };

        const firebaseKey = await firebaseDB.post(DB_PATH, dataToAdd);

        const newLink = {
          ...dataToAdd,
          firebaseKey,
          id: firebaseKey,
        };

        // إضافة العنصر محليًا مباشرة بعد الحفظ
        this.links.push(newLink);

        return newLink;
      } catch (err) {
        console.error("خطأ في إضافة اللينك:", err);
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteLink(linkId) {
      this.loading = true;
      this.error = null;
      try {
        await firebaseDB.delete(DB_PATH, linkId);
        this.links = this.links.filter(
          (link) => link.id !== linkId && link.firebaseKey !== linkId
        );
      } catch (err) {
        console.error("خطأ في حذف اللينك:", err);
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
