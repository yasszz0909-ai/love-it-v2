/**
 * OUR LITTLE STORY - Love Messages Store
 * Pure Cloud-Authoritative Persistence: Firebase Firestore (Source of Truth) + localStorage (Read Cache)
 * When documents are deleted from Firestore, they are automatically purged from the UI and local cache.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  initializeFirestore,
  getFirestore, 
  collection, 
  setDoc,
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc,
  getDocFromServer,
  setLogLevel
} from "firebase/firestore";

// Suppress internal offline/unavailable logs in sandboxed iframe environment
try {
  setLogLevel("silent");
} catch (e) {}

const firebaseConfig = {
  projectId: "knotted-chimera-gzp2g",
  appId: "1:752223484816:web:31f93e64f494d04d5c5115",
  apiKey: "AIzaSyBrloAzJW1jjMW0oILmd_XC_vOCmyq1TP8",
  authDomain: "knotted-chimera-gzp2g.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-ourlittlestory-b6701611-63b0-4e35-accd-5556532506dc",
  storageBucket: "knotted-chimera-gzp2g.firebasestorage.app",
  messagingSenderId: "752223484816",
  measurementId: "",
  oAuthClientId: "752223484816-42hlmmp41l0p725enfrq8gja48ul6hq9.apps.googleusercontent.com"
};

const LOCAL_STORAGE_KEY = "our_little_story_saved_letters_v2";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents`;
const FIRESTORE_REST_BASE = `${FIRESTORE_BASE_URL}/messages`;
const FIRESTORE_QUERY_ENDPOINT = `${FIRESTORE_BASE_URL}:runQuery?key=${firebaseConfig.apiKey}`;

let db = null;
let isFirebaseReady = false;

// Initialize Firebase App & Firestore with Long-Polling for Sandboxed / Iframe environments
try {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  try {
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true
    }, firebaseConfig.firestoreDatabaseId);
  } catch (initErr) {
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
  isFirebaseReady = true;

  // Validate connection to Firestore as required by skill guidelines
  async function testConnection() {
    try {
      await getDocFromServer(doc(db, "test", "connection"));
      console.log("[LoveMessagesStore] Firestore connection verified successfully.");
    } catch (error) {
      if (error && (
        (error instanceof Error && (error.message.includes("client is offline") || error.message.includes("unavailable"))) ||
        (typeof error === "object" && "code" in error && (error.code === "unavailable" || error.code === "failed-precondition"))
      )) {
        console.warn("[LoveMessagesStore] Client is operating in polling mode, REST fallback active.");
      }
    }
  }
  testConnection();
} catch (e) {
  console.warn("[LoveMessagesStore] SDK initialization error, fallback to REST:", e);
}

// ----------------------------------------------------------------------------
// Deduplication & Local Storage Cache Helpers
// ----------------------------------------------------------------------------
export function deduplicateMessages(messages) {
  if (!Array.isArray(messages)) return [];
  const seenIds = new Set();
  const seenContents = new Set();
  const unique = [];

  for (const m of messages) {
    if (!m) continue;
    const idKey = m.firestoreId || m.id;
    const contentKey = (m.content || "").trim();

    if (idKey && seenIds.has(idKey)) continue;
    if (contentKey && seenContents.has(contentKey)) continue;

    if (idKey) seenIds.add(idKey);
    if (contentKey) seenContents.add(contentKey);
    unique.push(m);
  }
  return unique;
}

export function getLocalMessages() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return deduplicateMessages(parsed);
  } catch (e) {
    return [];
  }
}

export function setLocalMessages(messages) {
  try {
    const cleaned = deduplicateMessages(messages);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleaned));
    window.dispatchEvent(new CustomEvent("love-messages-updated", { detail: cleaned }));
  } catch (e) {
    console.error("Error writing localStorage messages:", e);
  }
}

// ----------------------------------------------------------------------------
// Direct HTTPS REST Fallback Helpers
// ----------------------------------------------------------------------------
async function saveViaRestIdempotent(docId, payload) {
  const body = {
    fields: {
      sender: { stringValue: payload.sender },
      recipient: { stringValue: payload.recipient },
      content: { stringValue: payload.content },
      category: { stringValue: payload.category || "Balasan Surat Cinta" },
      singkat: { stringValue: payload.singkat || "" },
      createdAt: { stringValue: payload.createdAt }
    }
  };

  const urlWithId = `${FIRESTORE_REST_BASE}?documentId=${encodeURIComponent(docId)}&key=${firebaseConfig.apiKey}`;
  const res = await fetch(urlWithId, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (res.ok) return docId;

  if (res.status === 409) {
    const patchUrl = `${FIRESTORE_REST_BASE}/${encodeURIComponent(docId)}?key=${firebaseConfig.apiKey}`;
    const patchRes = await fetch(patchUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (patchRes.ok) return docId;
  }

  const errText = await res.text();
  throw new Error(`REST error ${res.status}: ${errText}`);
}

async function queryViaRest() {
  const payload = {
    structuredQuery: {
      from: [{ collectionId: "messages" }],
      orderBy: [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }]
    }
  };

  const res = await fetch(FIRESTORE_QUERY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`REST query error: ${res.status}`);
  }

  const results = await res.json();
  const list = [];

  for (const r of results) {
    if (!r.document) continue;
    const d = r.document;
    const parts = (d.name || "").split("/");
    const id = parts[parts.length - 1];
    const fields = d.fields || {};

    list.push({
      id: id,
      firestoreId: id,
      sender: fields.sender?.stringValue || "Via",
      recipient: fields.recipient?.stringValue || "I'am/Yas",
      content: fields.content?.stringValue || "",
      category: fields.category?.stringValue || "Surat Cinta",
      singkat: fields.singkat?.stringValue || "",
      createdAt: fields.createdAt?.stringValue || d.createTime || new Date().toISOString(),
      savedToCloud: true
    });
  }

  return deduplicateMessages(list);
}

async function deleteViaRest(docId) {
  try {
    const url = `${FIRESTORE_REST_BASE}/${encodeURIComponent(docId)}?key=${firebaseConfig.apiKey}`;
    const res = await fetch(url, { method: "DELETE" });
    return res.ok;
  } catch (e) {
    return false;
  }
}

// ----------------------------------------------------------------------------
// Public Store API (Cloud Database Authoritative)
// ----------------------------------------------------------------------------
export const LoveMessagesStore = {
  isCloudConnected() {
    return isFirebaseReady && db !== null;
  },

  /**
   * Save a love message permanently to Firestore Cloud Database
   */
  async saveMessage({ sender = "Via", recipient = "I'am/Yas", content, category = "Surat Cinta", singkat = "" }) {
    if (!content || !content.trim()) {
      throw new Error("Pesan tidak boleh kosong");
    }

    const trimmedContent = content.trim();
    const trimmedSender = (sender && sender.trim()) || "Via";
    const trimmedRecipient = (recipient && recipient.trim()) || "I'am/Yas";
    const trimmedSingkat = (singkat && singkat.trim()) || "";
    const nowIso = new Date().toISOString();

    const docId = "msg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);

    const firestorePayload = {
      sender: trimmedSender,
      recipient: trimmedRecipient,
      content: trimmedContent,
      category: category,
      singkat: trimmedSingkat,
      createdAt: nowIso
    };

    const messageData = {
      id: docId,
      firestoreId: docId,
      ...firestorePayload,
      savedToCloud: false
    };

    let cloudSaved = false;

    // 1. Primary: Save via Firebase SDK
    if (this.isCloudConnected()) {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("SDK Timeout")), 3500)
        );
        const writePromise = setDoc(doc(db, "messages", docId), firestorePayload);
        await Promise.race([writePromise, timeoutPromise]);
        cloudSaved = true;
      } catch (err) {
        console.warn("[LoveMessagesStore] SDK setDoc error, using REST fallback:", err);
      }
    }

    // 2. Secondary: Direct HTTPS REST
    if (!cloudSaved) {
      try {
        await saveViaRestIdempotent(docId, firestorePayload);
        cloudSaved = true;
      } catch (restErr) {
        console.error("[LoveMessagesStore] REST error:", restErr);
      }
    }

    messageData.savedToCloud = cloudSaved;

    // Fetch authoritative fresh state or append
    const current = getLocalMessages().filter(m => (m.content || "").trim() !== trimmedContent);
    current.unshift(messageData);
    setLocalMessages(current);

    return { 
      success: cloudSaved, 
      firestoreId: docId, 
      data: messageData 
    };
  },

  /**
   * Fetch all messages directly from Firestore Database (Cloud Authoritative)
   * If Firestore has 0 documents (e.g. user deleted them in Firebase console),
   * this immediately updates the local cache to [] and clears the screen.
   */
  async getAllMessages() {
    let cloudList = null;

    // 1. Try Firebase SDK query
    if (this.isCloudConnected()) {
      try {
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        cloudList = [];
        snapshot.forEach((d) => {
          const data = d.data();
          cloudList.push({
            id: d.id,
            firestoreId: d.id,
            sender: data.sender || "Via",
            recipient: data.recipient || "I'am/Yas",
            content: data.content || "",
            category: data.category || "Surat Cinta",
            singkat: data.singkat || "",
            createdAt: data.createdAt || new Date().toISOString(),
            savedToCloud: true
          });
        });
      } catch (err) {
        console.warn("[LoveMessagesStore] SDK getDocs query failed, trying REST:", err);
      }
    }

    // 2. Try REST runQuery
    if (cloudList === null) {
      try {
        cloudList = await queryViaRest();
      } catch (e) {
        console.warn("[LoveMessagesStore] REST query also failed, using fallback:", e);
      }
    }

    // If cloud successfully responded (even if empty array [!]):
    // CLOUD IS THE SOURCE OF TRUTH! Overwrite local cache with cloud state!
    if (cloudList !== null) {
      const cleaned = deduplicateMessages(cloudList);
      setLocalMessages(cleaned);
      return cleaned;
    }

    // Only return local cache if device is completely offline and cloud couldn't be reached
    return getLocalMessages();
  },

  /**
   * Force clear local storage cache and re-sync from Cloud Firestore
   */
  async forceSyncFromCloud() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return await this.getAllMessages();
  },

  /**
   * Realtime subscription with automatic deletion synchronization
   */
  subscribe(callback) {
    // Initial fetch from cloud immediately
    this.getAllMessages().then((msgs) => {
      callback(msgs);
    }).catch(() => {
      callback(getLocalMessages());
    });

    // Listen for local updates or tab switches
    const onLocalUpdate = (e) => {
      callback(e.detail || getLocalMessages());
    };
    window.addEventListener("love-messages-updated", onLocalUpdate);

    // Periodic polling to pick up cloud changes / deletions
    const interval = setInterval(async () => {
      try {
        const msgs = await this.getAllMessages();
        callback(msgs);
      } catch (e) {}
    }, 6000);

    if (!this.isCloudConnected()) {
      return () => {
        window.removeEventListener("love-messages-updated", onLocalUpdate);
        clearInterval(interval);
      };
    }

    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        const cloudList = [];
        snapshot.forEach((d) => {
          const data = d.data();
          cloudList.push({
            id: d.id,
            firestoreId: d.id,
            sender: data.sender || "Via",
            recipient: data.recipient || "I'am/Yas",
            content: data.content || "",
            category: data.category || "Surat Cinta",
            singkat: data.singkat || "",
            createdAt: data.createdAt || new Date().toISOString(),
            savedToCloud: true
          });
        });

        // The cloud snapshot is authoritative: update cache and render!
        setLocalMessages(cloudList);
        callback(cloudList);
      }, (err) => {
        console.warn("[LoveMessagesStore] onSnapshot error:", err);
      });

      return () => {
        window.removeEventListener("love-messages-updated", onLocalUpdate);
        clearInterval(interval);
        unsubscribeFirestore();
      };
    } catch (e) {
      return () => {
        window.removeEventListener("love-messages-updated", onLocalUpdate);
        clearInterval(interval);
      };
    }
  },

  /**
   * Delete a message by ID from both Cloud Firestore & LocalStorage
   */
  async deleteMessage(id) {
    const list = getLocalMessages();
    const itemToDelete = list.find(m => m.id === id || m.firestoreId === id);
    const updated = list.filter(m => m.id !== id && m.firestoreId !== id);
    setLocalMessages(updated);

    const cloudDocId = (itemToDelete && (itemToDelete.firestoreId || itemToDelete.id)) || id;
    if (cloudDocId) {
      if (this.isCloudConnected()) {
        try {
          await deleteDoc(doc(db, "messages", cloudDocId));
          return true;
        } catch (e) {}
      }
      await deleteViaRest(cloudDocId);
    }
    return true;
  }
};

// Expose globally for vanilla scripts
if (typeof window !== "undefined") {
  window.LoveMessagesStore = LoveMessagesStore;
  window.deduplicateMessages = deduplicateMessages;
}
