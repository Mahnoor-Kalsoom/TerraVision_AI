interface SideBySideComparisonProps {
    preImageUrl: string;
    postImageUrl: string;
    maskDataUrl: string;
}

export function SideBySideComparison({
    preImageUrl,
    postImageUrl,
    maskDataUrl,
}: SideBySideComparisonProps) {
    const panels = [
        { label: "Pre-Flood Image", url: preImageUrl, badge: "Before Event" },
        { label: "Post-Flood Image", url: postImageUrl, badge: "After Event" },
        { label: "Binary Flood Mask", url: maskDataUrl, badge: "AI Prediction" },
    ];

    return (
        <div className="glass rounded-2xl p-5 sm:p-6 border border-border/60">
            <h3 className="font-bold text-base mb-4">Side-by-Side Comparison</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {panels.map(({ label, url, badge }) => (
                    <div
                        key={label}
                        className="rounded-xl overflow-hidden border border-border/50 bg-secondary/20 flex flex-col shadow-sm"
                    >
                        <div className="relative h-52 sm:h-56 w-full bg-black/40">
                            <img
                                src={url}
                                alt={label}
                                className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2.5 left-2.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/75 text-white border border-white/20 backdrop-blur-sm">
                                {badge}
                            </span>
                        </div>
                        <p className="text-xs text-center font-semibold text-muted-foreground py-2.5 px-3 border-t border-border/40 bg-secondary/40">
                            {label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
