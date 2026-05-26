"use client";

import React, { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Youtube, User, Image as ImageIcon, Quote } from "lucide-react";
import dynamic from 'next/dynamic';
const AssetUploader = dynamic(() => import('./AssetUploader'), { ssr: false, loading: () => <div>Loading…</div> });
import Image from "next/image";

type VideoTestimonial = {
  id: string;
  youtubeLink: string;
  text: string;
  personPhoto: string;
  name: string;
  createdAt: number;
};

type TextReview = {
  id: string;
  profilePhoto: string;
  name: string;
  designation: string;
  reviewText: string;
  createdAt: number;
};

export default function TestimonialsManager() {
  const [videoTestimonials, setVideoTestimonials] = useState<VideoTestimonial[]>([]);
  const [textReviews, setTextReviews] = useState<TextReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'videos' | 'reviews'>('videos');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const [videoSnap, textSnap] = await Promise.all([
        getDocs(query(collection(db, "video_testimonials"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "text_reviews"), orderBy("createdAt", "desc")))
      ]);
      
      const videos = videoSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoTestimonial));
      const texts = textSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TextReview));
      
      setVideoTestimonials(videos);
      setTextReviews(texts);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] p-6 sm:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A0B2E] flex items-center gap-3">
          <Youtube className="text-[#D4AF37] w-8 h-8" />
          Testimonials & Reviews Engine
        </h1>
        <p className="mt-2 text-[#1A0B2E]/70">Manage video testimonials and text reviews for the public-facing site.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8">
        {['videos', 'reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'videos' | 'reviews')}
            className={`px-6 py-2 rounded-none font-bold uppercase tracking-wider transition-all ${
              activeTab === tab 
                ? 'bg-[#D4AF37] text-[#1A0B2E]' 
                : 'bg-white text-[#1A0B2E]/40 border border-[#1A0B2E]/10 hover:bg-[#F3ECFF]'
            }`}
          >
            {tab === 'videos' ? 'Video Testimonials' : 'Text Reviews'}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'videos' ? (
          <VideoTestimonialsSection 
            testimonials={videoTestimonials} 
            onRefresh={fetchTestimonials}
            loading={loading}
          />
        ) : (
          <TextReviewsSection 
            reviews={textReviews} 
            onRefresh={fetchTestimonials}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Video Testimonials Section
function VideoTestimonialsSection({ testimonials, onRefresh, loading }: {
  testimonials: VideoTestimonial[];
  onRefresh: () => void;
  loading: boolean;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold ">Video Testimonials</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#D4AF37] text-[#1A0B2E] px-4 py-2 rounded-none font-semibold hover:bg-[#D4AF37]/90"
        >
          <Plus size={20} />
          Add Video
        </button>
      </div>

      {showForm && <VideoTestimonialForm onAdd={onRefresh} />}

      {loading ? (
        <div className="text-white/60">Loading...</div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 text-white/50">
          No video testimonials yet. Add your first one!
        </div>
      ) : (
        <div className="grid gap-6">
          {testimonials.map((testimonial) => (
            <VideoTestimonialCard key={testimonial.id} testimonial={testimonial} onRefresh={onRefresh} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Text Reviews Section
function TextReviewsSection({ reviews, onRefresh, loading }: {
  reviews: TextReview[];
  onRefresh: () => void;
  loading: boolean;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Text Reviews</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#D4AF37] text-[#1A0B2E] px-4 py-2 rounded-lg font-semibold hover:bg-[#D4AF37]/90"
        >
          <Plus size={20} />
          Add Review
        </button>
      </div>

      {showForm && <TextReviewForm onAdd={onRefresh} />}

      {loading ? (
        <div className="text-white/60">Loading...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-white/50">
          No text reviews yet. Add your first one!
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <TextReviewCard key={review.id} review={review} onRefresh={onRefresh} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Video Testimonial Form
function VideoTestimonialForm({ onAdd }: { onAdd: () => void }) {
  const [formData, setFormData] = useState({
    youtubeLink: '',
    text: '',
    personPhoto: '',
    name: ''
  });
  const handlePersonPhotoUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, personPhoto: url }));
  };
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await addDoc(collection(db, "video_testimonials"), {
        ...formData,
        createdAt: Date.now()
      });
      setFormData({ youtubeLink: '', text: '', personPhoto: '', name: '' });
      onAdd();
    } catch (error) {
      console.error("Error adding video testimonial:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="bg-white border border-[#1A0B2E]/10 rounded-2xl p-6 mb-6 shadow-sm"
    >
      <h3 className="text-lg font-bold text-[#1A0B2E] mb-4">Add New Video Testimonial</h3>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-[#1A0B2E] mb-2">YouTube Link</label>
          <input
            type="url"
            value={formData.youtubeLink}
            onChange={(e) => setFormData({...formData, youtubeLink: e.target.value})}
            className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#1A0B2E]/10 rounded-lg text-[#1A0B2E] placeholder-[#1A0B2E]/40"
            placeholder="https://youtube.com/watch?v=..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1A0B2E] mb-2">Person's Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#1A0B2E]/10 rounded-lg text-[#1A0B2E] placeholder-[#1A0B2E]/40"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1A0B2E] mb-2">Person's Photo</label>
          <AssetUploader
            title="Person's Photo"
            description="Upload a local image for the testimonial."
            firestoreField={"personPhoto"}
            storagePath={"testimonials/person-photos"}
            onUpload={handlePersonPhotoUpload}
          />
          {formData.personPhoto && (
            <Image
              src={formData.personPhoto}
              alt="Person"
              width={80}
              height={80}
              className="mt-2 w-20 h-20 rounded-full object-cover border border-[#1A0B2E]/10"
              sizes="80px"
              placeholder="blur"
              blurDataURL="/placeholder-blur.png"
              loading="lazy"
            />
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-[#1A0B2E] mb-2">Testimonial Text</label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({...formData, text: e.target.value})}
            className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#1A0B2E]/10 rounded-lg text-[#1A0B2E] placeholder-[#1A0B2E]/40 resize-none"
            rows={3}
            placeholder="What did they say about your coaching?"
          />
        </div>
        <div className="md:col-span-2 flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-[#D4AF37] text-[#1A0B2E] px-6 py-2 rounded-none font-semibold disabled:opacity-50"
          >
            {submitting ? 'Adding...' : 'Add Testimonial'}
          </button>
          <button
            type="button"
            onClick={() => setFormData({ youtubeLink: '', text: '', personPhoto: '', name: '' })}
            className="px-6 py-2 border border-[#1A0B2E]/10 text-[#1A0B2E] rounded-none hover:bg-[#F3ECFF]"
          >
            Clear
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// Text Review Form
function TextReviewForm({ onAdd }: { onAdd: () => void }) {
  const [formData, setFormData] = useState({
    profilePhoto: '',
    name: '',
    designation: '',
    reviewText: ''
  });
  const handleProfilePhotoUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, profilePhoto: url }));
  };
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await addDoc(collection(db, "text_reviews"), {
        ...formData,
        createdAt: Date.now()
      });
      setFormData({ profilePhoto: '', name: '', designation: '', reviewText: '' });
      onAdd();
    } catch (error) {
      console.error("Error adding text review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="bg-white border border-[#1A0B2E]/10 rounded-2xl p-6 mb-6 shadow-sm"
    >
      <h3 className="text-lg font-bold text-[#1A0B2E] mb-4">Add New Text Review</h3>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-[#1A0B2E] mb-2">Reviewer's Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#1A0B2E]/10 rounded-lg text-[#1A0B2E] placeholder-[#1A0B2E]/40"
            placeholder="Jane Smith"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1A0B2E] mb-2">Designation</label>
          <input
            type="text"
            value={formData.designation}
            onChange={(e) => setFormData({...formData, designation: e.target.value})}
            className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#1A0B2E]/10 rounded-lg text-[#1A0B2E] placeholder-[#1A0B2E]/40"
            placeholder="CEO, TechCorp"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1A0B2E] mb-2">Profile Photo</label>
          <AssetUploader
            title="Profile Photo"
            description="Upload a local image for the reviewer."
            firestoreField={"profilePhoto"}
            storagePath={"text-reviews/profile-photos"}
            onUpload={handleProfilePhotoUpload}
          />
          {formData.profilePhoto && (
            <Image
              src={formData.profilePhoto}
              alt="Reviewer"
              width={80}
              height={80}
              className="mt-2 w-20 h-20 rounded-full object-cover border border-[#1A0B2E]/10"
              sizes="80px"
              placeholder="blur"
              blurDataURL="/placeholder-blur.png"
              loading="lazy"
            />
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-[#1A0B2E] mb-2">Review Text</label>
          <textarea
            value={formData.reviewText}
            onChange={(e) => setFormData({...formData, reviewText: e.target.value})}
            className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#1A0B2E]/10 rounded-lg text-[#1A0B2E] placeholder-[#1A0B2E]/40 resize-none"
            rows={4}
            placeholder="Share their experience with your coaching..."
            required
          />
        </div>
        <div className="md:col-span-2 flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-[#D4AF37] text-[#1A0B2E] px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {submitting ? 'Adding...' : 'Add Review'}
          </button>
          <button
            type="button"
            onClick={() => setFormData({ profilePhoto: '', name: '', designation: '', reviewText: '' })}
            className="px-6 py-2 border border-[#1A0B2E]/10 text-[#1A0B2E] rounded-lg hover:bg-[#F3ECFF]"
          >
            Clear
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// Video Testimonial Card
function VideoTestimonialCard({ testimonial, onRefresh }: { 
  testimonial: VideoTestimonial; 
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(testimonial);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "video_testimonials", testimonial.id), formData);
      setEditing(false);
      onRefresh();
    } catch (error) {
      console.error("Error updating testimonial:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await deleteDoc(doc(db, "video_testimonials", testimonial.id));
        onRefresh();
      } catch (error) {
        console.error("Error deleting testimonial:", error);
      }
    }
  };

  return (
    <motion.div
      layout
      className="relative bg-white border border-[#1A0B2E]/10 rounded-2xl p-6 shadow-sm"
    >
      <Quote className="absolute right-6 top-6 w-16 h-16 text-[#D4AF37]/10 opacity-20 pointer-events-none z-0" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#F8F9FA] rounded-full flex items-center justify-center border border-[#1A0B2E]/10">
            {testimonial.personPhoto ? (
              <Image
                src={testimonial.personPhoto}
                alt={testimonial.name}
                width={80}
                height={80}
                className="w-full h-full rounded-full object-cover"
                sizes="80px"
                placeholder="blur"
                blurDataURL="/placeholder-blur.png"
                loading="lazy"
              />
            ) : (
              <User className="text-[#D4AF37] w-8 h-8" />
            )}
          </div>
          <div>
            <h4 className="font-bold uppercase text-[#1A0B2E]">{testimonial.name}</h4>
            <p className="text-xs font-bold uppercase text-[#1A0B2E]/40 tracking-wider">Video Testimonial</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="p-2 text-[#1A0B2E]/40 hover:text-[#1A0B2E]"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-400 hover:text-red-300"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#D4AF37] mb-2">YouTube Link</label>
            <input
              type="url"
              value={formData.youtubeLink}
              onChange={(e) => setFormData({...formData, youtubeLink: e.target.value})}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#1A0B2E]/10 rounded-lg text-[#1A0B2E]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-[#D4AF37] mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#1A0B2E]/10 rounded-lg text-[#1A0B2E]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-[#D4AF37] mb-2">Photo URL</label>
            <input
              type="url"
              value={formData.personPhoto}
              onChange={(e) => setFormData({...formData, personPhoto: e.target.value})}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#1A0B2E]/10 rounded-lg text-[#1A0B2E]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-[#D4AF37] mb-2">Text</label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({...formData, text: e.target.value})}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#1A0B2E]/10 rounded-lg text-[#1A0B2E] resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-4">
            <button onClick={handleUpdate} className="bg-[#4B2E83] text-white px-4 py-2 font-bold rounded-none border border-[#4B2E83] transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#4B2E83]">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="border border-[#4B2E83] text-[#4B2E83] px-4 py-2 font-bold rounded-none transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#4B2E83]">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-[#1A0B2E] text-base">{testimonial.text}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-[#1A0B2E]/70">
            <Youtube size={16} />
            <span>{testimonial.youtubeLink}</span>
          </div>
        </>
      )}
    </motion.div>
  );
}

// Text Review Card
function TextReviewCard({ review, onRefresh }: { 
  review: TextReview; 
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(review);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "text_reviews", review.id), formData);
      setEditing(false);
      onRefresh();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteDoc(doc(db, "text_reviews", review.id));
        onRefresh();
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  return (
    <motion.div
      layout
      className="relative bg-white border border-[#1A0B2E]/10 rounded-2xl p-6 shadow-sm"
    >
      <Quote className="absolute right-6 top-6 w-16 h-16 text-[#D4AF37]/10 opacity-20 pointer-events-none z-0" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#F8F9FA] rounded-full flex items-center justify-center border border-[#1A0B2E]/10">
            {review.profilePhoto ? (
              <Image
                src={review.profilePhoto}
                alt={review.name}
                width={80}
                height={80}
                className="w-full h-full rounded-full object-cover"
                sizes="80px"
                placeholder="blur"
                blurDataURL="/placeholder-blur.png"
                loading="lazy"
              />
            ) : (
              <ImageIcon className="text-[#D4AF37] w-8 h-8" />
            )}
          </div>
          <div>
            <h4 className="font-bold uppercase text-[#1A0B2E]">{review.name}</h4>
            <p className="text-xs font-bold uppercase text-[#1A0B2E]/40 tracking-wider">{review.designation}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="p-2 text-[#1A0B2E]/40 hover:text-[#1A0B2E]"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-400 hover:text-red-300"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#D4AF37] mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#1A0B2E]/10 rounded-lg text-[#1A0B2E]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-[#D4AF37] mb-2">Designation</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({...formData, designation: e.target.value})}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#1A0B2E]/10 rounded-lg text-[#1A0B2E]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-[#D4AF37] mb-2">Photo URL</label>
            <input
              type="url"
              value={formData.profilePhoto}
              onChange={(e) => setFormData({...formData, profilePhoto: e.target.value})}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#1A0B2E]/10 rounded-lg text-[#1A0B2E]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-[#D4AF37] mb-2">Review Text</label>
            <textarea
              value={formData.reviewText}
              onChange={(e) => setFormData({...formData, reviewText: e.target.value})}
              className="w-full px-3 py-2 bg-[#F8F9FA] border border-[#1A0B2E]/10 rounded-lg text-[#1A0B2E] resize-none"
              rows={4}
            />
          </div>
          <div className="flex gap-4">
            <button onClick={handleUpdate} className="bg-[#D4AF37] text-[#1A0B2E] px-4 py-2 rounded-lg font-semibold">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="border border-[#1A0B2E]/10 text-[#1A0B2E] px-4 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-[#1A0B2E] text-base">
          <p>{review.reviewText}</p>
        </div>
      )}
    </motion.div>
  );
}