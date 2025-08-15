"use client";

import React from "react";

type ProductImageProps = {
	src?: string | null;
	alt: string;
	className?: string;
	/**
	 * aspect ratio value such as 4/3 or 1
	 * Default: 4/3
	 */
	ratio?: number;
};

export default function ProductImage({ src, alt, className, ratio = 4 / 3 }: ProductImageProps) {
	return (
		<div
			className={"overflow-hidden rounded-xl bg-panel " + (className ?? "")}
			style={{ aspectRatio: String(ratio), border: "1px solid var(--tw-color-border, #1b2430)" }}
		>
			<div className="relative h-full w-full">
				{src ? (
					<img
						src={src}
						alt={alt}
						className="h-full w-full object-cover transition-transform duration-200 ease-out hover:scale-105"
						loading="lazy"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center text-muted">
						{/* simple placeholder icon */}
						<svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
							<rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
							<path d="M7 14l3-3 3 3 4-4 0 6H7z" fill="currentColor" opacity="0.15" />
						</svg>
					</div>
				)}
			</div>
		</div>
	);
}


