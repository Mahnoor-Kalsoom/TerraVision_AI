import { LucideIcon } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    subValue?: string;
    accent?: boolean;
}

export function StatCard({ icon: Icon, label, value, subValue, accent }: StatCardProps) {
    return (
        <div className={`glass rounded-xl p-5 ${accent ? "border-primary/30 glow-sm" : ""}`}>
            <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-4 h-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <p className={`text-2xl font-bold ${accent ? "gradient-text" : "text-foreground"}`}>
                {value}
            </p>
            {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
        </div>
    );
}
