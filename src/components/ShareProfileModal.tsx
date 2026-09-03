'use client';

import React, { useState, useEffect } from 'react';
import { Politician } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Share2,
  Copy,
  Check,
  Twitter,
  Facebook,
  Linkedin,
  Send,
  MessageCircle,
  Link2,
  ExternalLink,
  FileText,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

interface ShareProfileModalProps {
  politician: Politician;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ShareProfileModal({
  politician,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: ShareProfileModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const { toast } = useToast();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled ? setControlledOpen! : setInternalOpen;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProfileUrl(window.location.href);
      setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
    }
  }, []);

  const totalCases = politician.cases?.length || 0;
  const score = politician.accountabilityScore ?? 0;
  const restitution = (politician.totalForfeiture || 0).toLocaleString();
  const forfeitureShort = politician.totalForfeiture && politician.totalForfeiture > 0 
    ? `${(politician.totalForfeiture / 1000000000).toFixed(1)}B` 
    : '0';

  const ogImageUrl = `/api/og?name=${encodeURIComponent(politician.fullName)}&party=${encodeURIComponent(politician.primaryParty)}&state=${encodeURIComponent(politician.stateOfOrigin || '')}&score=${Math.round(score)}&forfeiture=${forfeitureShort}&cases=${totalCases}`;

  // Social share copy templates
  const tweetText = `🔍 Public Accountability Dossier: ${politician.fullName} (${politician.primaryParty})\n• Accountability Rating: ${score.toFixed(1)} pts\n• Documented Cases: ${totalCases}\n• Court Restitution: ₦${restitution}\n\nExamine the full case & asset audit on #WhoOwesUs:`;
  const whatsappText = `*Who Owes Us? — Civic Accountability Dossier*\n\n*${politician.fullName}* (${politician.primaryParty})\nAccountability Score: ${score.toFixed(1)} pts\nActive/Concluded Cases: ${totalCases}\nCourt Restitution: ₦${restitution}\n\nRead full verification and public records:\n${profileUrl}`;
  const telegramText = `Public Accountability Dossier: ${politician.fullName} (${politician.primaryParty}) | Accountability Score: ${score.toFixed(1)} pts. Read the full case & asset audit:`;

  const copyToClipboard = async (text: string, type: 'link' | 'summary') => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
        toast({
          title: "Direct Link Copied!",
          description: "Profile URL has been copied to your clipboard.",
        });
      } else {
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2500);
        toast({
          title: "Dossier Summary Copied!",
          description: "Formatted briefing text copied. Ready to paste in chats or posts.",
        });
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
      toast({
        title: "Could not copy automatically",
        description: "Please copy the link from the text box below.",
        variant: "destructive",
      });
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: `${politician.fullName} - Public Accountability Dossier | Who Owes Us?`,
        text: `Review verifiable public records, court filings, and accountability score for ${politician.fullName} (${politician.primaryParty}).`,
        url: profileUrl,
      });
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.error('Native share error', err);
      }
    }
  };

  const socialLinks = [
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'hover:bg-slate-900 hover:text-white',
      border: 'hover:border-slate-900',
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(profileUrl)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      },
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-emerald-600 hover:text-white',
      border: 'hover:border-emerald-600',
      action: () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      },
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'hover:bg-sky-500 hover:text-white',
      border: 'hover:border-sky-500',
      action: () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(telegramText)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      },
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-600 hover:text-white',
      border: 'hover:border-blue-600',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      },
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:bg-blue-700 hover:text-white',
      border: 'hover:border-blue-700',
      action: () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      },
    },
  ];

  const formattedSummary = `🏛️ PUBLIC ACCOUNTABILITY DOSSIER: ${politician.fullName}
Affiliation: ${politician.primaryParty}
Accountability Score: ${score.toFixed(1)} pts
Documented Cases / Investigations: ${totalCases}
Total Court Restitution Orders: ₦${restitution}

Full verified legal timeline & asset audit on Who Owes Us:
${profileUrl}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-w-lg w-[95vw] sm:w-full p-6 sm:p-7 rounded-2xl bg-card border shadow-2xl">
        <DialogHeader className="space-y-1.5 text-left pb-4 border-b">
          <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-wider">
            <Share2 className="w-4 h-4 text-accent" />
            <span>Civic Transparency Initiative</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black uppercase text-primary tracking-tight">
            Share Accountability Dossier
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Distribute verified judicial records, court orders, and accountability scores for public awareness.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Politician Micro Card */}
          <div className="p-3.5 bg-muted/40 rounded-xl border flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0">
                  {politician.primaryParty}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  {totalCases} legal entries
                </span>
              </div>
              <h4 className="font-black text-primary text-sm uppercase truncate">
                {politician.fullName}
              </h4>
            </div>

            <div className="text-right shrink-0">
              <p className="text-[8px] font-bold uppercase text-muted-foreground">Accountability Score</p>
              <p className="text-lg font-black text-accent">{score.toFixed(1)} <span className="text-[10px] font-normal text-muted-foreground">pts</span></p>
            </div>
          </div>

          {/* Direct Profile Link Box */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-primary flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-accent" />
                Direct Profile Link
              </span>
              {copiedLink && (
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied to clipboard
                </span>
              )}
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  readOnly
                  value={profileUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full bg-background border rounded-xl px-3.5 py-2.5 text-xs font-mono text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 selection:bg-accent/20"
                />
              </div>
              <Button
                onClick={() => copyToClipboard(profileUrl, 'link')}
                className={`h-10 px-4 rounded-xl font-black text-xs uppercase tracking-wider shrink-0 transition-all ${
                  copiedLink
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Social Media Sharing Buttons */}
          <div className="space-y-2.5">
            <p className="text-xs font-black uppercase tracking-wider text-primary">
              Share Directly to Platforms
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={item.action}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border bg-background hover:shadow-sm font-black text-xs text-primary transition-all duration-150 ${item.color} ${item.border}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}

              {canNativeShare && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border bg-accent/10 border-accent/30 text-accent hover:bg-accent hover:text-white font-black text-xs transition-all duration-150"
                >
                  <Smartphone className="w-4 h-4 shrink-0" />
                  <span>More Apps...</span>
                </button>
              )}
            </div>
          </div>

          {/* Live Social Card Unfurl Preview (OG Card) */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-accent" />
                Social Media Preview Card (WhatsApp / X / FB)
              </label>
              <a
                href={ogImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-black uppercase text-accent hover:underline flex items-center gap-1"
              >
                <span>Open HQ Card</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="rounded-xl overflow-hidden border bg-slate-950 aspect-[1200/630] relative shadow-inner group">
              <img
                src={ogImageUrl}
                alt={`${politician.fullName} Social Card Preview`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* One-Click Formatted Dossier Summary */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-accent" />
                Pre-formatted Briefing
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(formattedSummary, 'summary')}
                className="h-7 text-[10px] font-black uppercase tracking-widest gap-1.5 text-accent hover:bg-accent/10"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    Copied Summary
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy Summary Text
                  </>
                )}
              </Button>
            </div>
            <div className="p-3 bg-muted/40 rounded-xl border text-[11px] font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-28 overflow-y-auto">
              {formattedSummary}
            </div>
          </div>

          {/* Verification Footnote */}
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/80 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Shared records link directly to verifiable court judgments & asset registry filings.</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function QuickCopyLinkButton({
  politicianId,
  className = "",
}: {
  politicianId: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      const url = typeof window !== 'undefined' 
        ? window.location.href 
        : `/politician/${politicianId}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Direct Link Copied!",
        description: "Profile URL is copied to your clipboard.",
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={`h-9 px-3.5 text-xs font-black uppercase tracking-wider gap-2 rounded-xl transition-all ${
        copied
          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
          : 'hover:bg-secondary text-primary'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Link2 className="w-3.5 h-3.5 text-accent" />
          <span>Copy Link</span>
        </>
      )}
    </Button>
  );
}

export function ShareProfileCard({
  politician,
  className = "",
}: {
  politician: Politician;
  className?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = async () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : `/politician/${politician.id}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast({
        title: "Direct Link Copied!",
        description: "Profile URL is ready to share.",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getUrl = () => typeof window !== 'undefined' ? window.location.href : '';

  const shareToTwitter = () => {
    const text = `🔍 Public Accountability Dossier: ${politician.fullName} (${politician.primaryParty}) | Accountability Score: ${(politician.accountabilityScore || 0).toFixed(1)} pts. Examine on #WhoOwesUs:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getUrl())}`, '_blank', 'noopener,noreferrer');
  };

  const shareToWhatsapp = () => {
    const text = `Examine the public accountability dossier for ${politician.fullName} on Who Owes Us: ${getUrl()}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const shareToTelegram = () => {
    const text = `Public Accountability Dossier for ${politician.fullName} (${politician.primaryParty}):`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`p-6 bg-white border rounded-xl shadow-sm space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/10 text-accent">
            <Share2 className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-black uppercase tracking-wider text-primary">
            Share Dossier
          </h4>
        </div>
        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider">
          Civic Audit
        </Badge>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Help inform public dialogue. Share this verified judicial & asset tracking profile across civic networks.
      </p>

      {/* Quick Direct Copy Bar */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className={`w-full h-9 rounded-lg text-xs font-black uppercase tracking-wider gap-2 transition-all ${
            copiedLink
              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : 'hover:bg-secondary text-primary'
          }`}
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copied Direct Link</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-accent" />
              <span>Copy Direct Link</span>
            </>
          )}
        </Button>
      </div>

      {/* Quick Social Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={shareToTwitter}
          className="h-8 px-2 text-[10px] font-bold uppercase tracking-wider gap-1.5 border hover:bg-slate-900 hover:text-white transition-all"
        >
          <Twitter className="w-3.5 h-3.5" />
          <span>X / Post</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={shareToWhatsapp}
          className="h-8 px-2 text-[10px] font-bold uppercase tracking-wider gap-1.5 border hover:bg-emerald-600 hover:text-white transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={shareToTelegram}
          className="h-8 px-2 text-[10px] font-bold uppercase tracking-wider gap-1.5 border hover:bg-sky-500 hover:text-white transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Telegram</span>
        </Button>
      </div>

      {/* Modal Trigger for All Options & Formatted Text */}
      <div className="pt-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setModalOpen(true)}
          className="w-full h-8 text-[10px] font-black uppercase tracking-widest text-accent hover:bg-accent/10 justify-between px-2"
        >
          <span>All Platforms & Fact Sheet</span>
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>

      <ShareProfileModal
        politician={politician}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}

