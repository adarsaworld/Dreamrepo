import React, { useState, useEffect } from 'react';
import { UserProfileData, TeamMember } from '../types';
import { INITIAL_USER_PROFILE, INITIAL_TEAM_MEMBERS } from '../data/mockData';

interface UserProfileViewProps {
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
  onNavigateTab?: (tab: any) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ onShowToast }) => {
  // Dark Mode State for User Profile (Persisted in localStorage)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('kizen_profile_theme');
      return saved === 'dark';
    } catch {
      return false;
    }
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('kizen_profile_theme', next ? 'dark' : 'light');
      } catch (e) {
        console.error(e);
      }
      onShowToast(
        next ? 'Executive Dark Mode Activated' : 'Radiant Light Mode Activated',
        next
          ? 'Switched user profile and fleet controls to obsidian night-shift palette.'
          : 'Switched user profile to warm ivory and golden daylight theme.',
        'info'
      );
      return next;
    });
  };

  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'ai-studio'>('profile');

  // User Profile State
  const [profile, setProfile] = useState<UserProfileData>(INITIAL_USER_PROFILE);
  const [editName, setEditName] = useState(profile.name);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editEmergency, setEditEmergency] = useState(profile.emergencyContact);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);

  // My Team State
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [searchTeam, setSearchTeam] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals for Team
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [banModalTarget, setBanModalTarget] = useState<TeamMember | null>(null);
  const [banReasonInput, setBanReasonInput] = useState('Violation of HACCP Kitchen Safety & Hygiene Protocol');
  const [removeConfirmTarget, setRemoveConfirmTarget] = useState<TeamMember | null>(null);

  // Form for New Employee
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpId, setNewEmpId] = useState(`KZ-BOM-${Math.floor(100 + Math.random() * 900)}`);
  const [newEmpPhone, setNewEmpPhone] = useState('+91 98200 ');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('Chef de Partie (Tandoor)');
  const [newEmpDept, setNewEmpDept] = useState<TeamMember['department']>('kitchen');
  const [newEmpOutpost, setNewEmpOutpost] = useState('Mumbai BKC Flagship');
  const [newEmpSalary, setNewEmpSalary] = useState<number>(450000);

  // AI Media Studio State (Veo 3 Video & Gemini 3.1 Flash Image)
  const [videoPrompt, setVideoPrompt] = useState('Cinematic slow-motion shot: Royal Awadhi Dum Pukht biryani handi unsealed with fragrant steam rising under warm amber candlelight');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoResolution, setVideoResolution] = useState<'720p' | '1080p'>('720p');
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoStatusMsg, setVideoStatusMsg] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // Image Creator & Editor State
  const [imageMode, setImageMode] = useState<'generate' | 'edit'>('generate');
  const [imagePrompt, setImagePrompt] = useState('Luxury Indian fine-dining degustation course: Charred truffle galouti kebab on edible 24K gold leaf, micro-coriander, saffron drizzle, dark slate plate, editorial photography');
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageTextResult, setImageTextResult] = useState<string | null>(null);
  const [editSourceImage, setEditSourceImage] = useState<string>(profile.avatarUrl);

  // Handle Save Personal Info
  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      name: editName.trim() || prev.name,
      phone: editPhone.trim() || prev.phone,
      email: editEmail.trim() || prev.email,
      emergencyContact: editEmergency.trim() || prev.emergencyContact,
    }));
    setIsEditingPersonal(false);
    onShowToast('Personal Information Updated', 'Your contact and personal dossier records have been saved.');
  };

  // Handle Add Employee
  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim()) return;

    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      employeeId: newEmpId.trim() || `KZ-EMP-${Date.now().toString().slice(-4)}`,
      name: newEmpName.trim(),
      phone: newEmpPhone.trim() || '+91 98000 00000',
      email: newEmpEmail.trim() || `${newEmpName.toLowerCase().replace(/\s+/g, '.')}@kizenempire.in`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      roleTitle: newEmpRole.trim(),
      department: newEmpDept,
      outpost: newEmpOutpost,
      baseSalary: Number(newEmpSalary) || 400000,
      status: 'active',
      joinedDate: new Date().toISOString().slice(0, 10),
    };

    setTeam([newMember, ...team]);
    setIsAddEmployeeModalOpen(false);
    setNewEmpName('');
    setNewEmpPhone('+91 98200 ');
    setNewEmpEmail('');
    setNewEmpSalary(450000);
    setNewEmpId(`KZ-BOM-${Math.floor(100 + Math.random() * 900)}`);

    onShowToast(
      'New Employee Onboarded',
      `${newMember.name} (${newMember.employeeId}) assigned to ${newMember.outpost} ${newMember.department} guild.`,
      'success'
    );
  };

  // Handle Ban Employee
  const handleConfirmBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banModalTarget) return;

    setTeam((prev) =>
      prev.map((m) =>
        m.id === banModalTarget.id
          ? {
              ...m,
              status: 'banned',
              banReason: banReasonInput,
              bannedAt: new Date().toISOString().slice(0, 10),
            }
          : m
      )
    );

    onShowToast(
      'Employee Banned & Blacklisted',
      `Access revoked for ${banModalTarget.name} (${banModalTarget.employeeId}). Reason: ${banReasonInput}`,
      'warning'
    );
    setBanModalTarget(null);
  };

  // Handle Unban Employee
  const handleUnbanEmployee = (member: TeamMember) => {
    setTeam((prev) =>
      prev.map((m) =>
        m.id === member.id
          ? {
              ...m,
              status: 'active',
              banReason: undefined,
              bannedAt: undefined,
            }
          : m
      )
    );
    onShowToast('Employee Reinstated', `${member.name} (${member.employeeId}) has been restored to active status.`);
  };

  // Handle Remove Employee
  const handleConfirmRemove = () => {
    if (!removeConfirmTarget) return;
    setTeam((prev) => prev.filter((m) => m.id !== removeConfirmTarget.id));
    onShowToast(
      'Employee Terminated & Removed',
      `${removeConfirmTarget.name} has been removed from the fleet roster.`,
      'info'
    );
    setRemoveConfirmTarget(null);
  };

  // Filtered team
  const filteredTeam = team.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTeam.toLowerCase()) ||
      m.employeeId.toLowerCase().includes(searchTeam.toLowerCase()) ||
      m.phone.toLowerCase().includes(searchTeam.toLowerCase()) ||
      m.roleTitle.toLowerCase().includes(searchTeam.toLowerCase());
    const matchesDept = departmentFilter === 'all' || m.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const activeCount = team.filter((m) => m.status === 'active').length;
  const bannedCount = team.filter((m) => m.status === 'banned').length;
  const totalTeamPayroll = team.reduce((acc, curr) => acc + (curr.status !== 'banned' ? curr.baseSalary : 0), 0);

  // Veo 3 Video Generation Flow
  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;
    setIsVideoGenerating(true);
    setVideoStatusMsg('Submitting prompt to Veo 3 Neural Engine...');
    setGeneratedVideoUrl(null);

    try {
      const startRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          aspectRatio: videoAspectRatio,
          resolution: videoResolution,
        }),
      });

      const startData = await startRes.json();
      if (!startRes.ok || !startData.operationName) {
        throw new Error(startData.error || 'Failed to initialize video generation');
      }

      const operationName = startData.operationName;
      setVideoStatusMsg('Synthesizing high-fidelity cinematography (polling Veo 3)...');

      // Poll loop
      let done = false;
      let attempts = 0;
      while (!done && attempts < 40) {
        await new Promise((r) => setTimeout(r, 8000));
        attempts++;
        setVideoStatusMsg(`Rendering frames & physics (${attempts * 8}s elapsed)...`);

        const pollRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });
        const pollData = await pollRes.json();
        if (pollData.done) {
          done = true;
          break;
        }
      }

      setVideoStatusMsg('Retrieving finished video stream...');
      const downloadRes = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName }),
      });

      if (!downloadRes.ok) {
        throw new Error('Could not download finalized video stream.');
      }

      const blob = await downloadRes.blob();
      const url = URL.createObjectURL(blob);
      setGeneratedVideoUrl(url);
      setVideoStatusMsg('');
      onShowToast('Veo 3 Video Ready', `Generated ${videoAspectRatio} cinematic video with model veo-3.1-fast-generate-preview.`, 'success');
    } catch (err: any) {
      console.error(err);
      setVideoStatusMsg('');
      onShowToast('Veo 3 Engine Notice', err?.message || 'Video generation service unavailable.', 'warning');
    } finally {
      setIsVideoGenerating(false);
    }
  };

  // Gemini 3.1 Flash Image Generation / Editing Flow
  const handleGenerateOrEditImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsImageLoading(true);
    setGeneratedImageUrl(null);
    setImageTextResult(null);

    try {
      if (imageMode === 'generate') {
        const res = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: imagePrompt,
            aspectRatio: imageAspectRatio,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.imageUrl) {
          throw new Error(data.error || 'Failed to generate image');
        }
        setGeneratedImageUrl(data.imageUrl);
        setImageTextResult(data.text || null);
        onShowToast('Image Generated', 'Created with gemini-3.1-flash-image-preview.', 'success');
      } else {
        // Edit mode
        const res = await fetch('/api/edit-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: imagePrompt,
            base64ImageData: editSourceImage,
            aspectRatio: imageAspectRatio,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.imageUrl) {
          throw new Error(data.error || 'Failed to edit image');
        }
        setGeneratedImageUrl(data.imageUrl);
        setImageTextResult(data.text || null);
        onShowToast('Image Edited', 'Modified with gemini-3.1-flash-image-preview.', 'success');
      }
    } catch (err: any) {
      console.error(err);
      onShowToast('AI Vision Notice', err?.message || 'Image synthesis error.', 'warning');
    } finally {
      setIsImageLoading(false);
    }
  };

  // Dynamic Theme Palette Classes
  const theme = {
    container: isDarkMode
      ? 'bg-[#0b0c10] text-[#f3f4f6]'
      : 'bg-transparent text-[#1c1917]',
    card: isDarkMode
      ? 'bg-[#15171e] border-[#262a34] text-[#f3f4f6] shadow-[0_15px_35px_rgba(0,0,0,0.55)]'
      : 'bg-white border-[#e8decb] text-[#1c1917] shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)]',
    innerBox: isDarkMode
      ? 'bg-[#1a1d26] border-[#2d323f]'
      : 'bg-[#faf8f5] border-[#e8decb]',
    subtleBorder: isDarkMode ? 'border-[#262a34]' : 'border-[#f0ece1]',
    heading: isDarkMode ? 'text-white' : 'text-[#1c1917]',
    subtext: isDarkMode ? 'text-[#9ca3af]' : 'text-[#78716c]',
    bodyText: isDarkMode ? 'text-[#d1d5db]' : 'text-[#57534e]',
    accentText: isDarkMode ? 'text-[#fbbf24]' : 'text-[#b45309]',
    input: isDarkMode
      ? 'bg-[#0f1117] text-white border-[#343946] focus:ring-[#f59e0b]/50 placeholder:text-[#6b7280]'
      : 'bg-[#faf8f5] text-[#1c1917] border-[#e8decb] focus:ring-[#f59e0b]/50 placeholder:text-[#a8a29e]',
    tabContainer: isDarkMode
      ? 'bg-[#101218] border-[#262a34]'
      : 'bg-[#faf8f5] border-[#e8decb]',
    tableHead: isDarkMode
      ? 'bg-[#101218] text-[#9ca3af] border-[#262a34]'
      : 'bg-[#f5f0e6] text-[#57534e] border-[#e8decb]',
    tableRowHover: isDarkMode ? 'hover:bg-[#1a1d26]' : 'hover:bg-[#faf8f5]',
    tableDivide: isDarkMode ? 'divide-[#20232c]' : 'divide-[#eee7da]',
  };

  return (
    <div className={`flex flex-col w-full space-y-8 p-1 sm:p-2 rounded-3xl transition-colors duration-300 ${theme.container}`}>
      {/* Top Banner / User Hero Card */}
      <section className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${theme.card}`}>
        <div
          className={`absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl pointer-events-none ${
            isDarkMode
              ? 'bg-gradient-to-br from-[#f59e0b]/15 to-transparent'
              : 'bg-gradient-to-br from-[#f59e0b]/20 to-transparent'
          }`}
        />

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 shadow-xl ${
                  isDarkMode ? 'ring-[#f59e0b]/50 ring-offset-2 ring-offset-[#15171e]' : 'ring-[#f59e0b]/40'
                }`}
              />
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#047857] ring-4 ring-white dark:ring-[#15171e] flex items-center justify-center">
                <span className="material-symbols-outlined text-xs text-white font-bold">check</span>
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className={`font-headline font-bold text-2xl sm:text-3xl tracking-tight ${theme.heading}`}>
                  {profile.name}
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                    isDarkMode
                      ? 'bg-[#291e0b] text-[#fcd34d] border-[#78350f]'
                      : 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
                  }`}
                >
                  {profile.employeeId}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    isDarkMode
                      ? 'bg-[#064e3b]/40 text-[#6ee7b7] border-[#065f46]'
                      : 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                  }`}
                >
                  Active Executive
                </span>
              </div>
              <p className={`text-xs sm:text-sm font-bold ${theme.accentText}`}>
                {profile.roleTitle}
              </p>
              <div className={`flex items-center gap-3 text-xs flex-wrap pt-0.5 ${theme.bodyText}`}>
                <span className="flex items-center gap-1 font-medium">
                  <span className={`material-symbols-outlined text-sm ${theme.accentText}`}>apartment</span>
                  <span>{profile.outpost}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <span className={`material-symbols-outlined text-sm ${theme.accentText}`}>phone</span>
                  <span>{profile.phone}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <span className={`material-symbols-outlined text-sm ${theme.accentText}`}>mail</span>
                  <span>{profile.email}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Top Actions: Dark Mode Toggle & Navigation Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {/* Dark Mode Switcher for User Profile */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border transition-all cursor-pointer shadow-sm group ${
                isDarkMode
                  ? 'bg-[#1e2330] border-[#384152] text-[#fcd34d] hover:bg-[#252c3c]'
                  : 'bg-[#fffbeb] border-[#fde68a] text-[#b45309] hover:bg-[#fef3c7]'
              }`}
              title="Toggle Profile Night/Day Mode"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isDarkMode ? 'bg-[#f59e0b] text-[#1e2330]' : 'bg-[#f59e0b] text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm font-bold">
                  {isDarkMode ? 'dark_mode' : 'light_mode'}
                </span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                  Profile Mode
                </span>
                <span className="text-xs font-bold font-headline leading-tight">
                  {isDarkMode ? 'Executive Dark' : 'Vibrant Light'}
                </span>
              </div>
            </button>

            {/* Tab Navigation Switches */}
            <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl border shrink-0 shadow-xs ${theme.tabContainer}`}>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white shadow-xs'
                    : `${theme.bodyText} hover:${theme.heading}`
                }`}
              >
                <span className="material-symbols-outlined text-base">person</span>
                <span>Dossier & Payroll</span>
              </button>

              <button
                onClick={() => setActiveTab('team')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'team'
                    ? 'bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white shadow-xs'
                    : `${theme.bodyText} hover:${theme.heading}`
                }`}
              >
                <span className="material-symbols-outlined text-base">groups</span>
                <span>My Team ({team.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('ai-studio')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'ai-studio'
                    ? 'bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white shadow-xs'
                    : `${theme.bodyText} hover:${theme.heading}`
                }`}
              >
                <span className="material-symbols-outlined text-base">movie_creation</span>
                <span>AI Media Studio</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TAB 1: Personal Dossier & Payroll Status */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 Cols): Personal Info (EDITABLE) */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`rounded-3xl p-6 border space-y-5 transition-all duration-300 ${theme.card}`}>
              <div className={`flex items-center justify-between pb-3 border-b ${theme.subtleBorder}`}>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-xl ${theme.accentText}`}>edit_note</span>
                    <h2 className={`font-headline font-bold text-base ${theme.heading}`}>
                      Personal Information
                    </h2>
                  </div>
                  <p className="text-[11px] text-[#047857] dark:text-[#34d399] font-bold">
                    Editable by Employee • Direct Sync to Corporate Profile
                  </p>
                </div>
                {!isEditingPersonal && (
                  <button
                    onClick={() => setIsEditingPersonal(true)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isDarkMode
                        ? 'bg-[#1a1d26] hover:bg-[#232834] text-[#fcd34d] border-[#384152]'
                        : 'bg-[#faf8f5] hover:bg-[#f5efe4] text-[#b45309] border-[#e8decb]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>Edit Info</span>
                  </button>
                )}
              </div>

              {isEditingPersonal ? (
                <form onSubmit={handleSavePersonalInfo} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme.subtext}`}>
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${theme.input}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme.subtext}`}>
                      Primary Contact Number (Phone)
                    </label>
                    <input
                      type="tel"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className={`w-full font-mono px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${theme.input}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme.subtext}`}>
                      Official / Personal Email ID
                    </label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${theme.input}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme.subtext}`}>
                      Emergency Family Contact
                    </label>
                    <input
                      type="text"
                      value={editEmergency}
                      onChange={(e) => setEditEmergency(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${theme.input}`}
                    />
                  </div>

                  <div className={`flex items-center justify-end gap-2.5 pt-2 border-t ${theme.subtleBorder}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setEditName(profile.name);
                        setEditPhone(profile.phone);
                        setEditEmail(profile.email);
                        setEditEmergency(profile.emergencyContact);
                        setIsEditingPersonal(false);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                        isDarkMode
                          ? 'bg-[#1a1d26] hover:bg-[#232834] text-[#9ca3af]'
                          : 'bg-[#faf8f5] hover:bg-[#f4eee2] text-[#57534e]'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white text-xs font-bold shadow-md hover:brightness-110 cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3.5">
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${theme.innerBox}`}>
                    <div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider block ${theme.subtext}`}>
                        Full Name
                      </span>
                      <span className={`text-sm font-bold ${theme.heading}`}>{profile.name}</span>
                    </div>
                    <span className="material-symbols-outlined text-[#047857] dark:text-[#34d399] text-base">verified</span>
                  </div>

                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${theme.innerBox}`}>
                    <div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider block ${theme.subtext}`}>
                        Primary Phone
                      </span>
                      <span className={`text-sm font-mono font-bold ${theme.accentText}`}>{profile.phone}</span>
                    </div>
                    <span className="text-[11px] text-[#047857] dark:text-[#34d399] font-bold">WhatsApp Active</span>
                  </div>

                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${theme.innerBox}`}>
                    <div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider block ${theme.subtext}`}>
                        Email Address
                      </span>
                      <span className={`text-sm font-mono ${theme.heading}`}>{profile.email}</span>
                    </div>
                    <span className="material-symbols-outlined text-[#047857] dark:text-[#34d399] text-base">mark_email_read</span>
                  </div>

                  <div className={`p-3.5 rounded-xl border ${theme.innerBox}`}>
                    <span className={`text-[10px] uppercase font-bold tracking-wider block ${theme.subtext}`}>
                      Emergency Kin Contact
                    </span>
                    <span className={`text-sm font-mono font-semibold ${theme.bodyText}`}>{profile.emergencyContact}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Locked Credentials Info Box */}
            <div className={`rounded-3xl p-6 border space-y-3.5 transition-all duration-300 ${theme.card}`}>
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-xl ${theme.accentText}`}>lock</span>
                <h3 className={`font-headline font-bold text-sm ${theme.heading}`}>
                  Corporate Syndicate Identity (Locked)
                </h3>
              </div>
              <p className={`text-xs leading-relaxed ${theme.bodyText}`}>
                The parameters below are cryptographically anchored to corporate registry and can only be altered by Corporate Syndicate HR.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div className={`p-3 rounded-xl border ${theme.innerBox}`}>
                  <span className={`text-[10px] block font-bold ${theme.subtext}`}>Employee ID</span>
                  <span className={`font-mono font-bold text-sm ${theme.accentText}`}>{profile.employeeId}</span>
                </div>
                <div className={`p-3 rounded-xl border ${theme.innerBox}`}>
                  <span className={`text-[10px] block font-bold ${theme.subtext}`}>Induction Date</span>
                  <span className={`font-mono font-semibold ${theme.heading}`}>{profile.dateOfJoining}</span>
                </div>
                <div className={`p-3 rounded-xl border col-span-2 ${theme.innerBox}`}>
                  <span className={`text-[10px] block font-bold ${theme.subtext}`}>Security Clearance</span>
                  <span className="font-bold text-[#047857] dark:text-[#34d399]">{profile.clearanceLevel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Official Payroll & Overtime Status (READ-ONLY) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Payroll Status Card */}
            <div className={`rounded-3xl p-6 sm:p-7 border space-y-5 transition-all duration-300 ${theme.card}`}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b ${theme.subtleBorder}`}>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#047857] dark:text-[#34d399] text-xl">payments</span>
                    <h2 className={`font-headline font-bold text-base ${theme.heading}`}>
                      Official Executive Payroll Status
                    </h2>
                  </div>
                  <p className={`text-[11px] ${theme.subtext}`}>
                    Verified Corporate Disbursement • {profile.payrollStatus.cycle}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto border shadow-xs ${
                    isDarkMode
                      ? 'bg-[#064e3b]/50 text-[#6ee7b7] border-[#065f46]'
                      : 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#047857] dark:bg-[#34d399] animate-pulse" />
                  {profile.payrollStatus.paymentStatus}
                </span>
              </div>

              {/* Big Net Payable Banner */}
              <div
                className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-[#2a2012] via-[#1c1813] to-[#171922] border-[#78350f]'
                    : 'bg-gradient-to-r from-[#fef3c7] via-[#fffbeb] to-[#faf8f5] border-[#fde68a]'
                }`}
              >
                <div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider block ${theme.subtext}`}>
                    Current Cycle Net Remuneration
                  </span>
                  <div className={`text-3xl font-headline font-bold font-mono mt-0.5 ${theme.accentText}`}>
                    ₹{profile.payrollStatus.netPayable.toLocaleString('en-IN')}{' '}
                    <span className={`text-xs font-normal ${theme.bodyText}`}>INR (Tax Adjusted)</span>
                  </div>
                </div>
                <div className={`sm:text-right font-mono text-xs space-y-1 ${theme.bodyText}`}>
                  <div>
                    Disbursed: <span className={`font-bold ${theme.heading}`}>{profile.payrollStatus.lastDisbursedDate}</span>
                  </div>
                  <div>
                    Account: <span className={`font-bold ${theme.accentText}`}>{profile.payrollStatus.bankAccountMasked}</span>
                  </div>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-4 rounded-xl border ${theme.innerBox}`}>
                  <span className={`text-[10px] uppercase font-bold block ${theme.subtext}`}>Base Retainer</span>
                  <div className={`text-lg font-bold font-mono mt-1 ${theme.heading}`}>
                    ₹{profile.payrollStatus.baseRetainer.toLocaleString('en-IN')}
                  </div>
                  <span className={`text-[10px] ${theme.subtext}`}>Guaranteed Monthly</span>
                </div>

                <div className={`p-4 rounded-xl border ${theme.innerBox}`}>
                  <span className={`text-[10px] uppercase font-bold block ${theme.subtext}`}>Overtime Pay</span>
                  <div className="text-lg font-bold font-mono text-[#047857] dark:text-[#34d399] mt-1">
                    ₹{profile.overtimeStatus.overtimePay.toLocaleString('en-IN')}
                  </div>
                  <span className={`text-[10px] ${theme.subtext}`}>18.5 Verified Hours</span>
                </div>

                <div className={`p-4 rounded-xl border ${theme.innerBox}`}>
                  <span className={`text-[10px] uppercase font-bold block ${theme.subtext}`}>Banquet Gala Bonus</span>
                  <div className={`text-lg font-bold font-mono mt-1 ${theme.accentText}`}>
                    ₹{profile.overtimeStatus.festivalBonus.toLocaleString('en-IN')}
                  </div>
                  <span className={`text-[10px] ${theme.subtext}`}>Festival Performance</span>
                </div>
              </div>

              {/* Transaction UTR & Verification */}
              <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${theme.innerBox}`}>
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#047857] dark:text-[#34d399] text-lg">receipt_long</span>
                  <div>
                    <span className={`text-[10px] block font-bold ${theme.subtext}`}>NEFT Transaction UTR</span>
                    <span className={`font-mono font-bold ${theme.heading}`}>{profile.payrollStatus.utrNumber}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onShowToast('UTR Copied', `Copied ${profile.payrollStatus.utrNumber} to clipboard.`)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs border transition-colors self-start sm:self-auto cursor-pointer shadow-xs ${
                    isDarkMode
                      ? 'bg-[#15171e] hover:bg-[#20242f] text-[#fcd34d] border-[#384152]'
                      : 'bg-white hover:bg-[#f4eee2] text-[#b45309] border-[#e8decb]'
                  }`}
                >
                  Copy UTR
                </button>
              </div>
            </div>

            {/* Overtime Status Card */}
            <div className={`rounded-3xl p-6 sm:p-7 border space-y-5 transition-all duration-300 ${theme.card}`}>
              <div className={`flex items-center justify-between pb-3 border-b ${theme.subtleBorder}`}>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-xl ${theme.accentText}`}>more_time</span>
                    <h2 className={`font-headline font-bold text-base ${theme.heading}`}>
                      Executive Overtime & Gratuity Log
                    </h2>
                  </div>
                  <p className={`text-[11px] ${theme.subtext}`}>
                    Audited by {profile.overtimeStatus.approvalOfficer}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs border ${
                    isDarkMode
                      ? 'bg-[#064e3b]/50 text-[#6ee7b7] border-[#065f46]'
                      : 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">verified_user</span>
                  {profile.overtimeStatus.verificationStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border space-y-2 ${theme.innerBox}`}>
                  <span className={`text-[10px] uppercase font-bold tracking-wider block ${theme.subtext}`}>
                    Verified Overtime Shift
                  </span>
                  <div className={`text-2xl font-bold font-mono ${theme.heading}`}>
                    {profile.overtimeStatus.hoursLogged} <span className={`text-xs font-normal ${theme.subtext}`}>hrs</span>
                  </div>
                  <p className={`text-xs ${theme.bodyText}`}>
                    Tariff: <strong className={theme.accentText}>{profile.overtimeStatus.hourlyMultiplier}</strong>
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${theme.innerBox}`}>
                  <span className={`text-[10px] uppercase font-bold tracking-wider block ${theme.subtext}`}>
                    Total Extra Remuneration
                  </span>
                  <div className="text-2xl font-bold font-mono text-[#047857] dark:text-[#34d399]">
                    ₹{profile.overtimeStatus.totalExtra.toLocaleString('en-IN')}
                  </div>
                  <p className={`text-xs ${theme.bodyText}`}>
                    Includes Overtime + Festival Banquet Bonus
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: My Team Roster & Fleet Controls */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          {/* Team Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border space-y-1 transition-all duration-300 ${theme.card}`}>
              <span className={`text-[10px] uppercase font-bold tracking-wider block ${theme.subtext}`}>
                Total Direct Reports
              </span>
              <div className={`text-2xl font-bold font-mono ${theme.heading}`}>
                {team.length} <span className={`text-xs font-normal ${theme.subtext}`}>personnel</span>
              </div>
              <span className="text-[11px] text-[#047857] dark:text-[#34d399] font-bold">Across 6 Metro Outposts</span>
            </div>

            <div className={`p-5 rounded-2xl border space-y-1 transition-all duration-300 ${theme.card}`}>
              <span className={`text-[10px] uppercase font-bold tracking-wider block ${theme.subtext}`}>
                Active On Duty
              </span>
              <div className="text-2xl font-bold font-mono text-[#047857] dark:text-[#34d399]">
                {activeCount} <span className={`text-xs font-normal ${theme.subtext}`}>cleared</span>
              </div>
              <span className="text-[11px] text-[#047857] dark:text-[#34d399] font-bold">Full POS & Kitchen Access</span>
            </div>

            <div className={`p-5 rounded-2xl border space-y-1 transition-all duration-300 ${theme.card}`}>
              <span className={`text-[10px] uppercase font-bold tracking-wider block ${theme.subtext}`}>
                Banned / Revoked
              </span>
              <div className="text-2xl font-bold font-mono text-[#dc2626]">
                {bannedCount} <span className={`text-xs font-normal ${theme.subtext}`}>blacklisted</span>
              </div>
              <span className="text-[11px] text-[#dc2626] font-bold">Fleet access suspended</span>
            </div>

            <div className={`p-5 rounded-2xl border space-y-1 transition-all duration-300 ${theme.card}`}>
              <span className={`text-[10px] uppercase font-bold tracking-wider block ${theme.subtext}`}>
                Direct Team Payroll
              </span>
              <div className={`text-2xl font-bold font-mono ${theme.accentText}`}>
                ₹{(totalTeamPayroll / 100000).toFixed(1)} Lakhs
              </div>
              <span className={`text-[11px] font-medium ${theme.subtext}`}>Monthly Base Commitment</span>
            </div>
          </div>

          {/* Team Filter & Action Console */}
          <div className={`border rounded-3xl overflow-hidden transition-all duration-300 ${theme.card}`}>
            <div className={`p-4 sm:p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-3 ${theme.innerBox}`}>
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <span className={`material-symbols-outlined text-lg ${theme.subtext}`}>search</span>
                <input
                  type="text"
                  placeholder="Search team by name, ID, phone, role..."
                  value={searchTeam}
                  onChange={(e) => setSearchTeam(e.target.value)}
                  className={`w-full text-xs px-3.5 py-2 rounded-xl border focus:outline-none focus:ring-2 ${theme.input}`}
                />
              </div>

              {/* Department & Status Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className={`text-xs font-semibold px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 cursor-pointer shadow-xs ${theme.input}`}
                >
                  <option value="all">All Guilds</option>
                  <option value="kitchen">Kitchen Brigade</option>
                  <option value="service">Floor Service</option>
                  <option value="bar">Bar & Sommelier</option>
                  <option value="housekeeping">Facility & Hygiene</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`text-xs font-semibold px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 cursor-pointer shadow-xs ${theme.input}`}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="banned">Banned Only</option>
                </select>

                <button
                  type="button"
                  onClick={() => setIsAddEmployeeModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-sm">person_add</span>
                  <span>+ Add Employee</span>
                </button>
              </div>
            </div>

            {/* Team Members Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`text-[10px] uppercase tracking-wider border-b ${theme.tableHead}`}>
                    <th className="py-3.5 px-6 font-bold">Employee & Identity</th>
                    <th className="py-3.5 px-4 font-bold">Guild Department</th>
                    <th className="py-3.5 px-4 font-bold">Contact Details</th>
                    <th className="py-3.5 px-4 text-right font-bold">Base Retainer</th>
                    <th className="py-3.5 px-4 font-bold">Status & Clearance</th>
                    <th className="py-3.5 px-6 text-right font-bold">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme.tableDivide}`}>
                  {filteredTeam.map((member) => (
                    <tr key={member.id} className={`transition-colors ${theme.tableRowHover}`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className={`w-10 h-10 rounded-xl object-cover ring-2 shadow-xs ${
                              member.status === 'banned' ? 'ring-[#dc2626] grayscale' : isDarkMode ? 'ring-[#384152]' : 'ring-[#e8decb]'
                            }`}
                          />
                          <div className="flex flex-col">
                            <span className={`font-headline font-bold text-sm ${theme.heading}`}>
                              {member.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md font-bold border ${
                                  isDarkMode
                                    ? 'bg-[#1e2330] text-[#fcd34d] border-[#384152]'
                                    : 'bg-[#faf8f5] text-[#b45309] border-[#e8decb]'
                                }`}
                              >
                                {member.employeeId}
                              </span>
                              <span className={`text-[11px] font-medium ${theme.subtext}`}>{member.outpost}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className={`font-bold ${theme.heading}`}>{member.roleTitle}</span>
                          <span className={`text-[10px] uppercase font-semibold mt-0.5 ${theme.subtext}`}>
                            {member.department}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-xs">
                        <div className={`font-bold ${theme.accentText}`}>{member.phone}</div>
                        <div className={`text-[11px] font-medium ${theme.subtext}`}>{member.email}</div>
                      </td>

                      <td className={`py-4 px-4 text-right font-mono font-bold text-sm ${theme.heading}`}>
                        ₹{member.baseSalary.toLocaleString('en-IN')}{' '}
                        <span className={`text-[10px] font-normal ${theme.subtext}`}>/mo</span>
                      </td>

                      <td className="py-4 px-4">
                        {member.status === 'banned' ? (
                          <div className="space-y-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#fef2f2] dark:bg-[#450a0a] text-[#dc2626] dark:text-[#f87171] border border-[#fecaca] dark:border-[#7f1d1d] flex items-center gap-1 w-max">
                              <span className="material-symbols-outlined text-xs">block</span>
                              Banned / Revoked
                            </span>
                            {member.banReason && (
                              <p className="text-[10px] text-[#dc2626] max-w-xs truncate" title={member.banReason}>
                                {member.banReason}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ecfdf5] dark:bg-[#064e3b]/50 text-[#065f46] dark:text-[#6ee7b7] border border-[#a7f3d0] dark:border-[#065f46] flex items-center gap-1 w-max">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#047857] dark:bg-[#34d399]" />
                            Active On Duty
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Ban / Unban Button */}
                          {member.status === 'banned' ? (
                            <button
                              type="button"
                              onClick={() => handleUnbanEmployee(member)}
                              className="px-3 py-1.5 rounded-xl bg-[#ecfdf5] dark:bg-[#064e3b]/60 hover:bg-[#047857] text-[#065f46] dark:text-[#6ee7b7] hover:text-white font-bold text-xs border border-[#a7f3d0] dark:border-[#065f46] transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                              title="Reinstate Employee Access"
                            >
                              <span className="material-symbols-outlined text-xs">lock_open</span>
                              <span>Unban</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setBanModalTarget(member)}
                              className="px-3 py-1.5 rounded-xl bg-[#fef2f2] dark:bg-[#450a0a] hover:bg-[#dc2626] text-[#b91c1c] dark:text-[#fca5a5] hover:text-white font-bold text-xs border border-[#fecaca] dark:border-[#7f1d1d] transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                              title="Ban and Revoke Fleet Access"
                            >
                              <span className="material-symbols-outlined text-xs">block</span>
                              <span>Ban</span>
                            </button>
                          )}

                          {/* Remove Employee Button */}
                          <button
                            type="button"
                            onClick={() => setRemoveConfirmTarget(member)}
                            className={`px-3 py-1.5 rounded-xl hover:bg-[#dc2626] hover:text-white font-bold text-xs border hover:border-transparent transition-all cursor-pointer flex items-center gap-1 shadow-xs ${
                              isDarkMode
                                ? 'bg-[#15171e] text-[#9ca3af] border-[#384152]'
                                : 'bg-[#faf8f5] text-[#78716c] border-[#e8decb]'
                            }`}
                            title="Remove Employee from Roster"
                          >
                            <span className="material-symbols-outlined text-xs">delete</span>
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI Media Studio (Veo 3 Video & Gemini 3.1 Flash Image) */}
      {activeTab === 'ai-studio' && (
        <div className="space-y-8">
          {/* Studio Banner */}
          <div className={`p-6 sm:p-7 rounded-3xl border relative overflow-hidden transition-all duration-300 ${theme.card}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-2xl text-[#f59e0b]">auto_videocam</span>
                  <h2 className={`font-headline font-bold text-xl ${theme.heading}`}>
                    Executive AI Gastronomy Media Suite
                  </h2>
                </div>
                <p className={`text-xs max-w-2xl leading-relaxed ${theme.bodyText}`}>
                  Direct multi-modal generation for Kizen Empire culinary campaigns. Generate hyper-realistic gastronomy videos using{' '}
                  <strong className={theme.accentText}>veo-3.1-fast-generate-preview</strong> (16:9 & 9:16) and synthesize luxury assets via{' '}
                  <strong className={theme.accentText}>gemini-3.1-flash-image-preview</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border ${theme.innerBox} ${theme.accentText}`}>
                  Veo 3 Fast + Gemini 3.1 Flash
                </span>
              </div>
            </div>
          </div>

          {/* Grid of Two Studios: Veo 3 Video Studio + Gemini Flash Image Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* 1. Veo 3 Video Generator */}
            <div className={`rounded-3xl p-6 sm:p-7 border space-y-6 transition-all duration-300 ${theme.card}`}>
              <div className={`flex items-center justify-between pb-3 border-b ${theme.subtleBorder}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">videocam</span>
                  </div>
                  <div>
                    <h3 className={`font-headline font-bold text-base ${theme.heading}`}>
                      Veo 3 Video Generation
                    </h3>
                    <p className={`text-[11px] ${theme.subtext}`}>
                      Model: <code className="font-mono text-[#f59e0b]">veo-3.1-fast-generate-preview</code>
                    </p>
                  </div>
                </div>

                {/* Aspect Ratio Selector (Mandatory 16:9 or 9:16) */}
                <div className="flex items-center gap-1 bg-black/10 dark:bg-white/10 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setVideoAspectRatio('16:9')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      videoAspectRatio === '16:9'
                        ? 'bg-[#f59e0b] text-white shadow-xs'
                        : `${theme.bodyText} hover:${theme.heading}`
                    }`}
                  >
                    16:9 Landscape
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoAspectRatio('9:16')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      videoAspectRatio === '9:16'
                        ? 'bg-[#f59e0b] text-white shadow-xs'
                        : `${theme.bodyText} hover:${theme.heading}`
                    }`}
                  >
                    9:16 Portrait
                  </button>
                </div>
              </div>

              {/* Prompt Input & Presets */}
              <div className="space-y-3">
                <label className={`block text-xs font-bold uppercase tracking-wider ${theme.subtext}`}>
                  Cinematography Prompt
                </label>
                <textarea
                  rows={3}
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="Describe culinary textures, camera movements, lighting, and action..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 resize-none ${theme.input}`}
                />

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <span className={`text-[10px] uppercase font-bold tracking-wider block ${theme.subtext}`}>
                    Royal Haute Cuisine Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Slow-mo steam rising from clay handi dum pukht with saffron essence',
                      '24K gold leaf laid on smoked galouti kebab with micro-greens in 4K',
                      'High-velocity cocktail flaring with Himalayan pine mist and glowing embers',
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setVideoPrompt(preset)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border text-left truncate max-w-full transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'bg-[#1a1d26] hover:bg-[#232834] text-[#d1d5db] border-[#384152]'
                            : 'bg-[#faf8f5] hover:bg-[#f5efe4] text-[#57534e] border-[#e8decb]'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resolution Picker & Trigger */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${theme.subtext}`}>Resolution:</span>
                    <button
                      type="button"
                      onClick={() => setVideoResolution('720p')}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-mono font-bold cursor-pointer ${
                        videoResolution === '720p'
                          ? 'bg-[#f59e0b] text-white border-[#f59e0b]'
                          : isDarkMode ? 'bg-[#1a1d26] text-[#9ca3af] border-[#384152]' : 'bg-[#faf8f5] text-[#57534e] border-[#e8decb]'
                      }`}
                    >
                      720p HD
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoResolution('1080p')}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-mono font-bold cursor-pointer ${
                        videoResolution === '1080p'
                          ? 'bg-[#f59e0b] text-white border-[#f59e0b]'
                          : isDarkMode ? 'bg-[#1a1d26] text-[#9ca3af] border-[#384152]' : 'bg-[#faf8f5] text-[#57534e] border-[#e8decb]'
                      }`}
                    >
                      1080p FHD
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isVideoGenerating}
                    onClick={handleGenerateVideo}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <span className={`material-symbols-outlined text-base ${isVideoGenerating ? 'animate-spin' : ''}`}>
                      {isVideoGenerating ? 'hourglass_top' : 'movie'}
                    </span>
                    <span>{isVideoGenerating ? 'Generating Video...' : 'Generate with Veo 3'}</span>
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {videoStatusMsg && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 animate-pulse ${
                  isDarkMode ? 'bg-[#1a1d26] border-[#384152]' : 'bg-[#fffbeb] border-[#fde68a]'
                }`}>
                  <span className="material-symbols-outlined text-[#f59e0b] text-xl animate-spin">
                    progress_activity
                  </span>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${theme.heading}`}>Veo 3 Neural Render Pipeline</span>
                    <span className={`text-[11px] ${theme.subtext}`}>{videoStatusMsg}</span>
                  </div>
                </div>
              )}

              {/* Video Player Output */}
              {generatedVideoUrl ? (
                <div className="space-y-3 pt-2">
                  <div
                    className={`rounded-2xl overflow-hidden border bg-black flex items-center justify-center shadow-lg ${
                      videoAspectRatio === '9:16' ? 'aspect-[9/16] max-w-xs mx-auto' : 'aspect-video'
                    }`}
                  >
                    <video
                      src={generatedVideoUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#047857] dark:text-[#34d399] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Render Complete ({videoAspectRatio})
                    </span>
                    <a
                      href={generatedVideoUrl}
                      download={`kizen-veo3-${Date.now()}.mp4`}
                      className="px-3.5 py-1.5 rounded-xl bg-[#047857] text-white text-xs font-bold flex items-center gap-1 shadow-xs hover:brightness-110"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      Download MP4
                    </a>
                  </div>
                </div>
              ) : (
                <div
                  className={`rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center space-y-2 ${
                    videoAspectRatio === '9:16' ? 'aspect-[9/16] max-w-xs mx-auto' : 'aspect-video'
                  } ${isDarkMode ? 'border-[#2d323f] bg-[#111319]' : 'border-[#e8decb] bg-[#faf8f5]'}`}
                >
                  <span className={`material-symbols-outlined text-4xl ${theme.subtext}`}>smart_display</span>
                  <p className={`text-xs font-bold ${theme.heading}`}>No Video Generated Yet</p>
                  <p className={`text-[11px] max-w-xs ${theme.subtext}`}>
                    Select an aspect ratio ({videoAspectRatio}), fine-tune your prompt, and click Generate to start Veo 3 fast video synthesis.
                  </p>
                </div>
              )}
            </div>

            {/* 2. Gemini 3.1 Flash Image Creator & Editor */}
            <div className={`rounded-3xl p-6 sm:p-7 border space-y-6 transition-all duration-300 ${theme.card}`}>
              <div className={`flex items-center justify-between pb-3 border-b ${theme.subtleBorder}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#ea580c] to-[#e11d48] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-lg">palette</span>
                  </div>
                  <div>
                    <h3 className={`font-headline font-bold text-base ${theme.heading}`}>
                      Image Creator & Editor
                    </h3>
                    <p className={`text-[11px] ${theme.subtext}`}>
                      Model: <code className="font-mono text-[#ea580c]">gemini-3.1-flash-image-preview</code>
                    </p>
                  </div>
                </div>

                {/* Mode Selector */}
                <div className="flex items-center gap-1 bg-black/10 dark:bg-white/10 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setImageMode('generate')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      imageMode === 'generate'
                        ? 'bg-[#ea580c] text-white shadow-xs'
                        : `${theme.bodyText} hover:${theme.heading}`
                    }`}
                  >
                    Create New
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('edit')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      imageMode === 'edit'
                        ? 'bg-[#ea580c] text-white shadow-xs'
                        : `${theme.bodyText} hover:${theme.heading}`
                    }`}
                  >
                    Edit Image
                  </button>
                </div>
              </div>

              {/* Edit Mode Source Preview */}
              {imageMode === 'edit' && (
                <div className={`p-3.5 rounded-2xl border flex items-center gap-3.5 ${theme.innerBox}`}>
                  <img
                    src={editSourceImage}
                    alt="Source for editing"
                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-[#ea580c]"
                  />
                  <div className="space-y-1 flex-1">
                    <span className={`text-xs font-bold block ${theme.heading}`}>Reference Asset Selected</span>
                    <p className={`text-[11px] leading-tight ${theme.subtext}`}>
                      Prompt will apply stylistic edits, garnishes, lighting changes, or background transitions onto this image.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditSourceImage(profile.avatarUrl)}
                    className="text-[10px] uppercase font-bold text-[#ea580c] hover:underline"
                  >
                    Reset Avatar
                  </button>
                </div>
              )}

              {/* Prompt Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${theme.subtext}`}>
                    {imageMode === 'generate' ? 'Image Generation Prompt' : 'Editing Instruction Prompt'}
                  </label>
                  {/* Aspect Ratio */}
                  <div className="flex items-center gap-1 text-[11px]">
                    {(['1:1', '16:9', '9:16', '4:3'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setImageAspectRatio(ratio)}
                        className={`px-2 py-0.5 rounded-md font-mono cursor-pointer ${
                          imageAspectRatio === ratio
                            ? 'bg-[#ea580c] text-white font-bold'
                            : isDarkMode ? 'text-[#9ca3af] hover:text-white' : 'text-[#78716c] hover:text-[#1c1917]'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder={
                    imageMode === 'generate'
                      ? 'E.g. Saffron-braised lamb shanks on hand-hammered brass platters with pomegranates...'
                      : 'E.g. Add a dusting of edible Kashmiri gold leaf and saffron strands to the dish...'
                  }
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 resize-none ${theme.input}`}
                />

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <span className={`text-[10px] uppercase font-bold tracking-wider block ${theme.subtext}`}>
                    Haute Gastronomy Prompts:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Awadhi kakori kebab served on charcoal grill with smoked cloves and mint foam',
                      'Kashmiri kahwa tea poured from royal copper samovar into crystal glass',
                      'Executive chef inspecting plating with tweezers under warm ambient brass lights',
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImagePrompt(preset)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border text-left truncate max-w-full transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'bg-[#1a1d26] hover:bg-[#232834] text-[#d1d5db] border-[#384152]'
                            : 'bg-[#faf8f5] hover:bg-[#f5efe4] text-[#57534e] border-[#e8decb]'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="button"
                    disabled={isImageLoading}
                    onClick={handleGenerateOrEditImage}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ea580c] to-[#e11d48] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <span className={`material-symbols-outlined text-base ${isImageLoading ? 'animate-spin' : ''}`}>
                      {isImageLoading ? 'sync' : 'auto_fix_high'}
                    </span>
                    <span>
                      {isImageLoading
                        ? 'Synthesizing...'
                        : imageMode === 'generate'
                        ? 'Generate Image'
                        : 'Apply Image Edit'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Image Output Display */}
              {generatedImageUrl ? (
                <div className="space-y-3 pt-2">
                  <div className="rounded-2xl overflow-hidden border shadow-lg max-h-80 flex items-center justify-center bg-black">
                    <img
                      src={generatedImageUrl}
                      alt="AI Result"
                      className="max-h-80 w-auto object-contain mx-auto"
                    />
                  </div>

                  {imageTextResult && (
                    <p className={`text-xs p-3 rounded-xl border ${theme.innerBox} ${theme.bodyText}`}>
                      {imageTextResult}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setProfile((prev) => ({ ...prev, avatarUrl: generatedImageUrl }));
                        setEditSourceImage(generatedImageUrl);
                        onShowToast('Avatar Updated', 'Selected generated image as executive profile avatar.', 'success');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white text-xs font-bold shadow-xs hover:brightness-110 cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">badge</span>
                      Set as Profile Avatar
                    </button>

                    <a
                      href={generatedImageUrl}
                      download={`kizen-asset-${Date.now()}.png`}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 ${
                        isDarkMode
                          ? 'bg-[#1e2330] hover:bg-[#252c3c] text-[#fcd34d] border-[#384152]'
                          : 'bg-white hover:bg-[#f5efe4] text-[#b45309] border-[#e8decb]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      Download Asset
                    </a>
                  </div>
                </div>
              ) : (
                <div
                  className={`rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center space-y-2 aspect-video ${
                    isDarkMode ? 'border-[#2d323f] bg-[#111319]' : 'border-[#e8decb] bg-[#faf8f5]'
                  }`}
                >
                  <span className={`material-symbols-outlined text-4xl ${theme.subtext}`}>image</span>
                  <p className={`text-xs font-bold ${theme.heading}`}>Visual Canvas Waiting</p>
                  <p className={`text-[11px] max-w-xs ${theme.subtext}`}>
                    Enter your recipe prompt or garnish instruction to generate photographic assets with Gemini 3.1 Flash.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Add New Employee */}
      {isAddEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className={`border rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto ${theme.card}`}>
            <div className={`flex items-center justify-between pb-3 border-b ${theme.subtleBorder}`}>
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] flex items-center justify-center text-white shadow-xs">
                  <span className="material-symbols-outlined text-xl">person_add</span>
                </div>
                <div>
                  <h3 className={`font-headline font-bold text-lg ${theme.heading}`}>
                    Onboard New Team Member
                  </h3>
                  <p className={`text-xs ${theme.subtext}`}>
                    Add official personnel to your direct report fleet roster
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddEmployeeModalOpen(false)}
                className={`p-1 rounded-xl cursor-pointer ${
                  isDarkMode ? 'text-[#9ca3af] hover:text-white hover:bg-[#1a1d26]' : 'text-[#78716c] hover:text-[#1c1917] hover:bg-[#faf8f5]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme.subtext}`}>
                    Employee Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kabir Chawla"
                    value={newEmpName}
                    onChange={(e) => setNewEmpName(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${theme.input}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme.subtext}`}>
                    Employee ID
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmpId}
                    onChange={(e) => setNewEmpId(e.target.value)}
                    className={`w-full font-mono font-bold px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${theme.input} ${theme.accentText}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme.subtext}`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={newEmpPhone}
                    onChange={(e) => setNewEmpPhone(e.target.value)}
                    className={`w-full font-mono px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${theme.input}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme.subtext}`}>
                    Corporate Email ID
                  </label>
                  <input
                    type="email"
                    placeholder="name@kizenempire.in"
                    value={newEmpEmail}
                    onChange={(e) => setNewEmpEmail(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${theme.input}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme.subtext}`}>
                    Department Guild
                  </label>
                  <select
                    value={newEmpDept}
                    onChange={(e) => setNewEmpDept(e.target.value as any)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${theme.input}`}
                  >
                    <option value="kitchen">Kitchen Brigade</option>
                    <option value="service">Floor Service</option>
                    <option value="bar">Bar & Sommelier</option>
                    <option value="housekeeping">Facility & Hygiene</option>
                    <option value="security">VIP Security Protocol</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme.subtext}`}>
                    Role Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmpRole}
                    onChange={(e) => setNewEmpRole(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${theme.input}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme.subtext}`}>
                    Assigned Outpost
                  </label>
                  <select
                    value={newEmpOutpost}
                    onChange={(e) => setNewEmpOutpost(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${theme.input}`}
                  >
                    <option value="Mumbai BKC Flagship">Mumbai BKC Flagship</option>
                    <option value="New Delhi Lutyens">New Delhi Lutyens</option>
                    <option value="Bengaluru Indiranagar">Bengaluru Indiranagar</option>
                    <option value="Hyderabad Jubilee Hills">Hyderabad Jubilee Hills</option>
                    <option value="Kolkata Park Street">Kolkata Park Street</option>
                    <option value="Chennai Nungambakkam">Chennai Nungambakkam</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme.subtext}`}>
                    Monthly Base Salary (₹ INR)
                  </label>
                  <input
                    type="number"
                    min="10000"
                    step="5000"
                    required
                    value={newEmpSalary}
                    onChange={(e) => setNewEmpSalary(Number(e.target.value) || 0)}
                    className={`w-full font-mono font-bold px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 ${theme.input} ${theme.accentText}`}
                  />
                </div>
              </div>

              <div className={`flex items-center justify-end gap-2.5 pt-3 border-t ${theme.subtleBorder}`}>
                <button
                  type="button"
                  onClick={() => setIsAddEmployeeModalOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                    isDarkMode ? 'bg-[#1a1d26] hover:bg-[#232834] text-[#9ca3af]' : 'bg-[#faf8f5] hover:bg-[#f4eee2] text-[#57534e]'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white text-xs font-bold shadow-md hover:brightness-110 cursor-pointer"
                >
                  Confirm Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Ban Employee Confirmation */}
      {banModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className={`border rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 relative ${theme.card}`}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#fef2f2] dark:bg-[#450a0a] text-[#dc2626] flex items-center justify-center shrink-0 border border-[#fecaca] dark:border-[#7f1d1d]">
                <span className="material-symbols-outlined text-2xl">block</span>
              </div>
              <div>
                <h3 className={`font-headline font-bold text-base ${theme.heading}`}>
                  Ban & Revoke Fleet Clearance
                </h3>
                <p className={`text-xs ${theme.subtext}`}>
                  Target: <strong className="text-[#dc2626]">{banModalTarget.name}</strong> ({banModalTarget.employeeId})
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmBan} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme.subtext}`}>
                  Administrative Ban Justification
                </label>
                <select
                  value={banReasonInput}
                  onChange={(e) => setBanReasonInput(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#dc2626]/50 ${theme.input}`}
                >
                  <option value="Violation of HACCP Kitchen Safety & Hygiene Protocol">
                    Violation of HACCP Kitchen Safety & Hygiene Protocol
                  </option>
                  <option value="Unauthorized POS Cash Register Manipulation">
                    Unauthorized POS Cash Register Manipulation
                  </option>
                  <option value="Breach of Syndicate Confidential Culinary Formulas">
                    Breach of Syndicate Confidential Culinary Formulas
                  </option>
                  <option value="Gross Insubordination & Guest Protocol Failure">
                    Gross Insubordination & Guest Protocol Failure
                  </option>
                  <option value="Unexcused Absence During High-Volume Festive Shift">
                    Unexcused Absence During High-Volume Festive Shift
                  </option>
                </select>
              </div>

              <p className="text-[11px] text-[#dc2626] bg-[#fef2f2] dark:bg-[#450a0a]/50 border border-[#fecaca] dark:border-[#7f1d1d] p-3 rounded-xl leading-relaxed">
                Warning: Banning this employee will immediately revoke digital POS access, disable biometric punch-in, and suspend payroll disbursement pending guild tribunal.
              </p>

              <div className={`flex items-center justify-end gap-2.5 pt-2 border-t ${theme.subtleBorder}`}>
                <button
                  type="button"
                  onClick={() => setBanModalTarget(null)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                    isDarkMode ? 'bg-[#1a1d26] hover:bg-[#232834] text-[#9ca3af]' : 'bg-[#faf8f5] hover:bg-[#f4eee2] text-[#57534e]'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Confirm Ban & Revoke Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Remove Employee Confirmation */}
      {removeConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className={`border rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 relative ${theme.card}`}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#fef2f2] dark:bg-[#450a0a] text-[#dc2626] flex items-center justify-center shrink-0 border border-[#fecaca] dark:border-[#7f1d1d]">
                <span className="material-symbols-outlined text-2xl">delete_forever</span>
              </div>
              <div>
                <h3 className={`font-headline font-bold text-base ${theme.heading}`}>
                  Remove from Roster?
                </h3>
                <p className={`text-xs ${theme.subtext}`}>
                  Permanently remove <strong className={theme.heading}>{removeConfirmTarget.name}</strong> from team records.
                </p>
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${theme.bodyText}`}>
              This action terminates their fleet record in your direct report ledger. This cannot be undone.
            </p>

            <div className={`flex items-center justify-end gap-2.5 pt-2 border-t ${theme.subtleBorder}`}>
              <button
                type="button"
                onClick={() => setRemoveConfirmTarget(null)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  isDarkMode ? 'bg-[#1a1d26] hover:bg-[#232834] text-[#9ca3af]' : 'bg-[#faf8f5] hover:bg-[#f4eee2] text-[#57534e]'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                className="px-4 py-2 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Remove Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
