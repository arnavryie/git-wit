"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  CheckCircle2, 
  Send, 
  GraduationCap, 
  Star, 
  QrCode, 
  Download, 
  ArrowRight, 
  ExternalLink 
} from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function VisitFormPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    institutionType: "College / University (Undergraduate)",
    institutionName: "",
    department: "",
    githubUsername: "",
    experience: "Beginner / Just starting out",
    interests: [] as string[],
    rating: 5,
    favoriteFeatures: [] as string[],
    nextSteps: [] as string[],
    feedback: "",
  });

  const techOptions = [
    "Python",
    "JavaScript / TypeScript",
    "Web Dev (React / Next.js)",
    "AI / Machine Learning",
    "Mobile Apps (Flutter / Android)",
    "C / C++ / Java",
    "Cloud & DevOps",
    "Cybersecurity",
  ];

  const featureOptions = [
    "Personalized 'For You' Repo Feed",
    "Gemini AI Repo Summaries & Insights",
    "AI Developer Dossier Profile Card",
    "MongoDB Semantic Skill Matching",
    "Open Source Developer Communities",
  ];

  const nextStepOptions = [
    "Early Beta Access to GitWit",
    "Receive Workshop Slides & Starter Repos",
    "Apply as GitWit Campus Ambassador",
    "Join Developer Discord Community",
  ];

  const handleCheckboxToggle = (
    field: "interests" | "favoriteFeatures" | "nextSteps",
    value: string
  ) => {
    setFormData((prev) => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((item) => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error("Failed to submit to API", err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  // Generate a live QR code URL using quickchart QR API for instant scanning
  const currentUrl = typeof window !== "undefined" ? window.location.href : "https://gitwit.dev/visit";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=161b22&color=ffffff&margin=10`;

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#8957e5]/30">
      <div className="max-w-3xl mx-auto">
        
        {/* Top Actions: QR Code and Export */}
        <div className="flex items-center justify-between gap-3 mb-8">
          <Link
            href="/feed"
            className="text-xs text-[#7d8590] hover:text-white transition-colors flex items-center gap-1"
          >
            ← Back to GitWit
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQR(!showQR)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161b22] border border-[#30363d] hover:border-[#8b949e] text-xs font-medium text-[#e6edf3] transition-all"
            >
              <QrCode className="w-3.5 h-3.5 text-[#58a6ff]" />
              {showQR ? "Hide QR Code" : "Show QR for Students"}
            </button>
            <a
              href="/api/visit?format=csv"
              download="gitwit_visit_responses.csv"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-xs font-medium text-[#e6edf3] transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#2ea043]" />
              Download CSV
            </a>
          </div>
        </div>

        {/* QR Code Presentation Modal / Banner */}
        {showQR && (
          <div className="bg-[#161b22] border-2 border-[#58a6ff]/40 rounded-2xl p-6 mb-8 text-center shadow-2xl animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white mb-1">📱 Scan to Open on Phone</h3>
            <p className="text-xs text-[#7d8590] mb-4">Project this on the presentation screen during your visit</p>
            <div className="inline-block p-3 bg-[#0d1117] rounded-xl border border-[#30363d] mb-3">
              <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto rounded-lg" />
            </div>
            <p className="text-xs font-mono text-[#58a6ff] break-all">{currentUrl}</p>
          </div>
        )}

        {/* Header Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8957e5]/10 border border-[#8957e5]/30 text-[#8957e5] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Field Visit & Workshop
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            ⚔️ GitWit Campus Experience
          </h1>
          <p className="text-[#7d8590] text-sm sm:text-base max-w-xl mx-auto">
            The social intelligence platform for open-source developers. Fill out this 2-minute form for early access, workshop starter repos, and your AI Developer Dossier!
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 sm:p-12 text-center shadow-xl">
            <div className="w-16 h-16 bg-[#238636]/20 border border-[#238636]/40 rounded-full flex items-center justify-center mx-auto mb-6 text-[#2ea043]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">You're on the GitWit list!</h2>
            <p className="text-[#7d8590] text-sm mb-6 max-w-md mx-auto">
              Thank you for connecting with us during the visit. We’ve recorded your preferences and will send access & resources to <span className="text-[#58a6ff] font-medium">{formData.email}</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/feed"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-medium text-sm transition-all"
              >
                Explore GitWit Feed <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    institutionType: "College / University (Undergraduate)",
                    institutionName: "",
                    department: "",
                    githubUsername: "",
                    experience: "Beginner / Just starting out",
                    interests: [],
                    rating: 5,
                    favoriteFeatures: [],
                    nextSteps: [],
                    feedback: "",
                  });
                }}
                className="px-6 py-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] font-medium text-sm border border-[#30363d] transition-all"
              >
                Submit Another Response
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Attendee Information */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#30363d]">
                <GraduationCap className="w-5 h-5 text-[#58a6ff]" />
                <h2 className="text-lg font-semibold text-white">1. Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7d8590] mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#58a6ff] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7d8590] mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#58a6ff] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7d8590] mb-2">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#58a6ff] transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7d8590] mb-2">
                    Current Education Level <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.institutionType}
                    onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#58a6ff] transition-all"
                  >
                    <option value="School (Grade 9-12)">School (Grade 9–12)</option>
                    <option value="College / University (Undergraduate)">College / University (Undergraduate)</option>
                    <option value="College / University (Postgraduate)">College / University (Postgraduate)</option>
                    <option value="Faculty / Teacher / Mentor">Faculty / Teacher / Mentor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7d8590] mb-2">
                    School / College Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stanford University / Lincoln High"
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#58a6ff] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7d8590] mb-2">
                    Department / Stream & Year <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSE 2nd Year / 11th Grade"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#58a6ff] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Developer & Tech Profile */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#30363d]">
                <GithubIcon className="w-5 h-5 text-[#8957e5]" />
                <h2 className="text-lg font-semibold text-white">2. Developer & Tech Profile</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7d8590] mb-2">
                    GitHub Username (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#7d8590] text-sm">github.com/</span>
                    <input
                      type="text"
                      placeholder="octocat"
                      value={formData.githubUsername}
                      onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                      className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl pl-28 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8957e5] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7d8590] mb-2">
                    Coding Experience Level <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      "Beginner / Just starting out",
                      "Intermediate (Built a few projects)",
                      "Advanced (Active contributor / Dev)",
                      "Non-coder / Curious learner"
                    ].map((level) => (
                      <label
                        key={level}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                          formData.experience === level
                            ? "bg-[#8957e5]/10 border-[#8957e5] text-white"
                            : "bg-[#0d1117] border-[#30363d] text-[#7d8590] hover:border-[#8b949e]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="experience"
                          checked={formData.experience === level}
                          onChange={() => setFormData({ ...formData, experience: level })}
                          className="accent-[#8957e5]"
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7d8590] mb-2">
                    Technologies & Interests
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {techOptions.map((tech) => {
                      const isSelected = formData.interests.includes(tech);
                      return (
                        <button
                          type="button"
                          key={tech}
                          onClick={() => handleCheckboxToggle("interests", tech)}
                          className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                            isSelected
                              ? "bg-[#58a6ff]/15 border-[#58a6ff] text-[#58a6ff] font-medium"
                              : "bg-[#0d1117] border-[#30363d] text-[#7d8590] hover:border-[#8b949e]"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {tech}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Visit Feedback & GitWit Features */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#30363d]">
                <Star className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">3. Visit Feedback & Favorites</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7d8590] mb-2">
                    Rate Today's GitWit Session
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setFormData({ ...formData, rating: num })}
                        className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center text-sm font-bold transition-all ${
                          formData.rating >= num
                            ? "bg-amber-400/15 border-amber-400/50 text-amber-300"
                            : "bg-[#0d1117] border-[#30363d] text-[#7d8590]"
                        }`}
                      >
                        <Star className={`w-4 h-4 ${formData.rating >= num ? "fill-amber-400 text-amber-400" : ""}`} />
                        <span>{num}</span>
                      </button>
                    ))}
                    <span className="text-xs text-[#7d8590] ml-2">
                      {formData.rating === 5 ? "🔥 Amazing!" : formData.rating >= 4 ? "👍 Great" : "👌 Good"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7d8590] mb-2">
                    Features You Found Most Interesting
                  </label>
                  <div className="space-y-2">
                    {featureOptions.map((feat) => {
                      const isSelected = formData.favoriteFeatures.includes(feat);
                      return (
                        <label
                          key={feat}
                          onClick={() => handleCheckboxToggle("favoriteFeatures", feat)}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[#8957e5]/15 border-[#8957e5] text-white font-medium"
                              : "bg-[#0d1117] border-[#30363d] text-[#7d8590] hover:border-[#8b949e]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="accent-[#8957e5]"
                          />
                          {feat}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7d8590] mb-2">
                    What would you like to get?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {nextStepOptions.map((step) => {
                      const isSelected = formData.nextSteps.includes(step);
                      return (
                        <label
                          key={step}
                          onClick={() => handleCheckboxToggle("nextSteps", step)}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[#238636]/15 border-[#238636] text-white font-medium"
                              : "bg-[#0d1117] border-[#30363d] text-[#7d8590] hover:border-[#8b949e]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="accent-[#238636]"
                          />
                          {step}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7d8590] mb-2">
                    Questions, Ideas, or Feedback
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us what you'd love to see in GitWit or topics for future workshops..."
                    value={formData.feedback}
                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#58a6ff] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#8957e5] to-[#58a6ff] hover:opacity-95 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#8957e5]/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Registration & Get Beta Access
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
