import { useState } from "react";
import { Share2, Copy, Check, QrCode, Code, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { QRCodeSVG } from "qrcode.react";

type ContentType =
  | "event"
  | "job"
  | "course"
  | "blog"
  | "hackathon"
  | "scholarship"
  | "resource";

interface UniversalShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  type: ContentType;
  referenceId?: string;
  imageUrl?: string;
  compact?: boolean;
  variant?: "default" | "outline" | "ghost";
  showLabel?: boolean;
  showRewardBadge?: boolean;
}

const socialPlatforms = [
  {
    name: "WhatsApp",
    icon: "💬",
    getUrl: (url: string, title: string, desc: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${desc}\n\n${url}`)}`,
  },
  {
    name: "LinkedIn",
    icon: "💼",
    getUrl: (url: string, title: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Twitter",
    icon: "🐦",
    getUrl: (url: string, title: string, desc: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n\n${desc}`)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "Facebook",
    icon: "📘",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "Email",
    icon: "📧",
    getUrl: (url: string, title: string, desc: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${desc}\n\n${url}`)}`,
  },
];

export const UniversalShareButton = ({
  title,
  description = "",
  url,
  type,
  referenceId,
  imageUrl,
  compact = false,
  variant = "default",
  showLabel = true,
  showRewardBadge = true,
}: UniversalShareButtonProps) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);

  // Generate URL with referral if user is logged in
  const baseUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareUrl =
    user && referenceId
      ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}ref=${user.id.slice(0, 8)}`
      : baseUrl;

  const handleShare = async (platform: (typeof socialPlatforms)[number]) => {
    const shareLink = platform.getUrl(shareUrl, title, description);
    window.open(shareLink, "_blank", "noopener,noreferrer,width=600,height=400");
    toast({
      title: "Shared!",
      description: `Shared to ${platform.name}`,
    });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
        toast({ title: "Shared successfully!" });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ title: "Link copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const embedCode = `<iframe src="${shareUrl}" width="100%" height="400" frameborder="0" title="${title}"></iframe>`;

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast({ title: "Embed code copied!" });
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const supportsNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  // Compact mode: dropdown
  if (compact) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={variant} size="sm" className="gap-1.5">
              <Share2 className="h-4 w-4" />
              {showLabel && <span className="hidden sm:inline">Share</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {supportsNativeShare && (
              <>
                <DropdownMenuItem onClick={handleNativeShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share...
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {socialPlatforms.map((platform) => (
              <DropdownMenuItem
                key={platform.name}
                onClick={() => handleShare(platform)}
              >
                <span className="mr-2">{platform.icon}</span>
                {platform.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCopyLink}>
              {copied ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setQrOpen(true)}>
              <QrCode className="mr-2 h-4 w-4" />
              QR Code
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEmbedOpen(true)}>
              <Code className="mr-2 h-4 w-4" />
              Embed Code
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* QR Code Dialog */}
        <Dialog open={qrOpen} onOpenChange={setQrOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>QR Code</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="rounded-xl border border-border bg-white p-4">
                <QRCodeSVG value={shareUrl} size={200} />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Scan to open <strong>{title}</strong>
              </p>
              <Button onClick={handleCopyLink} variant="outline" className="w-full">
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                Copy Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Embed Dialog */}
        <Dialog open={embedOpen} onOpenChange={setEmbedOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Embed Code</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                {embedCode}
              </pre>
              <Button onClick={handleCopyEmbed} className="w-full">
                <Copy className="mr-2 h-4 w-4" />
                Copy Embed Code
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Full mode: all buttons visible
  return (
    <div className="space-y-3">
      {showLabel && (
        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Share & Earn</span>
          {showRewardBadge && user && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              +1 coin
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {supportsNativeShare && (
          <Button variant="outline" size="sm" onClick={handleNativeShare}>
            <Share2 className="mr-1.5 h-4 w-4" />
            Share...
          </Button>
        )}
        {socialPlatforms.map((platform) => (
          <Button
            key={platform.name}
            variant="outline"
            size="sm"
            onClick={() => handleShare(platform)}
          >
            <span className="mr-1.5">{platform.icon}</span>
            {platform.name}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={handleCopyLink}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          Copy Link
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setQrOpen(true)}>
          <QrCode className="mr-1.5 h-4 w-4" />
          QR Code
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setEmbedOpen(true)}>
          <Code className="mr-1.5 h-4 w-4" />
          Embed
        </Button>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="rounded-xl border border-border bg-white p-4">
              <QRCodeSVG value={shareUrl} size={200} />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Scan to open <strong>{title}</strong>
            </p>
            <Button onClick={handleCopyLink} variant="outline" className="w-full">
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Embed Dialog */}
      <Dialog open={embedOpen} onOpenChange={setEmbedOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Embed Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
              {embedCode}
            </pre>
            <Button onClick={handleCopyEmbed} className="w-full">
              <Copy className="mr-2 h-4 w-4" />
              Copy Embed Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UniversalShareButton;
