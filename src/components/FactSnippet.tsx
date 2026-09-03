
'use client';

import { useState, useEffect } from 'react';
import { generateShareableFacts } from '@/ai/flows/generate-shareable-facts-flow';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, Quote, Loader2, Twitter, MessageCircle, Copy, Check } from 'lucide-react';
import { Politician } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function FactSnippet({ politician }: { politician: Politician }) {
  const [snippets, setSnippets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadFacts() {
      if (!politician.id) return;
      setLoading(true);
      try {
        const result = await generateShareableFacts({
          fullName: politician.fullName,
          corruptionRecords: (politician.cases || []).map(c => ({
            caseTitle: c.title,
            description: c.description,
            convictionStatus: c.status,
            forfeitureAmount: c.amountInvolved,
            sources: (c.sources || []).map(s => s.url)
          }))
        });
        setSnippets(result.snippets);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadFacts();
  }, [politician.id]);

  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const copyToClipboard = (text: string, idx: number) => {
    const url = currentUrl || (typeof window !== 'undefined' ? window.location.href : '');
    const shareText = url ? `${text}\n\nProfile: ${url} #WhoOwesUs #NigeriaAccountability` : `${text} #WhoOwesUs #NigeriaAccountability`;
    navigator.clipboard.writeText(shareText);
    setCopiedIdx(idx);
    toast({ title: "Copied!", description: "Snippet and profile link copied for sharing." });
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-12 bg-primary/5 rounded-3xl border border-dashed">
      <Loader2 className="w-6 h-6 animate-spin text-accent mb-2" />
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Synthesizing facts...</p>
    </div>
  );

  if (snippets.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary">
        <Share2 className="w-4 h-4 text-accent" />
        Social Snippets
      </h3>
      <div className="grid gap-4">
        {snippets.map((snippet, idx) => (
          <Card key={idx} className="bg-white border-l-4 border-accent group shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 relative">
              <Quote className="w-8 h-8 text-accent/10 absolute top-2 right-2 group-hover:text-accent/20 transition-colors" />
              <p className="text-xs font-bold leading-relaxed pr-6 text-primary">{snippet}</p>
              <div className="flex gap-2 mt-4 justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-3 text-[10px] gap-2 hover:bg-secondary text-primary font-black uppercase tracking-widest"
                  onClick={() => copyToClipboard(snippet, idx)}
                >
                  {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  Copy
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-3 text-[10px] gap-2 hover:bg-emerald-50 text-emerald-600 font-black uppercase tracking-widest"
                  onClick={() => {
                    const url = currentUrl || (typeof window !== 'undefined' ? window.location.href : '');
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(snippet + (url ? '\n\n' + url : ''))}`, '_blank');
                  }}
                >
                  <MessageCircle className="w-3 h-3" />
                  WhatsApp
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-3 text-[10px] gap-2 hover:bg-sky-50 text-sky-600 font-black uppercase tracking-widest"
                  onClick={() => {
                    const url = currentUrl || (typeof window !== 'undefined' ? window.location.href : '');
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(snippet + ' #WhoOwesUs')}&url=${encodeURIComponent(url)}`, '_blank');
                  }}
                >
                  <Twitter className="w-3 h-3" />
                  X
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
