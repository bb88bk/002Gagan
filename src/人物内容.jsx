import React, { useState } from 'react';
import {
  Briefcase,
  Target,
  Quote,
  Clock,
  MapPin,
  Hash,
  Lock,
  Flame,
  Users,
  Sparkles,
  Infinity,
} from 'lucide-react';
import { toPng } from 'html-to-image';

const Editable = ({ defaultText, className = '' }) => (
  <span
    contentEditable
    suppressContentEditableWarning
    className={`${className} outline-none focus:ring-1 focus:ring-pink-300/80 focus:ring-offset-2 focus:ring-offset-slate-950 rounded-sm`}
  >
    {defaultText}
  </span>
);

// 这里是“口令”的 base64 哈希，明文是 'BG2025@master'
const PASSWORD_HASH = 'YWExMTIyMzMwMC4u'; // 你可以用 btoa('你的新密码') 替换

const verifyPassword = (input) => {
  try {
    return btoa(input) === PASSWORD_HASH;
  } catch {
    return false;
  }
};

// 调整人物背景图上下位置（0% = 顶部，50% = 中间，100% = 底部）
const IMAGE_OFFSET_Y = '40%';

export default function SpeakerProfile() {
  const [authorized, setAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const handleScreenshot = async () => {
    const el = document.getElementById('main-container');
    if (!el) return;

    try {
      const dataUrl = await toPng(el, {
        cacheBust: true,
        pixelRatio: 2, // 相当于 scale=2，清晰一点
        backgroundColor: '#020617', // 和 bg-slate-950 一致，避免透明格子
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = '@bb88ba.png';
      link.click();
    } catch (error) {
      console.error('Screenshot failed:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (verifyPassword(passwordInput.trim())) {
      setAuthorized(true);
      setError('');
      setPasswordInput('');
    } else {
      setError('Access denied. Incorrect passcode.');
    }
  };

  // 未授权时，先渲染口令输入界面
  if (!authorized) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm border border-white/10 bg-slate-900/90 rounded-xl px-6 py-6 shadow-lg shadow-black/60">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-pink-300" />
            <h1 className="text-sm font-semibold text-slate-50 tracking-[0.18em] uppercase">
              BG Private Access
            </h1>
          </div>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            This page is protected. Please enter your{' '}
            <span className="text-pink-200 font-medium">private passcode</span>{' '}
            to view the content.
          </p>
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400 uppercase tracking-[0.16em]">
                Passcode
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full rounded-lg bg-slate-950/80 border border-slate-600/80 text-sm text-slate-100 px-3 py-2 outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400/70"
                placeholder="Enter access code"
              />
            </div>
            {error && (
              <div className="text-[11px] text-rose-300">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-xs font-semibold text-slate-50 py-2.5 transition shadow-md shadow-pink-700/40"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Unlock</span>
            </button>
          </form>
          <p className="mt-4 text-[10px] text-slate-500 text-center">
            For authorized BG partners only.
          </p>
        </div>
      </div>
    );
  }

  // 通过验证后，显示原来的内容 + 截图按钮
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center px-4 py-8">
      {/* 截图按钮（主容器外，不重叠） */}
      <div className="w-full max-w-[500px] flex justify-end mb-4">
        <button
          onClick={handleScreenshot}
          className="inline-flex items-center gap-2 rounded-full border border-violet-400/70 bg-slate-900/90 px-4 py-2 text-xs sm:text-sm font-medium text-violet-50 shadow-lg shadow-black/60 hover:bg-slate-800 hover:shadow-violet-500/40 transition"
        >
          <Sparkles className="h-4 w-4" />
          <span>一键截图</span>
        </button>
      </div>

      {/* 主容器 */}
      <div
        id="main-container"
        className="
          relative
          w-[500px] max-w-full
          overflow-hidden
          border border-white/10
          bg-slate-950
        "
      >
        {/* Top background / portrait image */}
        <div className="relative h-80 w-full">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage:
                'url("https://i.mji.rip/2025/11/19/17be8003dbd9aaa6517982b49e9b698f.jpeg")',
              backgroundPosition: `center ${IMAGE_OFFSET_Y}`, // 上下可调
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-slate-950/95" />

          {/* Header info on image */}
          <div className="relative h-full flex flex-col justify-end px-6 pb-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/40 border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-slate-100 mb-3">
              <Sparkles className="h-3 w-3" />
              <span>BG Wealth Masterclass</span>
            </div>

            {/* Logo + 文本一行展示 */}
            <div className="flex items-end gap-4">
              {/* 纯 logo，无背景框 */}
              <img
                src="https://i.mji.rip/2025/11/19/e492029e83b4d9ac217e2d0739252447.png"
                alt="logo"
                className="h-12 w-12 object-contain"
              />
              <div className="flex flex-col min-w-0">
                <h1 className="text-xl font-semibold text-slate-50 leading-snug whitespace-nowrap">
                  Gagan
                </h1>
                <p className="text-[11px] text-slate-200/80 mt-1 flex items-center gap-1.5 whitespace-nowrap">
                  <Briefcase className="h-3.5 w-3.5" />
                  BG Wealth Senior Investment Consultant · Level 7 Leader
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative px-6 pt-4 pb-6 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950">
          {/* Experience + Expertise */}
          <div className="space-y-3 text-sm text-slate-100/90">
            <div className="flex gap-2">
              <Target className="h-4 w-4 mt-0.5 text-pink-300 shrink-0" />
              <p className="text-xs leading-relaxed">
                Led{' '}
                <span className="font-semibold text-pink-200">
                  over 13,000 team members
                </span>{' '}
                from zero to stable and scalable income streams.
              </p>
            </div>

            <div className="flex gap-2">
              <Users className="h-4 w-4 mt-0.5 text-violet-300 shrink-0" />
              <p className="text-xs leading-relaxed">
                Core strengths in{' '}
                <span className="font-semibold text-violet-200">
                  learning system training
                </span>{' '}
                and{' '}
                <span className="font-semibold text-violet-200">
                  team building
                </span>
                .
              </p>
            </div>

            <div className="mt-2 rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-3 flex gap-2">
              <Quote className="h-4 w-4 text-pink-300 mt-0.5 shrink-0" />
              <p className="text-xs leading-relaxed text-slate-100">
                <span className="italic text-pink-100">
                  “Thoughts reshape your horizon, and your horizon shapes your
                  future.”
                </span>
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-slate-700/80 to-transparent" />

          {/* Session info (all editable) */}
          <div className="space-y-3 text-xs text-slate-100/90">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Today&apos;s Topic
              </span>
              <Editable
                defaultText="How to build your first BG team in the first month"
                className="text-sm font-medium text-pink-100 bg-slate-900/60 px-3 py-1.5 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Time
              </span>
              <div className="inline-flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl">
                <Clock className="h-3.5 w-3.5 text-pink-300 shrink-0" />
                <Editable
                  defaultText="2025/11/20 · 7:30 PM"
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Location
              </span>
              <div className="inline-flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl">
                <MapPin className="h-3.5 w-3.5 text-violet-300 shrink-0" />
                <Editable
                  defaultText="Zoom / BG Business Academy"
                  className="text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Room ID
                </span>
                <div className="inline-flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl">
                  <Hash className="h-3.5 w-3.5 text-sky-300 shrink-0" />
                  <Editable defaultText="4454554" className="text-sm" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Password
                </span>
                <div className="inline-flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl">
                  <Lock className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                  <Editable defaultText="465456" className="text-sm" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Popularity
              </span>
              <div className="inline-flex items-center justify-between gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl">
                <div className="inline-flex items-center gap-2">
                  <Flame className="h-3.5 w-3.5 text-orange-300 shrink-0" />
                  <Editable defaultText="8,652 attendees" className="text-sm" />
                </div>
                <span className="text-[10px] text-orange-200/80 uppercase tracking-[0.16em]">
                  Live hype
                </span>
              </div>
            </div>
          </div>

          {/* Footer badge */}
          <div className="mt-5 flex items-center justify-between text-[10px] text-slate-400">
            <div className="inline-flex items-center gap-1.5">
              <Infinity className="h-3 w-3 text-pink-300" />
              <span>Growth · Mindset · Leadership</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-yellow-300" />
              <span>BG Wealth Elite Mentor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
