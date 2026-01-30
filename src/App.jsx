import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, Area, AreaChart
} from 'recharts';
import {
  AlertCircle, CheckCircle, Clock, DollarSign, FileText, Upload,
  Search, Filter, Bell, Settings, HelpCircle, ChevronRight, ChevronDown,
  Building, Truck, Zap, TreePine, Droplets, Home, Shield, Users,
  TrendingUp, AlertTriangle, MessageSquare, Send, Paperclip, Bot,
  Database, RefreshCw, Eye, Download, Calendar, MapPin, X, Check,
  ArrowRight, Layers, Activity, Target, Clipboard, Star, Info,
  Camera, Mic, MicOff, Plus, Image, Navigation, Menu, ChevronLeft,
  Play, Volume2, Grid, List, User, Smartphone, Monitor
} from 'lucide-react';

// =============================================================================
// CONSTANTS & DATA
// =============================================================================

// FEMA Policy Constants (PAPPG V5.0 Amended - Effective Jan 6, 2025)
const FEMA_POLICY = {
  pappgVersion: '5.0 Amended',
  effectiveDate: 'January 6, 2025',
  federalCostShare: 0.75,
  smallProjectThreshold: 1062900,
  perCapitaStateIndicator: 1.89,
  perCapitaCountyIndicator: 4.72,
  emergencyWorkDeadline: 6,
  permanentWorkDeadline: 18
};

// PA Categories
const PA_CATEGORIES = {
  'A': { name: 'Debris Removal', icon: Truck, color: '#8B4513', shortName: 'Debris', examples: ['Fallen trees', 'Storm debris', 'Building materials'] },
  'B': { name: 'Emergency Protective Measures', icon: Shield, color: '#DC143C', shortName: 'EPM', examples: ['Sandbagging', 'Temporary barriers', 'Emergency shelters'] },
  'C': { name: 'Roads & Bridges', icon: Building, color: '#4682B4', shortName: 'Roads', examples: ['Pavement damage', 'Washouts', 'Bridge damage'] },
  'D': { name: 'Water Control Facilities', icon: Droplets, color: '#1E90FF', shortName: 'Water', examples: ['Levee damage', 'Drainage systems', 'Retention ponds'] },
  'E': { name: 'Buildings & Equipment', icon: Home, color: '#6B8E23', shortName: 'Buildings', examples: ['Roof damage', 'Structural damage', 'HVAC systems'] },
  'F': { name: 'Utilities', icon: Zap, color: '#FFD700', shortName: 'Utilities', examples: ['Power lines', 'Water mains', 'Sewer systems'] },
  'G': { name: 'Parks & Recreation', icon: TreePine, color: '#228B22', shortName: 'Parks', examples: ['Playground equipment', 'Sports fields', 'Trail damage'] }
};

// Damage severity levels
const DAMAGE_LEVELS = {
  'affected': { label: 'Affected', color: '#FCD34D', description: 'Minor/cosmetic damage' },
  'minor': { label: 'Minor', color: '#FB923C', description: 'Repairable non-structural damage' },
  'major': { label: 'Major', color: '#EF4444', description: 'Structural damage requiring extensive repairs' },
  'destroyed': { label: 'Destroyed', color: '#7F1D1D', description: 'Total loss' }
};

// Mock Data
const MOCK_DISASTER = {
  id: 'DR-4789-FL',
  name: 'Hurricane Marina',
  type: 'Hurricane',
  state: 'Florida',
  incidentPeriod: 'Sep 15-22, 2025',
  declarationDate: 'Sep 25, 2025',
  status: 'Active'
};

const MOCK_COSTS = [
  { category: 'A', name: 'Debris Removal', eligible: 4250000, documented: 3825000, submitted: 2125000, approved: 1487500 },
  { category: 'B', name: 'Emergency Protective', eligible: 2850000, documented: 2565000, submitted: 1995000, approved: 1496250 },
  { category: 'C', name: 'Roads & Bridges', eligible: 8500000, documented: 6800000, submitted: 4250000, approved: 2975000 },
  { category: 'D', name: 'Water Control', eligible: 1200000, documented: 960000, submitted: 720000, approved: 540000 },
  { category: 'E', name: 'Buildings & Equipment', eligible: 5600000, documented: 4480000, submitted: 2800000, approved: 1960000 },
  { category: 'F', name: 'Utilities', eligible: 3200000, documented: 2880000, submitted: 2240000, approved: 1680000 },
  { category: 'G', name: 'Parks & Recreation', eligible: 980000, documented: 784000, submitted: 490000, approved: 343000 }
];

const MOCK_FIELD_INSPECTIONS = [
  { id: 'INS-001', timestamp: '2025-09-16 09:32 AM', location: '1247 Oak Street', coordinates: { lat: 27.9506, lng: -82.4572 }, category: 'A', severity: 'major', photos: 3, hasVoiceNote: true, aiConfidence: 94, status: 'ready', estimatedCost: 45000, description: 'Large oak tree fallen across roadway, blocking both lanes.', inspector: 'J. Rodriguez' },
  { id: 'INS-002', timestamp: '2025-09-16 10:15 AM', location: 'Highway 41 & Marina Dr', coordinates: { lat: 27.9612, lng: -82.4489 }, category: 'C', severity: 'major', photos: 5, hasVoiceNote: true, aiConfidence: 89, status: 'ready', estimatedCost: 285000, description: 'Culvert washout with significant road base erosion.', inspector: 'J. Rodriguez' },
  { id: 'INS-003', timestamp: '2025-09-16 11:45 AM', location: 'City Hall - 500 Main St', coordinates: { lat: 27.9478, lng: -82.4584 }, category: 'E', severity: 'minor', photos: 8, hasVoiceNote: false, aiConfidence: 76, status: 'needs-review', estimatedCost: 156000, description: 'Roof damage to east wing, water intrusion.', inspector: 'M. Thompson' },
  { id: 'INS-004', timestamp: '2025-09-16 02:30 PM', location: 'Riverside Park', coordinates: { lat: 27.9534, lng: -82.4612 }, category: 'G', severity: 'major', photos: 6, hasVoiceNote: true, aiConfidence: 91, status: 'ready', estimatedCost: 78000, description: 'Playground equipment destroyed, trail washout.', inspector: 'S. Martinez' }
];

const MOCK_WORK_ORDERS = [
  { id: 'WO-2024-1847', description: 'Emergency debris removal - Oak Street corridor', category: 'A', department: 'Public Works', amount: 125000, status: 'auto-categorized', confidence: 98, date: '2025-09-16', source: 'ERP' },
  { id: 'WO-2024-1848', description: 'Generator rental for emergency shelter operations', category: 'B', department: 'Emergency Mgmt', amount: 45000, status: 'auto-categorized', confidence: 95, date: '2025-09-16', source: 'ERP' },
  { id: 'WO-2024-1849', description: 'Culvert replacement - Highway 41 washout', category: 'C', department: 'Transportation', amount: 285000, status: 'needs-review', confidence: 72, date: '2025-09-17', source: 'Field' },
  { id: 'WO-2024-1850', description: 'Overtime labor - Police traffic control', category: 'B', department: 'Police', amount: 67500, status: 'auto-categorized', confidence: 94, date: '2025-09-17', source: 'Timesheet' }
];

const AI_CHAT_HISTORY = [
  { role: 'user', content: 'Is overtime for utility crew members eligible for FEMA reimbursement?' },
  { role: 'assistant', content: 'Yes, overtime for utility crew members is generally eligible under Category B (Emergency Protective Measures) or Category F (Utilities) depending on the work performed.\n\n**Key Requirements (PAPPG V5.0):**\n• Must be directly related to disaster response\n• Only the overtime portion (not regular time) is eligible for permanent employees\n• Must be documented with certified payroll records\n\n**PAPPG V5.0 Reference:** Chapter 6, Labor Costs\n\n**Confidence:** 94%', citations: ['PAPPG V5.0, Ch.6 - Labor Costs'] }
];

// =============================================================================
// HOOKS
// =============================================================================

// Custom hook for responsive detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'blue', compact = false }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  if (compact) {
    return (
      <div className="bg-white rounded-xl p-3 shadow-sm border">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{title}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-sm">
          <TrendingUp className={`w-4 h-4 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
          <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>{Math.abs(trend)}%</span>
          <span className="text-gray-400">vs last week</span>
        </div>
      )}
    </div>
  );
};

// Category Badge Component
const CategoryBadge = ({ category, size = 'md' }) => {
  const cat = PA_CATEGORIES[category];
  if (!cat) return null;
  const Icon = cat.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${sizeClasses}`}
      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      Cat {category}
    </span>
  );
};

// =============================================================================
// DESKTOP COMPONENTS
// =============================================================================

const DesktopSidebar = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'field', label: 'Field Capture', icon: Camera },
    { id: 'costs', label: 'Cost Capture', icon: DollarSign },
    { id: 'documents', label: 'Documentation', icon: FileText },
    { id: 'worksheets', label: 'Project Worksheets', icon: Clipboard },
    { id: 'assistant', label: 'Eligibility Assistant', icon: Bot },
    { id: 'submissions', label: 'Submissions', icon: Send }
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">FEMA Recovery</h1>
            <p className="text-xs text-gray-400">Intelligence Platform</p>
          </div>
        </div>
      </div>

      <div className="p-3 mx-3 mt-4 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 text-yellow-400" />
          <span className="text-gray-300">Active Disaster</span>
        </div>
        <p className="font-semibold mt-1">{MOCK_DISASTER.id}</p>
        <p className="text-xs text-gray-400">{MOCK_DISASTER.name}</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
              activeView === item.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
            {item.id === 'field' && (
              <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Sarah Martinez</p>
            <p className="text-xs text-gray-400">Finance Director</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DesktopHeader = () => (
  <header className="h-14 bg-white border-b flex items-center justify-between px-6">
    <div className="flex items-center gap-4">
      <h2 className="text-lg font-semibold text-gray-800">{MOCK_DISASTER.name} ({MOCK_DISASTER.id})</h2>
      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">{MOCK_DISASTER.status}</span>
    </div>
    <div className="flex items-center gap-4">
      <div className="relative">
        <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
      </div>
      <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
        <RefreshCw className="w-4 h-4" />
        Sync All
      </button>
    </div>
  </header>
);

// =============================================================================
// MOBILE COMPONENTS
// =============================================================================

const MobileHeader = ({ title, onBack, onMenu }) => (
  <div className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between safe-area-top">
    <div className="flex items-center gap-3">
      {onBack ? (
        <button onClick={onBack} className="p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
      ) : (
        <button onClick={onMenu} className="p-1 -ml-1">
          <Menu className="w-6 h-6" />
        </button>
      )}
      <h1 className="font-semibold text-lg">{title}</h1>
    </div>
    <button className="p-2 bg-blue-600 rounded-full">
      <RefreshCw className="w-4 h-4" />
    </button>
  </div>
);

const MobileBottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', icon: Activity, label: 'Home' },
    { id: 'field', icon: Camera, label: 'Capture' },
    { id: 'costs', icon: List, label: 'Costs' },
    { id: 'assistant', icon: Bot, label: 'Ask AI' }
  ];

  return (
    <div className="bg-white border-t flex justify-around py-2 safe-area-bottom">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center py-1 px-4 rounded-lg ${
            activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'stroke-2' : ''}`} />
          <span className="text-xs mt-1">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

// =============================================================================
// FIELD CAPTURE VIEW (Works on both Desktop and Mobile)
// =============================================================================

const FieldCaptureView = ({ isMobile }) => {
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNote, setVoiceNote] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [severity, setSeverity] = useState('major');
  const [notes, setNotes] = useState('');

  const handleCapture = () => {
    const newPhoto = { id: Date.now(), timestamp: new Date().toLocaleTimeString() };
    setCapturedPhotos([...capturedPhotos, newPhoto]);

    if (capturedPhotos.length === 0) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setAiSuggestion({
          category: 'C',
          confidence: 89,
          severity: 'major',
          description: 'Road damage detected - appears to be culvert washout with pavement failure',
          estimatedCost: 285000
        });
        setIsAnalyzing(false);
      }, 1500);
    }
  };

  const handleSubmit = () => {
    setCapturedPhotos([]);
    setVoiceNote(null);
    setAiSuggestion(null);
    setSelectedCategory(null);
    setShowReview(false);
    setNotes('');
  };

  // Review Panel (shown after photos captured)
  if (showReview) {
    const cat = PA_CATEGORIES[selectedCategory || aiSuggestion?.category];
    const Icon = cat?.icon || AlertCircle;

    return (
      <div className={`${isMobile ? 'flex-1' : ''} bg-gray-50 overflow-y-auto`}>
        <div className={`${isMobile ? '' : 'max-w-3xl mx-auto'} p-4 space-y-4`}>
          {/* Photos */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-medium text-gray-800 mb-3">Captured Photos ({capturedPhotos.length})</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {capturedPhotos.map((photo, i) => (
                <div key={photo.id} className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
              ))}
              <button className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-dashed border-gray-300">
                <Plus className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* AI Category */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-medium text-gray-800 mb-3">AI Category Assignment</h3>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat?.color}20`, color: cat?.color }}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Category {selectedCategory || aiSuggestion?.category}: {cat?.name}</p>
                <p className="text-sm text-gray-500">{aiSuggestion?.confidence}% confidence</p>
              </div>
            </div>
          </div>

          {/* Severity */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-medium text-gray-800 mb-3">Damage Severity</h3>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(DAMAGE_LEVELS).map(([key, level]) => (
                <button
                  key={key}
                  onClick={() => setSeverity(key)}
                  className={`p-3 rounded-xl text-center transition-all ${severity === key ? 'ring-2 ring-offset-2' : 'bg-gray-50'}`}
                  style={{ backgroundColor: severity === key ? `${level.color}20` : undefined, ringColor: level.color }}
                >
                  <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ backgroundColor: level.color }} />
                  <span className="text-xs font-medium text-gray-700">{level.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Note */}
          {voiceNote && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-3">Voice Note</h3>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </button>
                <div className="flex-1 h-2 bg-gray-200 rounded-full" />
                <span className="text-sm text-gray-500">{voiceNote.duration}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-medium text-gray-800 mb-3">Additional Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional observations..."
              className="w-full p-3 bg-gray-50 rounded-xl border-0 resize-none h-24 text-gray-700"
            />
          </div>

          {/* Estimated Cost */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-medium text-gray-800 mb-3">Estimated Repair Cost</h3>
            <p className="text-2xl font-bold text-gray-800">${aiSuggestion?.estimatedCost?.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">AI estimate based on damage analysis</p>
          </div>

          {/* PAPPG Reference */}
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">PAPPG V5.0 Compliant</p>
                <p className="text-xs text-blue-600 mt-1">Documentation meets FEMA requirements. Federal cost share: 75%.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={() => setShowReview(false)} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold">
              Back
            </button>
            <button onClick={handleSubmit} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              Save Inspection
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Camera/Capture Interface
  return (
    <div className={`${isMobile ? 'flex-1 flex flex-col' : 'grid grid-cols-2 gap-6'}`}>
      {/* Camera View */}
      <div className={`${isMobile ? 'flex-1' : 'h-[500px]'} bg-gray-900 rounded-xl relative overflow-hidden`}>
        {/* Simulated camera view */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <Camera className="w-16 h-16 mx-auto mb-2 opacity-30" />
            <p className="text-sm opacity-50">Camera Preview</p>
            <p className="text-xs opacity-30 mt-1">Tap capture to simulate photo</p>
          </div>
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
          {[...Array(9)].map((_, i) => <div key={i} className="border border-white/10" />)}
        </div>

        {/* GPS indicator */}
        <div className="absolute top-4 left-4 bg-black/50 rounded-full px-3 py-1 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-green-400" />
          <span className="text-white text-xs">GPS Locked</span>
        </div>

        {/* Photo count */}
        {capturedPhotos.length > 0 && (
          <div className="absolute top-4 right-4 bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold">{capturedPhotos.length}</span>
          </div>
        )}

        {/* AI Analysis overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white font-medium">AI Analyzing Damage...</p>
              <p className="text-gray-400 text-sm mt-1">Categorizing & estimating costs</p>
            </div>
          </div>
        )}

        {/* AI Suggestion Banner */}
        {aiSuggestion && !isAnalyzing && (
          <div className="absolute bottom-4 left-4 right-4 bg-blue-600 rounded-xl p-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                {React.createElement(PA_CATEGORIES[aiSuggestion.category].icon, { className: 'w-6 h-6 text-white' })}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">Category {aiSuggestion.category}: {PA_CATEGORIES[aiSuggestion.category].name}</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white">{aiSuggestion.confidence}%</span>
                </div>
                <p className="text-blue-100 text-sm mt-1">{aiSuggestion.description}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2 bg-white/20 text-white rounded-lg text-sm">Change Category</button>
              <button onClick={() => { setSelectedCategory(aiSuggestion.category); setShowReview(true); }} className="flex-1 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium">
                Accept & Review
              </button>
            </div>
          </div>
        )}

        {/* Captured photos thumbnails */}
        {capturedPhotos.length > 0 && !aiSuggestion && (
          <div className="absolute bottom-4 left-4 right-20 flex gap-2 overflow-x-auto">
            {capturedPhotos.map((photo) => (
              <div key={photo.id} className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Image className="w-6 h-6 text-gray-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls Panel */}
      <div className={`${isMobile ? 'bg-black p-6' : 'space-y-4'}`}>
        {isMobile ? (
          // Mobile camera controls
          <div className="flex items-center justify-around">
            <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
              {capturedPhotos.length > 0 ? <span className="text-white font-bold">{capturedPhotos.length}</span> : <Image className="w-6 h-6 text-white" />}
            </button>
            <button onClick={handleCapture} className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-gray-300">
              <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-400" />
            </button>
            <button
              onClick={() => { if (isRecording) { setIsRecording(false); setVoiceNote({ duration: '0:12' }); } else { setIsRecording(true); } }}
              className={`w-12 h-12 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500 animate-pulse' : voiceNote ? 'bg-green-500' : 'bg-gray-800'}`}
            >
              {isRecording ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
            </button>
          </div>
        ) : (
          // Desktop controls panel
          <>
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-4">Capture Controls</h3>
              <div className="flex gap-3">
                <button onClick={handleCapture} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2">
                  <Camera className="w-5 h-5" />
                  Take Photo
                </button>
                <button
                  onClick={() => { if (isRecording) { setIsRecording(false); setVoiceNote({ duration: '0:12' }); } else { setIsRecording(true); } }}
                  className={`py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 ${isRecording ? 'bg-red-500 text-white animate-pulse' : voiceNote ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  {isRecording ? 'Stop' : voiceNote ? 'Recorded' : 'Voice Note'}
                </button>
              </div>
              {voiceNote && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">Voice note recorded ({voiceNote.duration})</span>
                </div>
              )}
            </div>

            {/* Recent Inspections */}
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-4">Recent Field Inspections</h3>
              <div className="space-y-2">
                {MOCK_FIELD_INSPECTIONS.slice(0, 3).map(insp => (
                  <div key={insp.id} className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                    <CategoryBadge category={insp.category} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{insp.location}</p>
                      <p className="text-xs text-gray-500">{insp.timestamp}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${insp.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {insp.status === 'ready' ? 'Ready' : 'Review'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 bg-blue-50 rounded-xl">
              <h4 className="font-medium text-blue-800 mb-2">Capture Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Take photos from multiple angles</li>
                <li>• Include scale reference when possible</li>
                <li>• Capture surrounding context</li>
                <li>• Add voice notes for complex damage</li>
              </ul>
            </div>
          </>
        )}

        {isMobile && capturedPhotos.length === 0 && (
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">Take photos of damage from multiple angles</p>
            <p className="text-gray-500 text-xs mt-1">AI will analyze and categorize automatically</p>
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// DASHBOARD VIEW
// =============================================================================

const DashboardView = ({ isMobile }) => {
  const totalEligible = MOCK_COSTS.reduce((sum, c) => sum + c.eligible, 0);
  const totalDocumented = MOCK_COSTS.reduce((sum, c) => sum + c.documented, 0);

  const chartData = MOCK_COSTS.map(c => ({
    name: PA_CATEGORIES[c.category].shortName,
    eligible: c.eligible / 1000000,
    documented: c.documented / 1000000
  }));

  if (isMobile) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard title="Total Eligible" value={`$${(totalEligible / 1000000).toFixed(1)}M`} icon={Target} color="blue" compact />
          <MetricCard title="Documented" value={`${Math.round((totalDocumented / totalEligible) * 100)}%`} icon={FileText} color="green" compact />
          <MetricCard title="Field Inspections" value={MOCK_FIELD_INSPECTIONS.length} icon={Camera} color="purple" compact />
          <MetricCard title="Ready to Submit" value="8" icon={Send} color="yellow" compact />
        </div>

        {/* Recent Field Activity */}
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-800 mb-3">Recent Field Activity</h3>
          <div className="space-y-3">
            {MOCK_FIELD_INSPECTIONS.slice(0, 3).map(insp => (
              <div key={insp.id} className="flex items-center gap-3">
                <CategoryBadge category={insp.category} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{insp.location}</p>
                  <p className="text-xs text-gray-500">{insp.inspector} • {insp.timestamp}</p>
                </div>
                <span className="text-sm font-medium text-gray-700">${(insp.estimatedCost / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-5 h-5" />
            <h3 className="font-semibold">AI Insights</h3>
          </div>
          <div className="space-y-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <p className="text-sm">4 inspections ready for documentation assembly</p>
            </div>
            <div className="p-2 bg-white/10 rounded-lg">
              <p className="text-sm">$45K potential recovery from reclassification</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Dashboard
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <MetricCard title="Total Eligible Costs" value={`$${(totalEligible / 1000000).toFixed(1)}M`} subtitle="Identified across all categories" icon={Target} color="blue" />
        <MetricCard title="Documentation Rate" value={`${Math.round((totalDocumented / totalEligible) * 100)}%`} subtitle={`$${(totalDocumented / 1000000).toFixed(1)}M documented`} icon={FileText} trend={8} color="purple" />
        <MetricCard title="Field Inspections" value={MOCK_FIELD_INSPECTIONS.length} subtitle="Captured this week" icon={Camera} color="green" />
        <MetricCard title="Projected Recovery" value={`$${((totalEligible * 0.75 * 0.91) / 1000000).toFixed(1)}M`} subtitle="At 91% capture rate" icon={DollarSign} color="green" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Chart */}
        <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-800 mb-4">Costs by PA Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}M`} />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}M`} />
              <Legend />
              <Bar dataKey="eligible" name="Eligible" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="documented" name="Documented" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Field Inspections Panel */}
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Field Inspections</h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{MOCK_FIELD_INSPECTIONS.length} new</span>
          </div>
          <div className="space-y-3">
            {MOCK_FIELD_INSPECTIONS.map(insp => (
              <div key={insp.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{insp.location}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{insp.inspector} • {insp.timestamp}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${insp.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {insp.status === 'ready' ? 'Ready' : 'Review'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CategoryBadge category={insp.category} size="sm" />
                  <span className="text-xs text-gray-500">{insp.photos} photos</span>
                  <span className="text-xs text-gray-500">{insp.aiConfidence}% AI</span>
                  <span className="ml-auto text-sm font-medium text-gray-700">${(insp.estimatedCost / 1000).toFixed(0)}K</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// COST CAPTURE VIEW
// =============================================================================

const CostCaptureView = ({ isMobile }) => {
  const [filter, setFilter] = useState('all');
  const allItems = [...MOCK_WORK_ORDERS, ...MOCK_FIELD_INSPECTIONS.map(i => ({
    id: i.id,
    description: i.description,
    category: i.category,
    department: 'Field',
    amount: i.estimatedCost,
    status: i.status === 'ready' ? 'auto-categorized' : 'needs-review',
    confidence: i.aiConfidence,
    date: i.timestamp.split(' ')[0],
    source: 'Field'
  }))];

  const filteredItems = filter === 'all' ? allItems : allItems.filter(i => i.source === filter);

  if (isMobile) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 bg-white border-b flex gap-2 overflow-x-auto">
          {['all', 'Field', 'ERP', 'Timesheet'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              {f === 'all' ? 'All Sources' : f}
            </button>
          ))}
        </div>
        <div className="divide-y">
          {filteredItems.map(item => {
            const cat = PA_CATEGORIES[item.category];
            const Icon = cat.icon;
            return (
              <div key={item.id} className="bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-gray-500">{item.source}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <CategoryBadge category={item.category} size="sm" />
                      <span className="text-xs text-gray-500">{item.confidence}% AI</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${item.amount.toLocaleString()}</p>
                    <span className={`text-xs ${item.status === 'auto-categorized' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {item.status === 'auto-categorized' ? '✓ Auto' : '⚠ Review'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="space-y-6">
      {/* Data Sources */}
      <div className="bg-white rounded-xl p-5 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Data Source Integrations</h3>
          <span className="text-xs text-gray-500">Last sync: 2 minutes ago</span>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {[
            { name: 'Field Inspections', status: 'connected', records: MOCK_FIELD_INSPECTIONS.length, icon: Camera },
            { name: 'Tyler Munis ERP', status: 'connected', records: '2,847', icon: Database },
            { name: 'Cityworks WMS', status: 'connected', records: '1,234', icon: Clipboard },
            { name: 'Kronos Timekeeping', status: 'connected', records: '8,921', icon: Clock },
            { name: 'AP/Invoice System', status: 'syncing', records: '1,102', icon: FileText }
          ].map((source, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${source.status === 'connected' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                <source.icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 truncate">{source.name}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{source.records} records</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Items List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">AI Cost Categorization</h3>
          <div className="flex gap-2">
            {['all', 'Field', 'ERP', 'Timesheet'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm rounded-lg ${filter === f ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y">
          {filteredItems.map(item => {
            const cat = PA_CATEGORIES[item.category];
            const Icon = cat.icon;
            return (
              <div key={item.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">{item.id}</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{item.source}</span>
                      <span className="text-xs text-gray-500">{item.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <CategoryBadge category={item.category} />
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.confidence}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{item.confidence}%</span>
                    </div>
                    <p className="font-semibold text-gray-800 w-24 text-right">${item.amount.toLocaleString()}</p>
                    {item.status === 'auto-categorized' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// ELIGIBILITY ASSISTANT VIEW
// =============================================================================

const EligibilityAssistantView = ({ isMobile }) => {
  const [messages, setMessages] = useState(AI_CHAT_HISTORY);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Based on PAPPG V5.0, I\'ve analyzed your question. This is a demo response - the full platform would provide detailed eligibility guidance with specific citations and confidence scores.',
        citations: ['PAPPG V5.0 Amended']
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className={`${isMobile ? 'flex-1 flex flex-col' : 'grid grid-cols-3 gap-6 h-[calc(100vh-180px)]'}`}>
      <div className={`${isMobile ? 'flex-1 flex flex-col' : 'col-span-2'} bg-white rounded-xl shadow-sm border flex flex-col`}>
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">FEMA Eligibility Assistant</h3>
              <p className="text-xs text-gray-500">Powered by PAPPG V5.0</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md'} p-4`}>
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
                {msg.citations && (
                  <div className="mt-2 pt-2 border-t border-gray-200/50">
                    <div className="flex flex-wrap gap-1">
                      {msg.citations.map((cite, j) => (
                        <span key={j} className="px-2 py-0.5 bg-white/80 text-xs text-blue-600 rounded-full">{cite}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-bl-md p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about FEMA eligibility..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Send className="w-5 h-5" />
            </button>
          </div>
          {!isMobile && (
            <div className="flex gap-2 mt-2">
              {['Equipment rates', 'Labor eligibility', 'Cat B vs permanent work'].map((q, i) => (
                <button key={i} onClick={() => setInput(q)} className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isMobile && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Reference</h3>
            <div className="space-y-2">
              {[
                { name: 'PAPPG V5.0 Amended', pages: 'Eff. Jan 2025' },
                { name: 'FY2025 Thresholds', pages: `Small: $${(FEMA_POLICY.smallProjectThreshold / 1000000).toFixed(1)}M` },
                { name: 'Federal Cost Share', pages: '75% minimum' }
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">{doc.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{doc.pages}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// MAIN APP
// =============================================================================

export default function FEMAUnifiedPlatform() {
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView isMobile={isMobile} />;
      case 'field': return <FieldCaptureView isMobile={isMobile} />;
      case 'costs': return <CostCaptureView isMobile={isMobile} />;
      case 'assistant': return <EligibilityAssistantView isMobile={isMobile} />;
      default: return <DashboardView isMobile={isMobile} />;
    }
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-gray-100" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {activeView !== 'field' && (
          <MobileHeader
            title={activeView === 'dashboard' ? 'FEMA Recovery' : activeView === 'costs' ? 'Cost Capture' : activeView === 'assistant' ? 'Ask AI' : 'FEMA Recovery'}
            onMenu={() => setShowMobileMenu(true)}
          />
        )}
        {activeView === 'field' && (
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
            <button onClick={() => setActiveView('dashboard')} className="p-1">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="font-semibold">Capture Damage</h1>
            <div className="w-6" />
          </div>
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderView()}
        </div>
        <MobileBottomNav activeTab={activeView} setActiveTab={setActiveView} />

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowMobileMenu(false)}>
            <div className="w-72 h-full bg-white" onClick={e => e.stopPropagation()}>
              <div className="bg-blue-700 p-6 pt-10">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                  <User className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-semibold">Sarah Martinez</p>
                <p className="text-blue-200 text-sm">Finance Director</p>
              </div>
              <div className="p-4">
                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <p className="text-sm font-medium text-gray-800">{MOCK_DISASTER.id}</p>
                  <p className="text-xs text-gray-500">{MOCK_DISASTER.name}</p>
                </div>
                <div className="text-xs text-gray-400 mt-6">
                  <p>PAPPG V{FEMA_POLICY.pappgVersion}</p>
                  <p className="mt-1">Effective {FEMA_POLICY.effectiveDate}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="flex h-screen bg-gray-100">
      <DesktopSidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DesktopHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
