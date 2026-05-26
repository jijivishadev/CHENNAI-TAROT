"use client";

import React, { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Phone, Mail, Globe, Save, ChevronUp, ChevronDown } from "lucide-react";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600"] });

type SocialPlatform = {
  id: string;
  name: string;
  url: string;
  order: number;
  createdAt: number;
};

type ContactInfo = {
  mobile: string;
  email: string;
  updatedAt: number;
  id?: string;
};

export default function ContactHub() {
  const [socialPlatforms, setSocialPlatforms] = useState<SocialPlatform[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const contactSnap = await getDocs(collection(db, "contact_info"));
      if (!contactSnap.empty) {
        const contactDoc = contactSnap.docs[0];
        setContactInfo({ id: contactDoc.id, ...contactDoc.data() } as ContactInfo & { id: string });
      }
      const socialSnap = await getDocs(query(collection(db, "social_platforms"), orderBy("order", "asc")));
      const platforms = socialSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialPlatform));
      setSocialPlatforms(platforms);
    } catch (error) {
      console.error("Error fetching contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const mobile = (form.mobile as HTMLInputElement).value;
    const email = (form.email as HTMLInputElement).value;

    try {
      if (contactInfo?.id) {
        await updateDoc(doc(db, "contact_info", contactInfo.id), { mobile, email, updatedAt: Date.now() });
      } else {
        await addDoc(collection(db, "contact_info"), { mobile, email, updatedAt: Date.now() });
      }
      alert("Contact Info Updated!");
      fetchData();
    } catch (error) { console.error(error); }
  };

  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.platformName as HTMLInputElement).value;
    const url = (form.platformUrl as HTMLInputElement).value;
    try {
      await addDoc(collection(db, "social_platforms"), { name, url, order: socialPlatforms.length + 1, createdAt: Date.now() });
      form.reset();
      setShowForm(false);
      fetchData();
    } catch (error) { console.error(error); }
  };

  const handleUpdateSocial = async (id: string, updates: Partial<SocialPlatform>) => {
    try {
      await updateDoc(doc(db, "social_platforms", id), updates);
      fetchData();
    } catch (error) { console.error(error); }
  };

  const handleDeleteSocial = async (id: string) => {
    if (confirm("Delete this platform?")) {
      try {
        await deleteDoc(doc(db, "social_platforms", id));
        fetchData();
      } catch (error) { console.error(error); }
    }
  };

  const handleReorderSocial = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = socialPlatforms.findIndex(p => p.id === id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex >= 0 && targetIndex < socialPlatforms.length) {
      const targetId = socialPlatforms[targetIndex].id;
      const currentOrder = socialPlatforms[currentIndex].order;
      const targetOrder = socialPlatforms[targetIndex].order;
      try {
        await Promise.all([
          updateDoc(doc(db, "social_platforms", id), { order: targetOrder }),
          updateDoc(doc(db, "social_platforms", targetId), { order: currentOrder })
        ]);
        fetchData();
      } catch (error) { console.error(error); }
    }
  };

  return (
    <div className="w-full bg-[#FDFBFF] min-h-screen p-4 md:p-10 text-[#1A0B2E]">
      <div className="mb-12">
        <h1 className={`${playfair.className} text-4xl md:text-5xl flex items-center gap-4`}>
          Contact <span className="italic text-[#D4AF37]">Hub</span>
        </h1>
        <div className="w-20 h-1 bg-[#D4AF37] mt-4" />
        <p className={`${cormorant.className} mt-4 text-xl text-[#1A0B2E]/50`}>Manage your global digital footprint.</p>
      </div>

      {/* Contact Info Form */}
      <section className="mb-16">
        <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-[#D4AF37] mb-6">Core Communication</h2>
        <form onSubmit={handleUpdateContact} className="bg-white border border-[#D4AF37]/10 rounded-[2rem] p-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-[#1A0B2E]/40">Mobile Access</label>
              <div className="flex items-center gap-3 border-b-2 border-[#D4AF37]/20 focus-within:border-[#D4AF37] transition-all py-2">
                <Phone size={18} className="text-[#D4AF37]" />
                <input type="tel" name="mobile" defaultValue={contactInfo?.mobile} className="bg-transparent outline-none w-full text-lg" placeholder="+1 318 768 8668" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-[#1A0B2E]/40">Primary Email</label>
              <div className="flex items-center gap-3 border-b-2 border-[#D4AF37]/20 focus-within:border-[#D4AF37] transition-all py-2">
                <Mail size={18} className="text-[#D4AF37]" />
                <input type="email" name="email" defaultValue={contactInfo?.email} className="bg-transparent outline-none w-full text-lg" placeholder="coach@example.com" />
              </div>
            </div>
          </div>
          <button type="submit" className="mt-8 bg-[#1A0B2E] text-white px-8 py-3 rounded-xl font-bold tracking-widest hover:bg-[#D4AF37] hover:text-[#1A0B2E] transition-all flex items-center gap-2">
            <Save size={18} /> SAVE CHANGES
          </button>
        </form>
      </section>

      {/* Social Platforms List */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-[#D4AF37] mb-2">Digital Presence</h2>
            <h3 className={`${playfair.className} text-3xl`}>Social Platforms</h3>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-[#D4AF37] text-[#1A0B2E] px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
            <Plus size={20} /> ADD NEW
          </button>
        </div>

        {showForm && (
          <motion.form initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleAddSocial} className="bg-[#F8F6FF] border border-[#D4AF37]/20 rounded-[2rem] p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <input type="text" name="platformName" placeholder="Platform Name (e.g. Instagram)" className="bg-white p-4 rounded-xl outline-none border border-[#D4AF37]/10 focus:border-[#D4AF37]" required />
              <input type="url" name="platformUrl" placeholder="URL Link" className="bg-white p-4 rounded-xl outline-none border border-[#D4AF37]/10 focus:border-[#D4AF37]" required />
            </div>
            <div className="flex gap-4 mt-6">
              <button type="submit" className="bg-[#1A0B2E] text-white px-6 py-2 rounded-lg font-bold">ADD PLATFORM</button>
              <button type="button" onClick={() => setShowForm(false)} className="text-[#1A0B2E]/40 font-bold uppercase text-xs">Cancel</button>
            </div>
          </motion.form>
        )}

        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {socialPlatforms.map((platform, idx) => (
              <SocialCard key={platform.id} platform={platform} onUpdate={handleUpdateSocial} onDelete={handleDeleteSocial} onReorder={handleReorderSocial} isFirst={idx === 0} isLast={idx === socialPlatforms.length - 1} index={idx} />
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

function SocialCard({ platform, onUpdate, onDelete, onReorder, isFirst, isLast, index }: any) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState({ name: platform.name, url: platform.url });

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-[#D4AF37]/10 p-6 rounded-[2rem] flex items-center justify-between group relative overflow-hidden">
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-7xl font-bold text-[#D4AF37]/5 italic pointer-events-none select-none">0{index + 1}</div>
      
      <div className="flex-1 z-10 pl-8">
        {editing ? (
          <div className="flex flex-col md:flex-row gap-4">
            <input value={val.name} onChange={e => setVal({...val, name: e.target.value})} className="border-b border-[#D4AF37] outline-none p-1" />
            <input value={val.url} onChange={e => setVal({...val, url: e.target.value})} className="border-b border-[#D4AF37] outline-none p-1 flex-1" />
            <button onClick={() => { onUpdate(platform.id, val); setEditing(false); }} className="text-[#D4AF37] font-bold">SAVE</button>
          </div>
        ) : (
          <div>
            <h4 className={`${playfair.className} text-xl text-[#1A0B2E]`}>{platform.name}</h4>
            <p className="text-sm text-[#1A0B2E]/40 italic">{platform.url}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 z-10">
        <div className="flex flex-col">
          <button disabled={isFirst} onClick={() => onReorder(platform.id, 'up')} className="disabled:opacity-20 hover:text-[#D4AF37]"><ChevronUp size={20}/></button>
          <button disabled={isLast} onClick={() => onReorder(platform.id, 'down')} className="disabled:opacity-20 hover:text-[#D4AF37]"><ChevronDown size={20}/></button>
        </div>
        <button onClick={() => setEditing(!editing)} className="p-2 bg-[#F8F6FF] rounded-full text-[#1A0B2E]/40 hover:text-[#D4AF37]"><Edit size={18}/></button>
        <button onClick={() => onDelete(platform.id)} className="p-2 bg-red-50 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
      </div>
    </motion.div>
  );
}