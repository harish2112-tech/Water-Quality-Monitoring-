import React, { useState } from "react";
import {
  Mail,
  User,
  MessageSquare,
  Send,
  CircleCheck,
  CircleAlert,
  Info,
  CircleHelp
} from "lucide-react";
import supportService from "../services/supportService";

/**
 * Support Page Component
 * Allows users to contact the admin via a form.
 */
const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, sending, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      await supportService.submitContactForm(formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ocean-light/80 to-ocean-deep/90 border border-white/10 p-8 sm:p-12 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter">
              Support <span className="text-accent-gold">Center</span>
            </h1>
            <p className="text-primary-gray text-lg italic leading-relaxed">
              Have questions or need assistance? Our team is here to help you monitor and protect our water resources. Use the form below to reach out to the admin.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 rounded-full bg-accent-gold/10 flex items-center justify-center border border-accent-gold/20 animate-float">
              <CircleHelp className="text-6xl text-accent-gold" />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-ocean-glow/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-ocean-light/40 border border-white/5 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Info className="text-accent-gold" /> Quick Info
            </h3>
            <ul className="space-y-4 text-primary-gray">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0" />
                <span>Response time is usually within 24-48 hours.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0" />
                <span>For urgent technical issues, please mark the subject as [URGENT].</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0" />
                <span>Check the knowledge base before submitting a ticket.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-accent-gold/5 to-transparent border border-accent-gold/10">
            <h3 className="text-xl font-bold text-white mb-4">Email Us Directly</h3>
            <p className="text-primary-gray mb-4">You can also reach us at:</p>
            <a href="mailto:supportwaterwatch@gmail.com" className="text-accent-gold font-mono hover:underline flex items-center gap-2">
              <Mail /> supportwaterwatch@gmail.com
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="p-8 rounded-2xl bg-ocean-light/60 border border-white/10 shadow-xl backdrop-blur-sm">
            {status === "success" ? (
              <div className="py-12 flex flex-col items-center text-center space-y-6 animate-scaleIn">
                <div className="w-20 h-20 bg-safe/10 rounded-full flex items-center justify-center border border-safe/20">
                  <CircleCheck className="text-5xl text-safe" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-white uppercase italic">Message Sent!</h2>
                  <p className="text-primary-gray">Thank you for reaching out. We'll get back to you shortly.</p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-8 py-3 bg-ocean-light border border-white/10 text-white font-bold uppercase rounded-xl hover:bg-ocean-light/80 transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary-gray uppercase tracking-wider flex items-center gap-2">
                      <User className="text-accent-gold" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Eren Yaeger"
                      className="w-full bg-ocean-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-gold/50 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary-gray uppercase tracking-wider flex items-center gap-2">
                      <Mail className="text-accent-gold" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. eren@example.com"
                      className="w-full bg-ocean-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-gold/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-gray uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="text-accent-gold" /> Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Question about station data"
                    className="w-full bg-ocean-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-gold/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-gray uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="text-accent-gold" /> Message
                  </label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    placeholder="How can we help you today?"
                    className="w-full bg-ocean-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-gold/50 transition-all resize-none"
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-3 p-4 bg-critical/10 border border-critical/20 rounded-xl animate-shake">
                    <CircleAlert className="text-critical shrink-0 text-xl" />
                    <p className="text-critical text-sm font-medium">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={`w-full group relative flex items-center justify-center gap-3 px-8 py-4 bg-accent-gold text-ocean-deep font-black uppercase rounded-xl overflow-hidden transition-all shadow-xl shadow-accent-gold/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10 flex items-center gap-3">
                    {status === "sending" ? (
                      <>
                        <div className="w-5 h-5 border-2 border-ocean-deep border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
