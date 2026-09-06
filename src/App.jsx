import React, { useState, useEffect } from 'react';
import {
  Droplet,
  Heart,
  Activity,
  MapPin,
  Clock,
  Shield,
  ShieldCheck,
  Radio,
  UserCheck,
  FileText,
  Menu,
  X,
  ChevronRight,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Send,
  Lock,
  ArrowRight,
  PhoneCall,
  Sparkles,
  Calendar,
  Share2,
  Users,
  Compass,
  Info,
  Layers,
  HeartHandshake
} from 'lucide-react';

export default function App() {
  // Navigation & Drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modals state
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  
  // Interactive Filter state for Live Alerts
  const [activeRegion, setActiveRegion] = useState('All');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');

  // Emergency Form State
  const [emergencyForm, setEmergencyForm] = useState({
    patientName: '',
    bloodGroup: 'O-',
    units: 2,
    hospital: '',
    zone: 'Khulna Central',
    urgency: 'Immediate (Next 1 hour)',
    notes: '',
    privacyMask: true,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Donor Registration Form State
  const [donorForm, setDonorForm] = useState({
    name: '',
    bloodGroup: 'O+',
    phone: '',
    zone: 'Khulna Metro',
    lastDonationDate: '',
    termsAccepted: true
  });
  const [donorRegistered, setDonorRegistered] = useState(false);

  // 120-Day Interactive Eligibility Checker State
  const [calcDate, setCalcDate] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState(null);

  // Simulated Live Active Requests Data
  const [alerts, setAlerts] = useState([
    {
      id: 'BM-2026-089',
      bloodGroup: 'O-Negative',
      code: 'O-',
      urgency: 'CRITICAL',
      location: 'Khulna Medical College Hospital',
      subLocation: 'ICU Block B, Ward 4',
      region: 'Khulna',
      zone: 'Zone K-1 (Radius 3.8 km)',
      status: 'Broadcasting to local donors...',
      time: 'Requested 10 mins ago',
      timeAgoMinutes: 10,
      unitsNeeded: 2,
      eligibleDonorsInRadius: 14,
      notifiedDonors: 12,
      donorResponses: 1,
      privacyProtected: true
    },
    {
      id: 'BM-2026-090',
      bloodGroup: 'A-Positive',
      code: 'A+',
      urgency: 'HIGH PRIORITY',
      location: 'Dhaka Medical College Hospital',
      subLocation: 'Emergency Trauma Center',
      region: 'Dhaka',
      zone: 'Zone D-3 (Radius 2.4 km)',
      status: 'Broadcasting to local donors...',
      time: 'Requested 18 mins ago',
      timeAgoMinutes: 18,
      unitsNeeded: 3,
      eligibleDonorsInRadius: 31,
      notifiedDonors: 28,
      donorResponses: 2,
      privacyProtected: true
    },
    {
      id: 'BM-2026-091',
      bloodGroup: 'B-Negative',
      code: 'B-',
      urgency: 'URGENT',
      location: 'Chattogram General Hospital',
      subLocation: 'Pediatric Surgery Unit',
      region: 'Chattogram',
      zone: 'Zone C-2 (Radius 4.5 km)',
      status: 'Broadcasting to local donors...',
      time: 'Requested 25 mins ago',
      timeAgoMinutes: 25,
      unitsNeeded: 1,
      eligibleDonorsInRadius: 8,
      notifiedDonors: 8,
      donorResponses: 0,
      privacyProtected: true
    },
    {
      id: 'BM-2026-092',
      bloodGroup: 'AB-Negative',
      code: 'AB-',
      urgency: 'CRITICAL',
      location: 'Rajshahi Medical College Hospital',
      subLocation: 'Cardiology OT',
      region: 'Rajshahi',
      zone: 'Zone R-1 (Radius 3.2 km)',
      status: 'Broadcasting to local donors...',
      time: 'Requested 34 mins ago',
      timeAgoMinutes: 34,
      unitsNeeded: 2,
      eligibleDonorsInRadius: 6,
      notifiedDonors: 6,
      donorResponses: 1,
      privacyProtected: true
    }
  ]);

  // Live simulation ticker
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickerEvents = [
    "⚡ System pinged 14 eligible donors for O- request in Khulna (Zone K-1)",
    "🔒 Donor BM-9821 accepted request for Dhaka Medical College • Phone masked via proxy",
    "🛡️ 120-day rule automatically filtered 4 ineligible donors in Chattogram",
    "✨ New donor registered in Khulna Metro Zone • Eligibility verified"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerEvents.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [tickerEvents.length]);

  // Handle 120-Day Rule Calculation
  const checkEligibility = (dateString) => {
    setCalcDate(dateString);
    if (!dateString) {
      setEligibilityResult(null);
      return;
    }
    const donation = new Date(dateString);
    const today = new Date();
    const diffTime = today - donation;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 120) {
      setEligibilityResult({
        eligible: true,
        daysPast: diffDays,
        message: `Eligible! It has been ${diffDays} days since your last donation (Requirement: 120 days). Your body has fully replenished red blood cells.`
      });
    } else {
      const daysLeft = 120 - diffDays;
      const nextEligibleDate = new Date(donation);
      nextEligibleDate.setDate(donation.getDate() + 120);
      setEligibilityResult({
        eligible: false,
        daysLeft,
        nextDate: nextEligibleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        message: `Not yet eligible. ${daysLeft} days remaining to satisfy the medical 120-day recovery rule. You will be eligible on ${nextEligibleDate.toLocaleDateString()}.`
      });
    }
  };

  // Filtered alerts based on region & blood group
  const filteredAlerts = alerts.filter(alert => {
    const matchesRegion = activeRegion === 'All' || alert.region === activeRegion;
    const matchesBlood = selectedBloodGroup === 'All' || alert.code === selectedBloodGroup;
    return matchesRegion && matchesBlood;
  });

  const handleEmergencySubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    const newAlert = {
      id: `BM-2026-${Math.floor(100 + Math.random() * 900)}`,
      bloodGroup: emergencyForm.bloodGroup === 'O-' ? 'O-Negative' : emergencyForm.bloodGroup === 'A+' ? 'A-Positive' : `${emergencyForm.bloodGroup}`,
      code: emergencyForm.bloodGroup,
      urgency: 'CRITICAL',
      location: emergencyForm.hospital || 'Khulna Medical College Hospital',
      subLocation: 'Emergency Department',
      region: 'Khulna',
      zone: `${emergencyForm.zone} (Radius 3.0 km)`,
      status: 'Broadcasting to local donors...',
      time: 'Requested Just Now',
      timeAgoMinutes: 0,
      unitsNeeded: emergencyForm.units,
      eligibleDonorsInRadius: 18,
      notifiedDonors: 18,
      donorResponses: 0,
      privacyProtected: emergencyForm.privacyMask
    };
    setTimeout(() => {
      setAlerts([newAlert, ...alerts]);
      setFormSubmitted(false);
      setRequestModalOpen(false);
      setSelectedAlert(newAlert);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT & LIVE PULSE BANNER */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white text-xs sm:text-sm py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              ROUTING ENGINE ACTIVE
            </span>
            <span className="hidden md:inline text-red-100 text-xs truncate max-w-lg">
              {tickerEvents[tickerIndex]}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-xs font-medium">
            <span className="hidden sm:inline-flex items-center gap-1 text-red-100">
              <ShieldCheck className="w-3.5 h-3.5 text-red-200" />
              120-Day Medical Filter: Online
            </span>
            <button
              onClick={() => setRequestModalOpen(true)}
              className="bg-white text-red-700 hover:bg-red-50 font-bold px-2.5 py-0.5 rounded text-xs transition shadow-sm inline-flex items-center gap-1"
            >
              <AlertTriangle className="w-3 h-3 text-red-600" />
              Emergency SOS
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. NAVIGATION BAR (STICKY) */}
      {/* ========================================================================= */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <a href="#" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition duration-200">
                  <div className="relative">
                    <Droplet className="w-6 h-6 fill-white text-white" />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
                      Blood<span className="text-red-600">Mesh</span>
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 rounded">
                      v2.4
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium tracking-wide hidden sm:block">
                    Proximity Emergency Routing
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <a
                href="#home"
                className="px-3.5 py-2 text-sm font-medium text-gray-900 hover:text-red-600 rounded-lg transition"
              >
                Home
              </a>
              <a
                href="#active-alerts"
                className="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-red-600 rounded-lg transition flex items-center gap-1.5"
              >
                Active Alerts
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {alerts.length}
                </span>
              </a>
              <a
                href="#how-it-works"
                className="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-red-600 rounded-lg transition"
              >
                How It Works
              </a>
              <a
                href="#eligibility"
                className="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-red-600 rounded-lg transition flex items-center gap-1"
              >
                120-Day Rule
              </a>
              <a
                href="#zones"
                className="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-red-600 rounded-lg transition"
              >
                Geo Zones
              </a>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => setLoginModalOpen(true)}
                className="px-3.5 py-2 text-sm font-semibold text-gray-700 hover:text-red-600 transition"
              >
                Login
              </button>
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="px-4 py-2 text-sm font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition shadow-xs"
              >
                Register
              </button>
              <button
                onClick={() => setRequestModalOpen(true)}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition shadow-md shadow-red-600/25 flex items-center gap-1.5"
              >
                <Droplet className="w-4 h-4 fill-white" />
                Request Blood
              </button>
            </div>

            {/* Mobile Menu Hamburger Button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setRequestModalOpen(true)}
                className="px-2.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-md transition shadow-xs flex items-center gap-1"
              >
                <Droplet className="w-3.5 h-3.5 fill-white" />
                SOS
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-gray-200 bg-white px-4 pt-3 pb-6 shadow-xl space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="grid grid-cols-1 gap-1">
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-semibold text-gray-900 hover:bg-red-50 hover:text-red-600"
              >
                Home
              </a>
              <a
                href="#active-alerts"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center justify-between"
              >
                <span>Active Alerts</span>
                <span className="px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded-full">
                  {alerts.length} Live
                </span>
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                How It Works
              </a>
              <a
                href="#eligibility"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                120-Day Eligibility Check
              </a>
              <a
                href="#zones"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                Geographic Zones
              </a>
            </div>

            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="w-full py-2.5 text-sm font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setRegisterModalOpen(true);
                  }}
                  className="w-full py-2.5 text-sm font-bold text-gray-800 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-center"
                >
                  Register Donor
                </button>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setRequestModalOpen(true);
                }}
                className="w-full py-3 text-sm font-extrabold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md shadow-red-600/30 flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Request Emergency Blood
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ========================================================================= */}
      {/* 3. HERO SECTION */}
      {/* ========================================================================= */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-b from-white via-red-50/30 to-gray-50 pt-10 pb-16 md:pt-16 md:pb-24">
        
        {/* Subtle decorative background grid / radial gradients */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Security & Algorithm Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 border border-red-200 text-red-800 text-xs sm:text-sm font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                <span>Proximity-Based Blood Donor Routing Network</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                Automated Blood Routing for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-600 to-rose-700">
                  Medical Emergencies.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Stop calling manually. Our algorithm instantly finds and notifies eligible, nearby blood donors in seconds. Safe, secure, and privacy-first.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                
                {/* Primary CTA (Large, Red with Pulse Animation on Hover) */}
                <button
                  onClick={() => setRequestModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 text-base sm:text-lg font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-600/35 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  <Droplet className="w-5 h-5 fill-white group-hover:animate-bounce" />
                  <span>Request Blood Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>

                {/* Secondary CTA (Outline/White) */}
                <button
                  onClick={() => setRegisterModalOpen(true)}
                  className="w-full sm:w-auto px-7 py-4 text-base sm:text-lg font-bold text-gray-800 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-red-300 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2.5"
                >
                  <Heart className="w-5 h-5 text-red-600 fill-red-50" />
                  <span>Register as Donor</span>
                </button>
              </div>

              {/* Micro-Badges / Trust Metrics */}
              <div className="pt-6 border-t border-gray-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div className="bg-white/80 backdrop-blur-xs p-3 rounded-lg border border-gray-100 shadow-2xs">
                  <div className="text-xl font-extrabold text-red-600">&lt; 45s</div>
                  <div className="text-xs text-gray-500 font-medium">Algorithmic Match</div>
                </div>
                <div className="bg-white/80 backdrop-blur-xs p-3 rounded-lg border border-gray-100 shadow-2xs">
                  <div className="text-xl font-extrabold text-gray-900">120-Day</div>
                  <div className="text-xs text-gray-500 font-medium">Safety Enforced</div>
                </div>
                <div className="bg-white/80 backdrop-blur-xs p-3 rounded-lg border border-gray-100 shadow-2xs">
                  <div className="text-xl font-extrabold text-gray-900">100%</div>
                  <div className="text-xs text-gray-500 font-medium">Privacy Proxied</div>
                </div>
                <div className="bg-white/80 backdrop-blur-xs p-3 rounded-lg border border-gray-100 shadow-2xs">
                  <div className="text-xl font-extrabold text-emerald-600">99.2%</div>
                  <div className="text-xs text-gray-500 font-medium">Response Rate</div>
                </div>
              </div>

            </div>

            {/* Right Interactive Radar & Algorithm Simulation Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl p-6 shadow-xl border border-gray-200/80 overflow-hidden">
                
                {/* Header of Simulated Dispatcher */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600 animate-ping"></div>
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Mesh Routing Radar
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <Radio className="w-3 h-3" /> Live Dispatch
                  </span>
                </div>

                {/* Radar Visual Area */}
                <div className="relative my-6 h-56 w-full rounded-xl bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 flex items-center justify-center overflow-hidden border border-gray-800 shadow-inner">
                  
                  {/* Concentric Zone Rings */}
                  <div className="absolute w-44 h-44 rounded-full border border-red-500/20"></div>
                  <div className="absolute w-32 h-32 rounded-full border border-red-500/30"></div>
                  <div className="absolute w-20 h-20 rounded-full border border-red-500/40"></div>
                  <div className="absolute w-8 h-8 rounded-full bg-red-500/20 animate-ping"></div>
                  
                  {/* Center Hospital Beacon */}
                  <div className="relative z-20 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/50 border-2 border-white">
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>

                  {/* Simulated Donors in Radius with status tags */}
                  {/* Donor 1: Eligible & Pinged */}
                  <div className="absolute top-8 left-12 z-20 flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/60 px-2 py-0.5 rounded-full text-[10px] text-emerald-300 font-mono shadow-md animate-bounce">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    O- (0.8km • 120d ✓)
                  </div>

                  {/* Donor 2: Locked / Accepted */}
                  <div className="absolute bottom-10 right-10 z-20 flex items-center gap-1 bg-red-950/90 border border-red-500 px-2 py-0.5 rounded-full text-[10px] text-red-200 font-mono shadow-lg">
                    <CheckCircle2 className="w-3 h-3 text-red-400" />
                    O- (Accepted • 1.4km)
                  </div>

                  {/* Donor 3: Filtered out by 120-day rule */}
                  <div className="absolute top-12 right-12 z-20 flex items-center gap-1 bg-gray-900/80 border border-gray-700 px-2 py-0.5 rounded-full text-[10px] text-gray-400 font-mono line-through opacity-70">
                    O+ (84d ago ✕)
                  </div>

                  {/* Scanning line */}
                  <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-red-500/50 to-transparent top-1/2 -translate-y-1/2 animate-pulse"></div>
                  
                  <div className="absolute bottom-2 left-3 text-[10px] font-mono text-gray-400">
                    Zone: Khulna Medical [22.8456° N, 89.5403° E]
                  </div>
                </div>

                {/* Radar Status Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      Active Search Radius:
                    </span>
                    <span className="font-bold text-gray-900">4.0 km (Micro-Zone 1)</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-red-500" />
                      120-Day Rule Audit:
                    </span>
                    <span className="font-bold text-emerald-600">Auto-Filtered 100%</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-red-500" />
                      Privacy Mode:
                    </span>
                    <span className="font-bold text-gray-900">Zero Direct Contact Leak</span>
                  </div>
                </div>

                {/* Quick Interactive Button */}
                <button
                  onClick={() => setRequestModalOpen(true)}
                  className="mt-4 w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg transition text-xs flex items-center justify-center gap-1.5 border border-red-200"
                >
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  Test Live Emergency Broadcast
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. LIVE EMERGENCY ALERTS (DYNAMIC CARD SECTION) */}
      {/* ========================================================================= */}
      <section id="active-alerts" className="py-16 md:py-20 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold mb-2">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                Live Network Feed
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                Active Requests in Your Region
              </h2>
              <p className="text-sm sm:text-base text-gray-500 mt-1 max-w-xl">
                Real-time emergency blood broadcasts currently searching for verified, eligible donors within geographic zones.
              </p>
            </div>

            {/* Region Filter Buttons */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-semibold text-gray-500 mr-1 hidden sm:inline">Region:</span>
              {['All', 'Khulna', 'Dhaka', 'Chattogram', 'Rajshahi'].map(region => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    activeRegion === region
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Blood Group Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-4 text-xs font-semibold">
            <span className="text-gray-400 font-medium whitespace-nowrap mr-2">Filter Group:</span>
            {['All', 'O-', 'A+', 'B-', 'AB-', 'O+', 'A-', 'B+', 'AB+'].map(bg => (
              <button
                key={bg}
                onClick={() => setSelectedBloodGroup(bg)}
                className={`px-2.5 py-1 rounded-md transition whitespace-nowrap ${
                  selectedBloodGroup === bg
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>

          {/* Cards Grid: 3-4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlerts.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800">No active alerts matching your filters</h3>
                <p className="text-xs text-gray-500 mt-1">All current emergency requests in this zone have been fulfilled.</p>
                <button
                  onClick={() => { setActiveRegion('All'); setSelectedBloodGroup('All'); }}
                  className="mt-3 text-xs font-bold text-red-600 hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="relative bg-white rounded-2xl border border-gray-200 hover:border-red-300 p-6 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                >
                  {/* Top Bar of Card */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      
                      {/* Blood Group (Bold Red Badge) */}
                      <div className="flex items-center gap-2">
                        <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white font-extrabold text-base tracking-wide shadow-sm shadow-red-500/20 flex items-center gap-1.5">
                          <Droplet className="w-4 h-4 fill-white" />
                          <span>{alert.bloodGroup}</span>
                        </div>
                        <span className="text-[10px] font-extrabold px-2 py-1 rounded bg-red-100 text-red-700 uppercase tracking-wider">
                          {alert.unitsNeeded} {alert.unitsNeeded > 1 ? 'Units' : 'Unit'}
                        </span>
                      </div>

                      {/* Request ID & Urgency */}
                      <div className="text-right">
                        <span className="inline-block text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                          {alert.urgency}
                        </span>
                        <div className="text-[10px] font-mono text-gray-400 mt-1">
                          {alert.id}
                        </div>
                      </div>
                    </div>

                    {/* Hospital & Location */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition">
                            {alert.location}
                          </h3>
                          <p className="text-xs text-gray-500 font-medium">
                            {alert.subLocation} • <span className="text-gray-700">{alert.zone}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dispatch & Algorithm Status Info */}
                    <div className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100 mb-5">
                      
                      {/* Status: "Broadcasting to local donors..." with pulsing green dot */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium">Network Status:</span>
                        <span className="flex items-center gap-1.5 font-bold text-gray-800">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          <span className="text-emerald-700">{alert.status}</span>
                        </span>
                      </div>

                      {/* Time: "Requested 10 mins ago" */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium">Broadcast Time:</span>
                        <span className="flex items-center gap-1 text-gray-700 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {alert.time}
                        </span>
                      </div>

                      {/* Proximity Stats */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-200/60">
                        <span className="text-gray-500 font-medium">Eligible Donors Pinged:</span>
                        <span className="font-bold text-gray-900">
                          {alert.eligibleDonorsInRadius} Verified Donors
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAlert(alert)}
                      className="flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition shadow-sm shadow-red-600/20 flex items-center justify-center gap-1.5"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      Respond as Donor
                    </button>
                    <button
                      onClick={() => setSelectedAlert(alert)}
                      className="py-2.5 px-3 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                      title="View Routing Details"
                    >
                      Details
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Bottom Alert Action Banner */}
          <div className="mt-10 p-5 bg-gradient-to-r from-red-50 to-white rounded-2xl border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Are you an eligible donor in any of these zones?
                </h4>
                <p className="text-xs text-gray-600">
                  Enable emergency proximity push notifications to receive immediate alerts when someone needs your blood group.
                </p>
              </div>
            </div>
            <button
              onClick={() => setRegisterModalOpen(true)}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-red-700 bg-white hover:bg-red-100 border border-red-300 rounded-xl transition shadow-2xs whitespace-nowrap"
            >
              Join Donor Mesh
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS (FEATURES SECTION - 4 COLUMNS) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Algorithmic Protocol
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              How BloodMesh Works
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              A high-speed, automated medical dispatch engine that replaces chaotic social media calls with cryptographic, proximity-based matching.
            </p>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="relative bg-white rounded-2xl p-6 shadow-xs border border-gray-200/90 flex flex-col justify-between hover:shadow-md hover:border-red-300 transition duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-xs">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-gray-200 font-mono">01</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Log Request
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  User or hospital submits emergency details, blood group, required units, and geo-verified hospital coordinates.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-semibold text-red-600 flex items-center gap-1">
                <span>Instant dispatch trigger</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white rounded-2xl p-6 shadow-xs border border-gray-200/90 flex flex-col justify-between hover:shadow-md hover:border-red-300 transition duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-gray-200 font-mono">02</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Algorithmic Filter
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  System automatically queries donor registry and applies the strict 120-day medical eligibility recovery rule.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-semibold text-red-600 flex items-center gap-1">
                <span>120-Day Safety Guard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white rounded-2xl p-6 shadow-xs border border-gray-200/90 flex flex-col justify-between hover:shadow-md hover:border-red-300 transition duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-xs">
                    <Radio className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-gray-200 font-mono">03</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Proximity Routing
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Instantly pings registered, verified donors residing within the exact micro-geographic city zone radius (1–5 km).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-semibold text-red-600 flex items-center gap-1">
                <span>Sub-second zone ping</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative bg-white rounded-2xl p-6 shadow-xs border border-gray-200/90 flex flex-col justify-between hover:shadow-md hover:border-red-300 transition duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-xs">
                    <Lock className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-gray-200 font-mono">04</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Secure Match
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  First donor to accept locks the request, preventing spam. Communication is routed through masked proxy numbers.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <span>Privacy & Safety Lock</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. INTERACTIVE 120-DAY ELIGIBILITY CALCULATOR SECTION */}
      {/* ========================================================================= */}
      <section id="eligibility" className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-red-950 rounded-3xl text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            
            {/* Background art */}
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  Medical Standard Rule
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Why the 120-Day Donation Rule?
                </h2>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Human red blood cells require approximately 120 days to complete a natural regeneration cycle and safely restore iron ferritin stores. BloodMesh enforces this rule algorithmically to protect our heroes.
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Prevents Donor Anemia
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Ensures Highest Blood Viability
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Automated Cooldown Timers
                  </span>
                </div>
              </div>

              {/* Interactive Calculator Box */}
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-400" />
                  Check Your Donation Eligibility
                </h3>
                <p className="text-xs text-gray-300 mb-4">
                  Select your last blood donation date to calculate your real-time status.
                </p>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-gray-200">
                    When did you last donate blood?
                  </label>
                  <input
                    type="date"
                    value={calcDate}
                    onChange={(e) => checkEligibility(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-gray-700 text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {eligibilityResult && (
                  <div className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in duration-200 ${
                    eligibilityResult.eligible
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                      : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                      {eligibilityResult.eligible ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Status: Eligible to Donate Now</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span>Status: In Recovery Period</span>
                        </>
                      )}
                    </div>
                    <p>{eligibilityResult.message}</p>
                  </div>
                )}

                <button
                  onClick={() => setRegisterModalOpen(true)}
                  className="mt-5 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  Register with BloodMesh Network
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. GEOGRAPHIC ZONES SECTION */}
      {/* ========================================================================= */}
      <section id="zones" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                <Compass className="w-3.5 h-3.5" />
                Geo-Fencing & Proximity Routing
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Precision Micro-Zones for Rapid Emergency Response
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Emergencies don't allow time for cross-city traffic delays. BloodMesh divides cities into granular 3km–5km responsive zones. When an emergency is logged at a hospital, only eligible donors within that zone receive immediate high-priority pings.
              </p>

              <div className="space-y-2 pt-2">
                <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-gray-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                    Zone K-1: Khulna Medical & Boyra Sector
                  </div>
                  <span className="text-xs font-semibold text-gray-500">142 Active Donors</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-gray-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                    Zone D-3: Dhaka Central Hospital & Shahbagh
                  </div>
                  <span className="text-xs font-semibold text-gray-500">388 Active Donors</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-gray-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                    Zone C-2: Chattogram Medical & Panchlaish
                  </div>
                  <span className="text-xs font-semibold text-gray-500">215 Active Donors</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
                <span>Live Zone Dispatch Matrix</span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Sync
                </span>
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-red-50/60 rounded-xl border border-red-100">
                  <div className="text-2xl font-black text-red-600">4.2 km</div>
                  <div className="text-xs font-bold text-gray-800 mt-0.5">Average Dispatch Radius</div>
                  <div className="text-[11px] text-gray-500 mt-1">Ensures arrival under 25 mins</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-2xl font-black text-gray-900">100%</div>
                  <div className="text-xs font-bold text-gray-800 mt-0.5">Masked Numbers</div>
                  <div className="text-[11px] text-gray-500 mt-1">No phone leaks to public</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-2xl font-black text-gray-900">1:1</div>
                  <div className="text-xs font-bold text-gray-800 mt-0.5">Request Locking</div>
                  <div className="text-[11px] text-gray-500 mt-1">Prevents over-crowding</div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-2xl font-black text-emerald-700">0s</div>
                  <div className="text-xs font-bold text-emerald-900 mt-0.5">Manual Delay</div>
                  <div className="text-[11px] text-emerald-700 mt-1">Fully automated logic</div>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-xl bg-gray-900 text-white text-xs flex items-center justify-between">
                <span>Want to register your hospital into our routing mesh?</span>
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
                >
                  Hospital Desk
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-xs">
                  <Droplet className="w-5 h-5 fill-white" />
                </div>
                <span className="text-xl font-extrabold text-gray-900">
                  Blood<span className="text-red-600">Mesh</span>
                </span>
              </div>
              <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                Automated, proximity-based blood donor routing network. Algorithmic matching for medical emergencies with 120-day compliance safety.
              </p>
              <div className="flex items-center space-x-3 text-xs text-gray-400 font-mono">
                <span>v2.4.0-PROD</span>
                <span>•</span>
                <span>ISO 27001 Certified Protocol</span>
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Emergency Network
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 font-medium">
                <li><a href="#active-alerts" className="hover:text-red-600 transition">Active Live Alerts</a></li>
                <li><a href="#how-it-works" className="hover:text-red-600 transition">Routing Algorithm</a></li>
                <li><a href="#eligibility" className="hover:text-red-600 transition">120-Day Medical Rule</a></li>
                <li><a href="#zones" className="hover:text-red-600 transition">Geographic Zones</a></li>
              </ul>
            </div>

            {/* Legal & API Column */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Platform & Legal
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 font-medium">
                <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert("BloodMesh Privacy Shield: Donor and patient phone numbers are strictly proxied and masked."); }} className="hover:text-red-600 transition">Privacy Policy</a></li>
                <li><a href="#terms" onClick={(e) => { e.preventDefault(); alert("BloodMesh is a non-commercial emergency response network."); }} className="hover:text-red-600 transition">Terms of Service</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); alert("Emergency Hotline: +880 1900-BLOOD (24/7 Dispatch Desk)"); }} className="hover:text-red-600 transition">Contact Emergency Desk</a></li>
                <li><a href="#api" onClick={(e) => { e.preventDefault(); alert("BloodMesh REST & Webhook APIs available for verified hospital EHR integrations."); }} className="hover:text-red-600 transition">Developer API</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
            <p>© 2026 BloodMesh Network. Built for emergency response.</p>
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                All Systems Operational
              </span>
              <span>Encrypted Dispatch</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 9. MODALS: EMERGENCY REQUEST MODAL ("Request Blood Now") */}
      {/* ========================================================================= */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-150">
            
            <button
              onClick={() => setRequestModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30">
                <Droplet className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Broadcast Emergency Blood Request
                </h3>
                <p className="text-xs text-gray-500">
                  Our algorithm will notify verified donors in your hospital's zone instantly.
                </p>
              </div>
            </div>

            <form onSubmit={handleEmergencySubmit} className="space-y-4">
              
              {/* Blood Group Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Required Blood Group *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(bg => (
                    <button
                      type="button"
                      key={bg}
                      onClick={() => setEmergencyForm({ ...emergencyForm, bloodGroup: bg })}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        emergencyForm.bloodGroup === bg
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Units Needed & Urgency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Units Needed (Bags)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={emergencyForm.units}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, units: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={emergencyForm.urgency}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, urgency: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  >
                    <option>Immediate (&lt; 1 hour)</option>
                    <option>Urgent (&lt; 3 hours)</option>
                    <option>Scheduled Today</option>
                  </select>
                </div>
              </div>

              {/* Hospital Name & Zone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Hospital / Medical Center *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Khulna Medical College Hospital"
                  value={emergencyForm.hospital}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, hospital: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  City Zone Radius
                </label>
                <select
                  value={emergencyForm.zone}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, zone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-red-500"
                >
                  <option value="Khulna Central">Khulna Central (Zone K-1 • 3.5 km)</option>
                  <option value="Dhaka Shahbagh">Dhaka Shahbagh (Zone D-3 • 2.5 km)</option>
                  <option value="Chattogram Metro">Chattogram Metro (Zone C-2 • 4.0 km)</option>
                  <option value="Rajshahi City">Rajshahi City (Zone R-1 • 3.0 km)</option>
                </select>
              </div>

              {/* Privacy Mask Toggle */}
              <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-600" />
                  <div>
                    <div className="text-xs font-bold text-gray-900">Privacy Proxy Masking</div>
                    <div className="text-[11px] text-gray-500">Keep phone number confidential until donor confirms</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emergencyForm.privacyMask}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, privacyMask: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formSubmitted}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {formSubmitted ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Broadcasting to Zone Donors...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Broadcast Request to Network</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. MODALS: DONOR REGISTRATION MODAL ("Register as Donor") */}
      {/* ========================================================================= */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-150">
            
            <button
              onClick={() => { setRegisterModalOpen(false); setDonorRegistered(false); }}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Register as a Mesh Blood Donor
                </h3>
                <p className="text-xs text-gray-500">
                  Join our proximity network to save lives in your neighborhood.
                </p>
              </div>
            </div>

            {donorRegistered ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Registration Successful!</h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  You are now registered in <span className="font-semibold text-gray-900">{donorForm.zone}</span>. The 120-day safety timer is running. You will receive priority emergency pings when someone nearby needs blood group <span className="font-bold text-red-600">{donorForm.bloodGroup}</span>.
                </p>
                <button
                  onClick={() => { setRegisterModalOpen(false); setDonorRegistered(false); }}
                  className="mt-4 px-6 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl"
                >
                  Close & View Feed
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDonorRegistered(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Tanvir Ahmed"
                    value={donorForm.name}
                    onChange={(e) => setDonorForm({ ...donorForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Your Blood Group *
                    </label>
                    <select
                      value={donorForm.bloodGroup}
                      onChange={(e) => setDonorForm({ ...donorForm, bloodGroup: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-red-500"
                    >
                      <option>O+</option>
                      <option>O-</option>
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+880 1700-000000"
                      value={donorForm.phone}
                      onChange={(e) => setDonorForm({ ...donorForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Primary City / Residential Zone *
                  </label>
                  <select
                    value={donorForm.zone}
                    onChange={(e) => setDonorForm({ ...donorForm, zone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  >
                    <option>Khulna Metro (Zone K-1)</option>
                    <option>Dhaka Central (Zone D-3)</option>
                    <option>Chattogram Metro (Zone C-2)</option>
                    <option>Rajshahi City (Zone R-1)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Last Blood Donation Date (Leave empty if first time)
                  </label>
                  <input
                    type="date"
                    value={donorForm.lastDonationDate}
                    onChange={(e) => setDonorForm({ ...donorForm, lastDonationDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>
                    I understand the 120-day medical donation cooldown rule. My phone number will stay masked until I accept a dispatch request.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Donor Registration</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. MODALS: LOGIN MODAL ("Login") */}
      {/* ========================================================================= */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-150">
            
            <button
              onClick={() => setLoginModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  BloodMesh Secure Portal
                </h3>
                <p className="text-xs text-gray-500">
                  Access your donor profile or hospital emergency console.
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Demo Login: Connected to BloodMesh Network");
                setLoginModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Registered Phone or Hospital ID
                </label>
                <input
                  type="text"
                  placeholder="+880 1700-000000 or HOSP-9921"
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Password or OTP
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-md shadow-red-600/20"
              >
                Sign In to Network
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginModalOpen(false);
                    setRegisterModalOpen(true);
                  }}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Don't have an account? Register as donor
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. MODALS: ALERT DETAILS / RESPOND MODAL */}
      {/* ========================================================================= */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative animate-in fade-in zoom-in-95 duration-150">
            
            <button
              onClick={() => setSelectedAlert(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-black text-lg">
                {selectedAlert.bloodGroup}
              </div>
              <div>
                <div className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  Emergency Broadcast Dispatch
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedAlert.location}
                </h3>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2.5 text-xs mb-5">
              <div className="flex justify-between">
                <span className="text-gray-500">Ward / Department:</span>
                <span className="font-bold text-gray-900">{selectedAlert.subLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Units Required:</span>
                <span className="font-bold text-red-600">{selectedAlert.unitsNeeded} Bags</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Routing Zone:</span>
                <span className="font-bold text-gray-900">{selectedAlert.zone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Proximity Donors Pinged:</span>
                <span className="font-bold text-emerald-700">{selectedAlert.eligibleDonorsInRadius} Eligible</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Broadcast Time:</span>
                <span className="font-medium text-gray-700">{selectedAlert.time}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 leading-relaxed mb-6">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-red-900">
                <Lock className="w-3.5 h-3.5" />
                Privacy & Lock Protocol:
              </div>
              Accepting this request will immediately assign you as the primary donor for this patient and mask your phone via BloodMesh Proxy.
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  alert(`Thank you! You have accepted the emergency blood request for ${selectedAlert.location}. The hospital coordination desk has been notified via secure proxy.`);
                  setSelectedAlert(null);
                }}
                className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept & Lock Request</span>
              </button>
              <button
                onClick={() => setSelectedAlert(null)}
                className="py-3.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition text-xs"
              >
                Dismiss
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
