import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Headphones,
  FileQuestion,
} from 'lucide-react';

const CONTACT_INFO = [
  {
    icon: <Mail size={22} />,
    title: 'Email Us',
    detail: 'support@civiclink.in',
    sub: 'We reply within 24 hours',
  },
  {
    icon: <Phone size={22} />,
    title: 'Call Us',
    detail: '+91 1800-CIVIC-00',
    sub: 'Mon-Sat, 9 AM - 6 PM',
  },
  {
    icon: <MapPin size={22} />,
    title: 'Visit Us',
    detail: 'Tech Park, Bengaluru',
    sub: 'Karnataka, India 560001',
  },
  {
    icon: <Clock size={22} />,
    title: 'Working Hours',
    detail: 'Mon - Sat',
    sub: '9:00 AM - 6:00 PM IST',
  },
];

const FAQS = [
  {
    q: 'How do I report an issue?',
    a: 'Navigate to the Report Issue page, select the category, fill in the details, add a photo and location, then submit.',
  },
  {
    q: 'How long does it take to resolve an issue?',
    a: 'Average resolution time is 3.2 days, though critical issues are prioritized and resolved within 24 hours.',
  },
  {
    q: 'Can I track my reported issue?',
    a: 'Yes! Use the Track Issue page with your Report ID to see real-time status updates and timeline.',
  },
  {
    q: 'Is CivicLink available in my city?',
    a: "We're currently available in 50+ cities across India and expanding rapidly. Check our coverage map for details.",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 py-16 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm text-white/90 font-medium mb-4">
            <Headphones size={16} />
            Get in Touch
          </div>
          <h1 className="font-primary text-4xl max-md:text-3xl font-extrabold text-white mb-3">
            Contact Us
          </h1>
          <p className="text-white/80 text-lg max-w-[600px] mx-auto">
            Have a question, suggestion, or need assistance? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-16">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-5 mb-16">
          {CONTACT_INFO.map((info) => (
            <div
              key={info.title}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
                {info.icon}
              </div>
              <h3 className="font-primary text-sm font-bold text-gray-900 mb-1">{info.title}</h3>
              <p className="text-sm font-semibold text-green-600">{info.detail}</p>
              <p className="text-xs text-gray-400 mt-1">{info.sub}</p>
            </div>
          ))}
        </div>

        {/* Form + FAQ */}
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-12">
          {/* Contact Form */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare size={20} className="text-green-600" />
              <h2 className="font-primary text-2xl font-extrabold text-gray-900">
                Send us a Message
              </h2>
            </div>

            {submitted && (
              <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <CheckCircle size={22} className="text-green-600 shrink-0" />
                <div>
                  <p className="font-semibold text-green-800">Message Sent!</p>
                  <p className="text-sm text-green-600">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all placeholder:text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all resize-none placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-green-600 text-white rounded-xl text-base font-bold hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>

          {/* FAQs */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <FileQuestion size={20} className="text-green-600" />
              <h2 className="font-primary text-2xl font-extrabold text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  >
                    <span className="text-sm font-semibold text-gray-800 pr-4">{faq.q}</span>
                    <span
                      className={`text-gray-400 transition-transform duration-200 shrink-0 ${
                        expandedFaq === i ? 'rotate-180' : ''
                      }`}
                    >
                      ▾
                    </span>
                  </button>
                  {expandedFaq === i && (
                    <div className="px-5 pb-5 -mt-2">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Support Card */}
            <div className="mt-8 bg-gradient-to-br from-green-700 to-emerald-600 rounded-2xl p-6 text-white">
              <h3 className="font-primary text-lg font-bold mb-2">Need Urgent Help?</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                For critical civic emergencies, contact our 24/7 hotline or visit the nearest
                municipal office.
              </p>
              <div className="flex items-center gap-2 bg-white/15 rounded-xl px-4 py-3">
                <Phone size={18} />
                <span className="font-bold">Emergency: +91 1800-CIVIC-911</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
