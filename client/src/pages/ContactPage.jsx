import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notification } from 'antd';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  Headphones,
  FileQuestion,
  Sparkles,
  ChevronDown,
  Shield,
  AlertTriangle,
  ArrowRight,
  Radio,
  Building2,
} from 'lucide-react';

const CONTACT_INFO = [
  {
    icon: Mail,
    title: 'Email Support',
    detail: 'support@civiclink.org',
    sub: 'Replies within 2 hours',
    href: 'mailto:support@civiclink.org',
    badge: 'Fast Response',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    icon: Phone,
    title: 'Toll-Free Helpline',
    detail: '1800-CIVIC-ALERT',
    sub: 'Mon–Sat, 8 AM – 8 PM IST',
    href: 'tel:18002484225',
    badge: 'Toll Free',
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  },
  {
    icon: MapPin,
    title: 'Municipal Central HQ',
    detail: 'Civic Center, Zone 1',
    sub: 'Mumbai Metro, MH 400001',
    href: '#',
    badge: 'Walk-ins Welcome',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
  },
  {
    icon: Radio,
    title: '24/7 Emergency Line',
    detail: '+91 1800-CIVIC-911',
    sub: 'Immediate Hazard Crew Dispatch',
    href: 'tel:18002484911',
    badge: '24/7 Active',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
  },
];

const FAQS = [
  {
    q: 'How do I report a new civic hazard?',
    a: 'Go to the Report Issue page, upload a geo-tagged photo of the hazard (pothole, garbage, streetlight, etc.). Our Groq Vision AI will automatically detect the category, assign severity, and route it to the nearest municipal crew.',
    category: 'Reporting',
  },
  {
    q: 'How long does it take for a crew to fix my issue?',
    a: 'Critical safety hazards (e.g. road craters, open live wires) receive emergency dispatch within 1–2 hours. Standard maintenance tasks are typically resolved within 24–48 hours depending on ward capacity.',
    category: 'SLA & Timelines',
  },
  {
    q: 'How does Community Fix Verification work?',
    a: 'When field repair crews complete the work, they upload an "After-Fix" evidence photo. Local residents in the area can inspect the Before vs. After evidence on the Track page and vote to Confirm Fix or Dispute insufficient work.',
    category: 'Verification',
  },
  {
    q: 'What happens if duplicate issues are reported near each other?',
    a: 'Our Turf.js geospatial clustering engine automatically detects reports within a 75-meter radius. Instead of creating redundant tickets, it merges them, aggregates photo evidence, and boosts the priority for faster repair.',
    category: 'AI & Geo Engine',
  },
  {
    q: 'How do I follow up on my reported ticket status?',
    a: 'Simply visit the Track Issue page and search your Report ID (e.g. #CR-2026-5993) to view the live GPS timeline, assigned crew lead, and progress indicators in real-time.',
    category: 'Tracking',
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'pothole',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Validate Full Name
    if (!formData.name || formData.name.trim().length < 3) {
      notification.error({
        message: 'Invalid Full Name',
        description: 'Please provide your full name with at least 3 characters so our officers can address you properly.',
      });
      return;
    }

    // 2. Validate Email Address Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      notification.error({
        message: 'Invalid Email Address',
        description: 'Please enter a valid email address format (e.g. name@example.com) to receive our response.',
      });
      return;
    }

    // 3. Validate Subject
    if (!formData.subject || formData.subject.trim().length < 4) {
      notification.warning({
        message: 'Subject Line Too Brief',
        description: 'Please provide a clear subject line summarizing your inquiry (minimum 4 characters).',
      });
      return;
    }

    // 4. Validate Detailed Message
    if (!formData.message || formData.message.trim().length < 10) {
      notification.warning({
        message: 'Inquiry Message Incomplete',
        description: 'Please provide more details regarding your concern (minimum 10 characters required).',
      });
      return;
    }

    // Process Submission
    setIsSubmitting(true);
    const refCode = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      // Ant Design Success Notification
      notification.success({
        message: 'Message Dispatched to Municipal Desk',
        description: `Your inquiry has been logged under Reference #${refCode}. A ward coordinator will reply to ${formData.email} within 2 hours.`,
        duration: 6,
      });

      setFormData({
        name: '',
        email: '',
        topic: 'pothole',
        subject: '',
        message: '',
      });

      setTimeout(() => setSubmitted(false), 6000);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 antialiased">
      {/* ─── Hero Banner with Cinematic Urban Backdrop & Ambient Glow ─── */}
      <div className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-28 px-6 shadow-lg border-b border-emerald-900/30">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=80&auto=format"
            alt="Cityscape"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.4] contrast-[1.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/90 to-slate-950/90" />
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        {/* Ambient Glow Orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-emerald-500 blur-3xl pointer-events-none z-0"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-teal-500 blur-3xl pointer-events-none z-0"
        />

        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-100 mb-5 shadow-xs">
              <Headphones size={14} className="text-emerald-300" />
              <span>24/7 Municipal Helpdesk & Citizen Assistance</span>
            </div>

            <h1 className="font-primary text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              We're Here to Help Your Community
            </h1>

            <p className="text-emerald-100/80 text-sm sm:text-base max-w-[650px] mx-auto leading-relaxed">
              Have a question about your municipal report, ward response times, or community verification? Contact our field coordinators anytime.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ─── Main Workspace & Floating Cards ─── */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-12 relative z-20">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {CONTACT_INFO.map((info, idx) => {
            const IconComp = info.icon;
            return (
              <motion.a
                key={info.title}
                href={info.href}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md shadow-slate-200/40 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                      <IconComp size={18} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${info.badgeColor}`}>
                      {info.badge}
                    </span>
                  </div>

                  <h3 className="font-primary text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {info.title}
                  </h3>
                  <p className="text-xs font-bold text-emerald-700 mt-1 truncate">
                    {info.detail}
                  </p>
                </div>

                <p className="text-[11px] text-slate-400 font-medium mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span>{info.sub}</span>
                  <ArrowRight size={12} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </p>
              </motion.a>
            );
          })}
        </div>

        {/* ─── Form + Interactive FAQ Section ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-md shadow-slate-200/40"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-1">
                  <MessageSquare size={15} />
                  <span>Direct Citizen Channel</span>
                </div>
                <h2 className="font-primary text-xl sm:text-2xl font-black text-slate-900">
                  Send Us a Direct Message
                </h2>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-xl">
                Avg. Reply: 2 Hrs
              </span>
            </div>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-4 flex items-center gap-3 shadow-xs"
              >
                <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-xs">Message Dispatched Successfully!</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Our municipal coordination officer has received your inquiry and will follow up shortly.
                  </p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Gautam Doliya"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. citizen@gmail.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  >
                    <option value="pothole">🚗 Road Damage / Pothole</option>
                    <option value="garbage">🗑️ Garbage & Sanitation</option>
                    <option value="drainage">💧 Drainage & Sewage</option>
                    <option value="streetlight">💡 Streetlight & Power</option>
                    <option value="water">🚰 Water Supply & Pipe Leak</option>
                    <option value="general">📋 General System Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Subject Line <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief summary of your inquiry"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Detailed Message / Question <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide any ticket reference numbers, ward locations, or specific feedback..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none font-medium leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <Send size={15} />
                <span>Transmit Message to Municipal Desk</span>
              </button>
            </form>
          </motion.div>

          {/* Right FAQs & Emergency Card (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* FAQ Card */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-md shadow-slate-200/40">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-1">
                <FileQuestion size={15} />
                <span>Knowledge Center</span>
              </div>
              <h2 className="font-primary text-xl font-black text-slate-900 mb-4">
                Frequently Answered Questions
              </h2>

              <div className="space-y-2.5">
                {FAQS.map((faq, i) => {
                  const isOpen = expandedFaq === i;
                  return (
                    <div
                      key={faq.q}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isOpen
                          ? 'bg-emerald-50/40 border-emerald-200/80 shadow-2xs'
                          : 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-100/70'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isOpen ? null : i)}
                        className="w-full flex items-center justify-between p-4 text-left cursor-pointer gap-3"
                      >
                        <span className="font-primary text-xs font-bold text-slate-900 leading-snug">
                          {faq.q}
                        </span>
                        <ChevronDown
                          size={15}
                          className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-emerald-600' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-4 pb-4 -mt-1 text-[11px] text-slate-600 leading-relaxed border-t border-emerald-100/60 pt-2"
                          >
                            {faq.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emergency 24/7 Escalation Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 text-white border border-slate-700/50 shadow-lg shadow-slate-900/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                  Critical Hazard Escalation
                </span>
              </div>

              <h3 className="font-primary text-lg font-bold text-white mb-1.5">
                Immediate Danger on the Road?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                For major water main bursts, fallen electric lines, or road collapse, dial our municipal rapid emergency unit directly.
              </p>

              <a
                href="tel:18002484911"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold border border-white/20 transition-all hover:scale-[1.01]"
              >
                <Phone size={14} className="text-emerald-400" />
                <span>Call Hotline: +91 1800-CIVIC-911</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
