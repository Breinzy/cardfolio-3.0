"use client";

import React from "react";
import ProductImage from "@/components/ui/product-image";

export type ProductSummary = {
	id: string;
	name: string;
	set?: string | null;
	number?: string | null;
	quantity: number;
	estPrice?: number | null;
	costBasisTotal?: number | null;
	imageUrl?: string | null;
};

type DetailDrawerProps = {
	open: boolean;
	onClose: () => void;
	item: ProductSummary | null;
};

export default function DetailDrawer({ open, onClose, item }: DetailDrawerProps) {
	React.useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		if (open) document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	if (!open || !item) return null;

	const price = item.estPrice != null ? `$${item.estPrice.toFixed(2)}` : "—";
	const cost = item.costBasisTotal != null ? `$${item.costBasisTotal.toFixed(2)}` : "—";

	return (
		<div className="fixed inset-0 z-50">
			<div className="absolute inset-0 bg-black/50" onClick={onClose} />
			<aside
				className="absolute right-0 top-0 h-full w-full max-w-md border-l border-border bg-panel p-4 shadow-xl"
				role="dialog"
				aria-modal="true"
			>
				<div className="mb-4 flex items-start justify-between gap-2">
					<h2 className="text-lg font-semibold">Product</h2>
					<button className="rounded border px-2 py-1 text-sm" onClick={onClose}>
						Close
					</button>
				</div>
				<div className="space-y-4">
					<ProductImage src={item.imageUrl} alt={item.name} ratio={4 / 3} />
					<div>
						<div className="text-sm text-muted">{item.set ?? ""}</div>
						<div className="text-xl font-semibold">{item.name}</div>
						{item.number ? <div className="text-sm text-muted">#{item.number}</div> : null}
					</div>
					<div className="flex items-center gap-2">
						<span className="rounded-full bg-[color:rgba(59,130,246,0.12)] px-2 py-1 text-xs font-medium text-[color:#3b82f6]">
							Est Price: {price}
						</span>
					</div>
					<div className="grid grid-cols-2 gap-2 text-sm">
						<div className="rounded-lg border p-3">
							<div className="text-muted">Quantity</div>
							<div className="text-base font-semibold">{item.quantity}</div>
						</div>
						<div className="rounded-lg border p-3">
							<div className="text-muted">Cost Basis</div>
							<div className="text-base font-semibold">{cost}</div>
						</div>
					</div>
				</div>
			</aside>
		</div>
	);
}


