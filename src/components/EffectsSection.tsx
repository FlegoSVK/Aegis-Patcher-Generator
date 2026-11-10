import React from 'react';
import { InstallerEffectConfig } from '../effectsConfig';
import { 
  Waves, 
  Sparkles, 
  ArrowDownToDot, 
  Activity, 
  Volume2, 
  PartyPopper, 
  ZoomIn, 
  Vibrate, 
  Layers, 
  Palette,
  CheckCircle2
} from 'lucide-react';

interface EffectsSectionProps {
  effects: InstallerEffectConfig;
  onChange: (newEffects: InstallerEffectConfig) => void;
  t: any;
}

export const EffectsSection: React.FC<EffectsSectionProps> = ({ effects, onChange, t }) => {
  const toggleEffect = (key: keyof InstallerEffectConfig) => {
    onChange({
      ...effects,
      [key]: !effects[key],
    });
  };

  const enableAll = () => {
    const allOn: InstallerEffectConfig = {
      rippleEffect: true,
      hoverGlowShimmer: true,
      pressedDepthOffset: true,
      neonPulseBorder: true,
      soundClickFeedback: true,
      successParticleBurst: true,
      scaleBounceOnHover: true,
      shakeErrorAnimation: true,
      glassmorphismBlur: true,
      smoothColorFade: true,
    };
    onChange(allOn);
  };

  const disableAll = () => {
    const allOff: InstallerEffectConfig = {
      rippleEffect: false,
      hoverGlowShimmer: false,
      pressedDepthOffset: false,
      neonPulseBorder: false,
      soundClickFeedback: false,
      successParticleBurst: false,
      scaleBounceOnHover: false,
      shakeErrorAnimation: false,
      glassmorphismBlur: false,
      smoothColorFade: false,
    };
    onChange(allOff);
  };

  const items: {
    key: keyof InstallerEffectConfig;
    title: string;
    desc: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }[] = [
    {
      key: 'rippleEffect',
      title: t.effectRippleTitle,
      desc: t.effectRippleDesc,
      icon: Waves,
    },
    {
      key: 'hoverGlowShimmer',
      title: t.effectHoverGlowTitle,
      desc: t.effectHoverGlowDesc,
      icon: Sparkles,
    },
    {
      key: 'pressedDepthOffset',
      title: t.effectDepthOffsetTitle,
      desc: t.effectDepthOffsetDesc,
      icon: ArrowDownToDot,
    },
    {
      key: 'neonPulseBorder',
      title: t.effectNeonPulseTitle,
      desc: t.effectNeonPulseDesc,
      icon: Activity,
    },
    {
      key: 'soundClickFeedback',
      title: t.effectSoundFeedbackTitle,
      desc: t.effectSoundFeedbackDesc,
      icon: Volume2,
    },
    {
      key: 'successParticleBurst',
      title: t.effectParticleBurstTitle,
      desc: t.effectParticleBurstDesc,
      icon: PartyPopper,
    },
    {
      key: 'scaleBounceOnHover',
      title: t.effectScaleBounceTitle,
      desc: t.effectScaleBounceDesc,
      icon: ZoomIn,
    },
    {
      key: 'shakeErrorAnimation',
      title: t.effectShakeErrorTitle,
      desc: t.effectShakeErrorDesc,
      icon: Vibrate,
    },
    {
      key: 'glassmorphismBlur',
      title: t.effectGlassmorphismTitle,
      desc: t.effectGlassmorphismDesc,
      icon: Layers,
    },
    {
      key: 'smoothColorFade',
      title: t.effectColorFadeTitle,
      desc: t.effectColorFadeDesc,
      icon: Palette,
    },
  ];

  const activeCount = Object.values(effects).filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[#919B82]">
          Aktívnych: <strong className="text-[#F5F7F2]">{activeCount} / 10</strong>
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={enableAll}
            className="text-[10px] text-[#919B82] hover:text-[#F5F7F2] underline cursor-pointer transition-colors"
          >
            {t.effectsEnableAll}
          </button>
          <span className="text-[10px] text-[#3E4B37]">•</span>
          <button
            type="button"
            onClick={disableAll}
            className="text-[10px] text-[#919B82] hover:text-[#F5F7F2] underline cursor-pointer transition-colors"
          >
            {t.effectsDisableAll}
          </button>
        </div>
      </div>

      <p className="text-[10px] leading-relaxed text-[#919B82]/80">
        {t.effectsSectionDesc}
      </p>

      <div className="space-y-2 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isEnabled = effects[item.key];

          return (
            <div
              key={item.key}
              onClick={() => toggleEffect(item.key)}
              className={`p-2.5 rounded border transition-all cursor-pointer flex items-start gap-2.5 ${
                isEnabled
                  ? 'bg-[#182315] border-[#3E4B37] text-[#F5F7F2]'
                  : 'bg-[#111710]/50 border-[#263121]/60 text-[#919B82]/70 hover:border-[#3E4B37]/60'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                <div
                  className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                    isEnabled
                      ? 'bg-[#3E4B37] border-[#919B82] text-white'
                      : 'border-[#3E4B37]/60 bg-transparent'
                  }`}
                >
                  {isEnabled && <CheckCircle2 size={12} strokeWidth={3} />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon size={13} className={isEnabled ? 'text-[#919B82]' : 'text-[#55604C]'} />
                  <span className="text-[11px] font-bold tracking-wide truncate">
                    {item.title}
                  </span>
                </div>
                <p className="text-[9.5px] leading-tight text-[#919B82]/90">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
