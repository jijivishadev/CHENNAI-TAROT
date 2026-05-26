import "server-only";

import type { App } from "firebase-admin/app";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const mockAdminApp = {
  name: "__BUILD_MOCK_APP__",
} as App;

function readEnv(name: string): string {
  if (typeof process === "undefined" || !process.env) {
    return "";
  }

  return process.env[name]?.trim() ?? "";
}

export function isBuildPhase(): boolean {
  const isNextBuild = readEnv("NEXT_PHASE") === "phase-production-build";
  const isNetlifyBuild = readEnv("NETLIFY") === "true" && Boolean(readEnv("BUILD_ID"));
  const isProduction = readEnv("NODE_ENV") === "production";
  const hasPrivateKey = Boolean(readEnv("FIREBASE_ADMIN_PRIVATE_KEY"));

  return (isNextBuild || isNetlifyBuild) && isProduction && !hasPrivateKey;
}

export function getFirebaseAdminApp() {
  if (isBuildPhase()) {
    return mockAdminApp;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = readEnv("FIREBASE_ADMIN_PROJECT_ID") || readEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  const clientEmail = readEnv("FIREBASE_ADMIN_CLIENT_EMAIL");
  const rawPrivateKey = readEnv("FIREBASE_ADMIN_PRIVATE_KEY");
  const privateKey = rawPrivateKey.replace(/\\n/g, "\n");
  const storageBucket = readEnv("FIREBASE_ADMIN_STORAGE_BUCKET") || readEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  const hasExplicitCredentials = Boolean(projectId && clientEmail && rawPrivateKey);

  if (!hasExplicitCredentials) {
    // Fall back to application default credentials (e.g. App Hosting/Cloud runtime service account).
    return initializeApp({
      ...(projectId ? { projectId } : {}),
      ...(storageBucket ? { storageBucket } : {}),
    });
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    ...(storageBucket ? { storageBucket } : {}),
  });
}

export function getAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}

export function getAdminStorage() {
  return getStorage(getFirebaseAdminApp());
}

export default getFirebaseAdminApp;
