import React from "react";
import ProductImage from "@/components/ui/product-image";

export type PortfolioItem = {
	id: string;
	name: string;
	set?: string | null;
	number?: string | null;
	type: "SINGLE" | "SEALED";
	grade?: string | null;
	quantity: number;
	estPrice?: number | null;
	estValue?: number | null;
	imageUrl?: string | null;
};

export default function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
			{items.map((it) => (
				<article key={it.id} className="rounded-2xl border border-border bg-panel p-3">
					<ProductImage src={it.imageUrl} alt={it.name} className="mb-3" />
					<div className="space-y-1">
						<div className="text-sm text-muted">{it.set ?? ""}</div>
						<div className="truncate text-base font-semibold text-text">{it.name}</div>
						<div className="flex items-center justify-between text-sm">
							<div className="text-muted">Qty: {it.quantity}</div>
							{it.estPrice != null ? (
								<div className="text-muted">${it.estPrice.toFixed(2)}</div>
							) : (
								<div className="text-muted">—</div>
							)}
						</div>
						<div className="flex items-center justify-between">
							<div className="text-sm text-muted">Est Value</div>
							<ValueChip value={it.estValue ?? (it.estPrice ?? 0) * it.quantity} />
						</div>
					</div>
				</article>
			))}
		</div>
	);
}

function ValueChip({ value }: { value: number }) {
	const formatted = `$${value.toFixed(2)}`;
	return (
		<span className="rounded-full bg-[color:rgba(59,130,246,0.12)] px-2 py-1 text-xs font-medium text-[color:#3b82f6]">
			{formatted}
		</span>
	);
}


