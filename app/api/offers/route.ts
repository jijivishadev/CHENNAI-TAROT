import { NextResponse } from "next/server";
import { getAdminDb } from "../../../lib/firebase-admin";
import type { DocumentSnapshot, QueryDocumentSnapshot } from "firebase-admin/firestore";
import type { CoachingPlan } from "@/types";

export const dynamic = "force-dynamic";

const planOrder: Record<string, number> = {
  "plan-discovery": 1,
  "plan-3-month": 2,
  "plan-1-year": 3,
};

const defaultPlans: Array<CoachingPlan & { displayOrder: number }> = [
  {
    id: "plan-discovery",
    title: "Discovery Call",
    price: "$111",
    description: "Default fallback",
    features: ["A", "B", "C"],
    buttonLink: "https://calendly.com/",
    isDiscoveryCall: true,
    displayOrder: 1,
  },
  {
    id: "plan-3-month",
    title: "3-Month Container",
    price: "$2,997",
    description: "Default fallback",
    features: ["A", "B", "C"],
    buttonLink: "https://calendly.com/",
    isDiscoveryCall: false,
    displayOrder: 2,
  },
  {
    id: "plan-1-year",
    title: "1-Year Mastermind",
    price: "$11,111",
    description: "Default fallback",
    features: ["A", "B", "C"],
    buttonLink: "https://calendly.com/",
    isDiscoveryCall: false,
    displayOrder: 3,
  },
];

async function ensureDefaultOffersExist(db: ReturnType<typeof getAdminDb>) {
  const refs = defaultPlans.map((plan) => db.collection("offers").doc(plan.id));
  const snapshots = await db.getAll(...refs);

  const batch = db.batch();
  let hasWrites = false;

  snapshots.forEach((snapshot: DocumentSnapshot, index: number) => {
    if (!snapshot.exists) {
      const { id, ...data } = defaultPlans[index];
      batch.set(db.collection("offers").doc(id), {
        ...data,
        updatedAt: Date.now(),
      });
      hasWrites = true;
    }
  });

  if (hasWrites) {
    await batch.commit();
  }
}

export async function GET() {
  try {
    const adminDb = getAdminDb();

    await ensureDefaultOffersExist(adminDb);

    const snapshot = await adminDb.collection("offers").get();

    const plans = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...(doc.data() as Omit<CoachingPlan, "id">),
    }));

    const sortedPlans = plans.sort((a, b) => {
      const aOrder = planOrder[a.id] ?? 999;
      const bOrder = planOrder[b.id] ?? 999;
      return aOrder - bOrder;
    });

    // ✅ FIX: source added
    return NextResponse.json({
      plans: sortedPlans,
      source: "firebase",
    });
  } catch (error) {
    console.warn("Fallback triggered:", error);

    const fallbackPlans = [...defaultPlans].sort(
      (a, b) => (planOrder[a.id] ?? 999) - (planOrder[b.id] ?? 999)
    );

    // ✅ FIX: source added
    return NextResponse.json({
      plans: fallbackPlans,
      source: "fallback",
    });
  }
}

export async function PATCH(request: Request) {
  try {
    const adminDb = getAdminDb();
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id.trim() : "";

    if (!id) {
      return NextResponse.json({ error: "Missing plan id" }, { status: 400 });
    }

    const payload: Partial<Omit<CoachingPlan, "id">> = {};

    if (typeof body.title === "string") payload.title = body.title;
    if (typeof body.price === "string") payload.price = body.price;
    if (typeof body.description === "string") payload.description = body.description;
    if (typeof body.buttonLink === "string") payload.buttonLink = body.buttonLink;
    if (Array.isArray(body.features))
      payload.features = body.features.filter((f: unknown): f is string => typeof f === "string");
    if (typeof body.isDiscoveryCall === "boolean") payload.isDiscoveryCall = body.isDiscoveryCall;

    await adminDb
      .collection("offers")
      .doc(id)
      .set({ ...payload, updatedAt: Date.now() }, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}