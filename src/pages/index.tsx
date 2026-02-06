import React from "react";
import { Page, Box, Text, Button, Icon, useNavigate } from "zmp-ui";
import Header from "@/components/header";

// Stats data
const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "10K+", label: "Questions" },
  { value: "95%", label: "Pass Rate" },
  { value: "24/7", label: "Support" },
] as const;

// Features data
const features = [
  {
    icon: "zi-note",
    title: "Realistic Exams",
    desc: "Practice with questions that mirror the actual certification exams.",
    gradient: "from-orange-400 to-pink-500",
    bgGlow: "bg-orange-500/20",
  },
  {
    icon: "zi-poll",
    title: "Smart Analytics",
    desc: "Track your progress and identify weak areas instantly.",
    gradient: "from-cyan-400 to-blue-500",
    bgGlow: "bg-cyan-500/20",
  },
  {
    icon: "zi-clock-1",
    title: "Timed Practice",
    desc: "Build exam confidence with realistic time constraints.",
    gradient: "from-green-400 to-emerald-500",
    bgGlow: "bg-green-500/20",
  },
  {
    icon: "zi-check-circle",
    title: "Expert Explanations",
    desc: "Deep-dive into every answer with detailed walkthroughs.",
    gradient: "from-violet-400 to-purple-500",
    bgGlow: "bg-violet-500/20",
  },
  {
    icon: "zi-calendar",
    title: "Daily Updates",
    desc: "Fresh questions added regularly to keep you prepared.",
    gradient: "from-amber-400 to-orange-500",
    bgGlow: "bg-amber-500/20",
  },
  {
    icon: "zi-user-circle",
    title: "Community",
    desc: "Join thousands of learners and share knowledge.",
    gradient: "from-rose-400 to-red-500",
    bgGlow: "bg-rose-500/20",
  },
] as const;

// Certifications data
const certifications = [
  {
    provider: "AWS",
    certs: ["Solutions Architect", "Developer Associate", "SysOps Admin"],
    color: "from-orange-400 to-amber-500",
    badge: "🔶",
  },
  {
    provider: "Azure",
    certs: ["AZ-900 Fundamentals", "AZ-104 Administrator", "AZ-204 Developer"],
    color: "from-blue-400 to-cyan-500",
    badge: "🔷",
  },
  {
    provider: "Google Cloud",
    certs: ["Associate Cloud Engineer", "Professional Architect", "Data Engineer"],
    color: "from-red-400 to-yellow-500",
    badge: "🔴",
  },
] as const;

// Testimonials data
const testimonials = [
  {
    name: "Minh Nguyen",
    role: "Cloud Engineer @ FPT",
    avatar: "M",
    content: "Passed AWS SAA on my first attempt! The practice exams were incredibly accurate.",
    rating: 5,
  },
  {
    name: "Linh Tran",
    role: "DevOps Lead @ Viettel",
    avatar: "L",
    content: "The detailed explanations helped me understand concepts I struggled with for months.",
    rating: 5,
  },
  {
    name: "Duc Pham",
    role: "Junior Developer",
    avatar: "D",
    content: "Best investment for my career. Got certified in just 3 weeks of practice!",
    rating: 5,
  },
] as const;

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <Page className="bg-slate-900 flex flex-col min-h-screen">
      <Header />

      <Box className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <Box className="relative overflow-hidden px-6 pt-10 pb-12">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-cyan-500/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-20 right-0 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute top-40 left-0 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10">
            {/* Badge */}
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full px-4 py-1.5 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <Text className="text-cyan-300 text-xs font-medium">
                  2024's #1 Cloud Exam Platform
                </Text>
              </div>
            </div>

            {/* Main headline */}
            <Text.Title
              size="xLarge"
              className="text-center text-white mb-3 !text-3xl !font-black !leading-tight"
            >
              Master Cloud <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Certifications
              </span>
            </Text.Title>

            <Text className="text-center text-slate-400 mb-8 px-2 leading-relaxed">
              Join 50,000+ professionals who passed their AWS, Azure & GCP exams using our AI-powered practice platform.
            </Text>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <Button
                className="w-full !rounded-xl !py-3.5 !text-base !font-bold !bg-gradient-to-r !from-cyan-400 !to-blue-500 !border-0 !shadow-xl !shadow-cyan-500/25"
                size="large"
                onClick={() => navigate('/register')}
              >
                <Icon icon="zi-play" className="mr-2" />
                Start Free Trial
              </Button>
              <Button
                variant="tertiary"
                className="w-full !rounded-xl !py-3 !text-base !font-semibold !text-white !bg-white/5 !border !border-white/10"
                size="large"
              >
                Explore Exams
              </Button>
            </div>
          </div>
        </Box>

        {/* Stats Section */}
        <Box className="px-4 py-6">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="grid grid-cols-4 gap-2">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <Text className="text-cyan-400 font-black text-lg">
                    {stat.value}
                  </Text>
                  <Text className="text-slate-400 text-xs">{stat.label}</Text>
                </div>
              ))}
            </div>
          </div>
        </Box>

        {/* Features Section */}
        <Box className="px-4 py-8">
          <div className="text-center mb-6">
            <Text className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-2">
              Features
            </Text>
            <Text.Title className="text-white !text-xl !font-bold">
              Everything you need to pass
            </Text.Title>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="relative bg-slate-800/50 p-4 rounded-2xl border border-white/5 overflow-hidden group cursor-pointer transition-all duration-300 hover:border-white/20"
              >
                {/* Glow effect */}
                <div
                  className={`absolute -top-4 -right-4 w-20 h-20 ${feature.bgGlow} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`}
                ></div>

                <div className="relative z-10">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 shadow-lg`}
                  >
                    <Icon icon={feature.icon} className="text-white text-lg" />
                  </div>
                  <Text className="font-bold text-white text-sm mb-1">
                    {feature.title}
                  </Text>
                  <Text className="text-slate-400 text-xs leading-relaxed">
                    {feature.desc}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </Box>

        {/* Certifications Section */}
        <Box className="px-4 py-8">
          <div className="text-center mb-6">
            <Text className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-2">
              Certifications
            </Text>
            <Text.Title className="text-white !text-xl !font-bold">
              All major cloud platforms
            </Text.Title>
          </div>

          <div className="space-y-4">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 rounded-2xl border border-white/5 overflow-hidden"
              >
                {/* Header */}
                <div
                  className={`bg-gradient-to-r ${cert.color} p-4 flex items-center gap-3`}
                >
                  <span className="text-2xl">{cert.badge}</span>
                  <div>
                    <Text className="text-white font-bold text-lg">
                      {cert.provider}
                    </Text>
                    <Text className="text-white/80 text-xs">
                      {cert.certs.length} certifications available
                    </Text>
                  </div>
                </div>
                {/* Cert list */}
                <div className="p-3 space-y-2">
                  {cert.certs.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-slate-700/30 rounded-xl px-4 py-3 cursor-pointer hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon icon="zi-check-circle" className="text-green-400 text-sm" />
                        <Text className="text-slate-200 text-sm font-medium">
                          {c}
                        </Text>
                      </div>
                      <Icon icon="zi-chevron-right" className="text-slate-500" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Box>

        {/* Testimonials Section */}
        <Box className="px-4 py-8">
          <div className="text-center mb-6">
            <Text className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-2">
              Testimonials
            </Text>
            <Text.Title className="text-white !text-xl !font-bold">
              Loved by professionals
            </Text.Title>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="min-w-[280px] bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-white/10 rounded-2xl p-5 snap-center"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Icon
                      key={i}
                      icon="zi-star"
                      className="text-yellow-400 text-sm"
                    />
                  ))}
                </div>
                {/* Quote */}
                <Text className="text-slate-300 text-sm leading-relaxed mb-4">
                  "{t.content}"
                </Text>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <Text className="text-white font-semibold text-sm">
                      {t.name}
                    </Text>
                    <Text className="text-slate-400 text-xs">{t.role}</Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Box>

        {/* Final CTA Section */}
        <Box className="px-4 py-10 mb-8">
          <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-3xl p-6 text-center overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-cyan-400/30 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <Text.Title className="text-white !text-xl !font-bold mb-2">
                Start your journey today
              </Text.Title>
              <Text className="text-slate-300 text-sm mb-6">
                Get access to 10,000+ questions across AWS, Azure & GCP.
              </Text>
              <Button
                className="!rounded-xl !py-3 !px-8 !text-base !font-bold !bg-white !text-slate-900 !border-0 !shadow-xl"
                size="large"
                onClick={() => navigate('/register')}
              >
                Get Started — It's Free
              </Button>
            </div>
          </div>
        </Box>

        {/* Footer */}
        <Box className="px-6 py-6 border-t border-white/5">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <Text className="text-white font-semibold">CloudExam</Text>
          </div>
          <Text className="text-center text-slate-500 text-xs">
            © 2024 CloudExam. All rights reserved.
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default LandingPage;
