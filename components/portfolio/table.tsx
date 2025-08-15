"use client";

import * as React from "react";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
	getFilteredRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type PortfolioRow = {
	id: string;
	name: string;
	set?: string | null;
	number?: string | null;
	type: "SINGLE" | "SEALED";
	grade?: string | null;
	quantity: number;
	costBasisTotal?: number | null;
};

export function PortfolioTable({ data }: { data: PortfolioRow[] }) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [typeFilter, setTypeFilter] = React.useState<"ALL" | "SINGLE" | "SEALED">("ALL");
	const [setFilter, setSetFilter] = React.useState<string>("");
	const [gradeFilter, setGradeFilter] = React.useState<string>("");

	const columns = React.useMemo<ColumnDef<PortfolioRow>[]>(
		() => [
			{ accessorKey: "name", header: "Name" },
			{ accessorKey: "set", header: "Set" },
			{ accessorKey: "number", header: "No." },
			{ accessorKey: "type", header: "Type" },
			{ accessorKey: "grade", header: "Grade" },
			{ accessorKey: "quantity", header: "Qty" },
			{ accessorKey: "costBasisTotal", header: "Cost Basis" },
		],
		[]
	);

	const filteredData = React.useMemo(() => {
		return data.filter((row) => {
			const passType = typeFilter === "ALL" || row.type === typeFilter;
			const passSet = !setFilter || (row.set ?? "").toLowerCase().includes(setFilter.toLowerCase());
			const passGrade = !gradeFilter || (row.grade ?? "").toLowerCase().includes(gradeFilter.toLowerCase());
			return passType && passSet && passGrade;
		});
	}, [data, typeFilter, setFilter, gradeFilter]);

	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: { sorting, columnVisibility },
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
	});

	return (
		<div className="space-y-3">
			<FiltersToolbar
				typeFilter={typeFilter}
				setTypeFilter={setTypeFilter}
				setFilter={setFilter}
				gradeFilter={gradeFilter}
				setGradeFilter={setGradeFilter}
			/>
			<div className="overflow-auto rounded-xl border">
				<table className="w-full min-w-[720px] text-sm">
					<thead>
						{table.getHeaderGroups().map((hg) => (
							<tr key={hg.id}>
								{hg.headers.map((header) => (
									<th key={header.id} className="cursor-pointer whitespace-nowrap px-3 py-2 text-left text-muted" onClick={header.column.getToggleSortingHandler()}>
										{flexRender(header.column.columnDef.header, header.getContext())}
										{header.column.getIsSorted() === "asc" ? " ▲" : header.column.getIsSorted() === "desc" ? " ▼" : ""}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id} className="border-t">
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="px-3 py-2">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				{table.getAllLeafColumns().map((col) => (
					<Button key={col.id} variant="ghost" className="px-2 py-1 text-xs" onClick={() => col.toggleVisibility()}>
						{col.getIsVisible() ? "Hide" : "Show"} {col.id}
					</Button>
				))}
			</div>
		</div>
	);
}

type FiltersToolbarProps = {
	typeFilter: "ALL" | "SINGLE" | "SEALED";
	setTypeFilter: (v: "ALL" | "SINGLE" | "SEALED") => void;
	setFilter: (v: string) => void;
	gradeFilter: string;
	setGradeFilter: (v: string) => void;
};

function FiltersToolbar({ typeFilter, setTypeFilter, setFilter, gradeFilter, setGradeFilter }: FiltersToolbarProps) {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<select
				value={typeFilter}
				onChange={(e) => setTypeFilter(e.target.value as any)}
				className="rounded border bg-transparent px-2 py-1 text-sm"
			>
				<option value="ALL">All Types</option>
				<option value="SINGLE">Single</option>
				<option value="SEALED">Sealed</option>
			</select>

			<input
				type="text"
				placeholder="Filter by set..."
				onChange={(e) => setFilter(e.target.value)}
				className="rounded border bg-transparent px-2 py-1 text-sm"
			/>

			<input
				type="text"
				placeholder="Filter by grade..."
				value={gradeFilter}
				onChange={(e) => setGradeFilter(e.target.value)}
				className="rounded border bg-transparent px-2 py-1 text-sm"
			/>
		</div>
	);
}


