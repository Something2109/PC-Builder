"use client";

import { Products } from "@pc-builder/shared/part";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React, { useState } from "react";

import { useTableState, DataTable, TablePagination } from "@/components/ui/Table";
import axiosInstance from "@/lib/axios";

import { AddAliasForm } from "./AddAliasForm";

interface AliasQuery {
  page: number;
  limit: number;
  product?: string;
  alias?: string;
  sort_key?: string;
  sort_order?: "asc" | "desc";
}

interface LogQuery {
  page: number;
  limit: number;
  status?: string;
  sort_key?: string;
  sort_order?: "asc" | "desc";
}

interface AliasEntry {
  id: number;
  product: string;
  info: string;
  attribute: string;
  alias: string;
  source: "seed" | "learned" | "manual";
  frequency: number;
  confidence: number;
  createdAt: string;
  updatedAt: string;
}

interface AliasListResponse {
  data: AliasEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface LearnerLog {
  id: number;
  product: string;
  info: string;
  attribute: string;
  raw_key: string;
  normalized_key: string;
  match_type: string;
  match_score: number;
  status: "auto" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface LogListResponse {
  data: LearnerLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface AxiosErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

type ActiveTab = "aliases" | "logs";

export default function AliasDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ActiveTab>("aliases");

  // Manage Aliases State
  const aliasTableState = useTableState<AliasQuery>({
    initialState: {
      page: 1,
      limit: 10,
      product: undefined,
      alias: undefined,
      sort_key: "createdAt",
      sort_order: "desc",
    },
  });

  const [aliasError, setAliasError] = useState<string | null>(null);
  const [aliasSuccess, setAliasSuccess] = useState<string | null>(null);

  // Add Alias Form State
  const [showAddForm, setShowAddForm] = useState(false);

  // Selected row state for editing or pre-populating AddAliasForm
  const [selectedRow, setSelectedRow] = useState<{
    id?: number;
    product: string;
    info: string;
    attribute: string;
    alias: string;
  } | null>(null);

  // Logs State
  const logTableState = useTableState<LogQuery>({
    initialState: {
      page: 1,
      limit: 10,
      status: undefined,
      sort_key: "createdAt",
      sort_order: "desc",
    },
  });

  const [logError, setLogError] = useState<string | null>(null);
  const [logSuccess, setLogSuccess] = useState<string | null>(null);

  // 1. Query: List Aliases
  const { data: aliasData, isLoading: loadingAliases } = useQuery<AliasListResponse>({
    queryKey: ["aliases", aliasTableState.state],
    queryFn: async () => {
      const response = await axiosInstance.get<AliasListResponse>("/alias", {
        params: aliasTableState.state,
      });
      return response.data;
    },
  });

  // 2. Query: List Learner Logs
  const { data: logData, isLoading: loadingLogs } = useQuery<LogListResponse>({
    queryKey: ["learnerLogs", logTableState.state],
    queryFn: async () => {
      const response = await axiosInstance.get<LogListResponse>("/alias/learner/logs", {
        params: logTableState.state,
      });
      return response.data;
    },
  });

  // 3. Mutation: Create Alias
  const createAliasMutation = useMutation({
    mutationFn: async (payload: {
      product: string;
      info: string;
      attribute: string;
      alias: string;
    }) => {
      const response = await axiosInstance.post("/alias", payload);
      return response.data;
    },
    onSuccess: () => {
      setAliasSuccess("Alias created successfully!");
      setShowAddForm(false);
      setSelectedRow(null);
      queryClient.invalidateQueries({ queryKey: ["aliases"] });
      setTimeout(() => setAliasSuccess(null), 3000);
    },
    onError: (err: unknown) => {
      console.error(err);
      const axiosErr = err as AxiosErrorLike;
      setAliasError(axiosErr.response?.data?.message || "Failed to create alias.");
      setTimeout(() => setAliasError(null), 5000);
    },
  });

  // Mutation: Update Alias
  const updateAliasMutation = useMutation({
    mutationFn: async (payload: {
      id: number;
      product: string;
      info: string;
      attribute: string;
      alias: string;
    }) => {
      const { id, ...data } = payload;
      const response = await axiosInstance.put(`/alias/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      setAliasSuccess("Alias updated successfully!");
      setShowAddForm(false);
      setSelectedRow(null);
      queryClient.invalidateQueries({ queryKey: ["aliases"] });
      setTimeout(() => setAliasSuccess(null), 3000);
    },
    onError: (err: unknown) => {
      console.error(err);
      const axiosErr = err as AxiosErrorLike;
      setAliasError(axiosErr.response?.data?.message || "Failed to update alias.");
      setTimeout(() => setAliasError(null), 5000);
    },
  });

  // 4. Mutation: Delete Alias
  const deleteAliasMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/alias/${id}`);
    },
    onSuccess: () => {
      setAliasSuccess("Alias deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["aliases"] });
      setTimeout(() => setAliasSuccess(null), 3000);
    },
    onError: (err: unknown) => {
      console.error(err);
      const axiosErr = err as AxiosErrorLike;
      setAliasError(axiosErr.response?.data?.message || "Failed to delete alias.");
      setTimeout(() => setAliasError(null), 5000);
    },
  });

  // 5. Mutation: Approve Log
  const approveLogMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.post(`/alias/learner/logs/${id}/approve`);
    },
    onSuccess: () => {
      setLogSuccess("Learner alias approved and registered!");
      queryClient.invalidateQueries({ queryKey: ["learnerLogs"] });
      queryClient.invalidateQueries({ queryKey: ["aliases"] });
      setTimeout(() => setLogSuccess(null), 3000);
    },
    onError: (err: unknown) => {
      console.error(err);
      const axiosErr = err as AxiosErrorLike;
      setLogError(axiosErr.response?.data?.message || "Failed to approve log.");
      setTimeout(() => setLogError(null), 5000);
    },
  });

  // 6. Mutation: Reject Log
  const rejectLogMutation = useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.post(`/alias/learner/logs/${id}/reject`);
    },
    onSuccess: () => {
      setLogSuccess("Learner alias rejected.");
      queryClient.invalidateQueries({ queryKey: ["learnerLogs"] });
      queryClient.invalidateQueries({ queryKey: ["aliases"] });
      setTimeout(() => setLogSuccess(null), 3000);
    },
    onError: (err: unknown) => {
      console.error(err);
      const axiosErr = err as AxiosErrorLike;
      setLogError(axiosErr.response?.data?.message || "Failed to reject log.");
      setTimeout(() => setLogError(null), 5000);
    },
  });

  // Define columns for Alias table using TanStack Table
  const aliasColumns = React.useMemo<ColumnDef<AliasEntry>[]>(
    () => [
      {
        accessorKey: "product",
        header: "Product",
        cell: ({ getValue }) => (
          <span className="font-semibold text-white">{getValue<string>().toUpperCase()}</span>
        ),
      },
      {
        accessorKey: "info",
        header: "Sub-Component",
        cell: ({ getValue }) => (
          <span className="font-mono text-slate-400">
            {getValue<string>() || <span className="text-slate-600 italic">basic</span>}
          </span>
        ),
      },
      {
        accessorKey: "attribute",
        header: "Attribute",
        cell: ({ getValue }) => (
          <span className="font-mono text-blue-400">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "alias",
        header: "Raw Key (Alias)",
        cell: ({ getValue }) => (
          <span className="font-mono text-emerald-400">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "source",
        header: "Source",
        cell: ({ getValue }) => {
          const source = getValue<string>();
          return (
            <span
              className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                source === "seed"
                  ? "bg-blue-550/10 text-blue-400 border border-blue-500/20"
                  : source === "manual"
                    ? "bg-purple-550/10 text-purple-400 border border-purple-500/20"
                    : "bg-emerald-550/10 text-emerald-400 border border-emerald-500/20"
              }`}
            >
              {source.toUpperCase()}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="text-right">
            <button
              type="button"
              onClick={() => {
                if (confirm("Are you sure you want to delete this alias mapping?")) {
                  deleteAliasMutation.mutate(row.original.id);
                }
              }}
              className="text-[10px] text-rose-400 hover:text-rose-300 font-bold hover:underline cursor-pointer"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [deleteAliasMutation]
  );

  // Define columns for LearnerLog table using TanStack Table
  const logColumns = React.useMemo<ColumnDef<LearnerLog>[]>(
    () => [
      {
        accessorKey: "product",
        header: "Product",
        cell: ({ getValue }) => (
          <span className="font-semibold text-white">{getValue<string>().toUpperCase()}</span>
        ),
      },
      {
        accessorKey: "info",
        header: "Sub-Component",
        cell: ({ getValue }) => (
          <span className="font-mono text-slate-400">
            {getValue<string>() || <span className="text-slate-600 italic">basic</span>}
          </span>
        ),
      },
      {
        accessorKey: "attribute",
        header: "Target Attribute",
        cell: ({ getValue }) => (
          <span className="font-mono text-blue-400">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "raw_key",
        header: "Raw Key Learned",
        cell: ({ getValue }) => (
          <span className="font-mono text-yellow-450">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "match_score",
        header: "Score",
        cell: ({ getValue }) => (
          <span className="font-bold text-slate-300">{getValue<number>()}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <span
              className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                status === "auto"
                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  : status === "approved"
                    ? "bg-emerald-550/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-550/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              {status.toUpperCase()}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const log = row.original;
          return (
            <div className="text-right">
              {log.status === "auto" ? (
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => approveLogMutation.mutate(log.id)}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectLogMutation.mutate(log.id)}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-bold hover:underline cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span className="text-slate-500 italic text-[10px]">Reviewed</span>
              )}
            </div>
          );
        },
      },
    ],
    [approveLogMutation, rejectLogMutation]
  );

  // Initialize TanStack Tables
  const aliasTable = useReactTable({
    data: aliasData?.data ?? [],
    columns: aliasColumns,
    pageCount: aliasData?.totalPages ?? -1,
    state: {
      pagination: {
        pageIndex: aliasTableState.state.page - 1,
        pageSize: aliasTableState.state.limit,
      },
      sorting: aliasTableState.state.sort_key
        ? [
            {
              id: aliasTableState.state.sort_key,
              desc: aliasTableState.state.sort_order === "desc",
            },
          ]
        : [],
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const nextState = updater({
          pageIndex: aliasTableState.state.page - 1,
          pageSize: aliasTableState.state.limit,
        });
        aliasTableState.setPage(nextState.pageIndex + 1);
        aliasTableState.setPageSize(nextState.pageSize);
      } else {
        aliasTableState.setPage(updater.pageIndex + 1);
        aliasTableState.setPageSize(updater.pageSize);
      }
    },
    onSortingChange: (updater) => {
      const currentSort = aliasTableState.state.sort_key
        ? [
            {
              id: aliasTableState.state.sort_key,
              desc: aliasTableState.state.sort_order === "desc",
            },
          ]
        : [];
      const nextSorting = typeof updater === "function" ? updater(currentSort) : updater;
      if (nextSorting.length > 0) {
        aliasTableState.setSort(nextSorting[0].id, nextSorting[0].desc ? "desc" : "asc");
      } else {
        aliasTableState.setSort(undefined, undefined);
      }
    },
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  const logTable = useReactTable({
    data: logData?.data ?? [],
    columns: logColumns,
    pageCount: logData?.totalPages ?? -1,
    state: {
      pagination: {
        pageIndex: logTableState.state.page - 1,
        pageSize: logTableState.state.limit,
      },
      sorting: logTableState.state.sort_key
        ? [{ id: logTableState.state.sort_key, desc: logTableState.state.sort_order === "desc" }]
        : [],
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const nextState = updater({
          pageIndex: logTableState.state.page - 1,
          pageSize: logTableState.state.limit,
        });
        logTableState.setPage(nextState.pageIndex + 1);
        logTableState.setPageSize(nextState.pageSize);
      } else {
        logTableState.setPage(updater.pageIndex + 1);
        logTableState.setPageSize(updater.pageSize);
      }
    },
    onSortingChange: (updater) => {
      const currentSort = logTableState.state.sort_key
        ? [{ id: logTableState.state.sort_key, desc: logTableState.state.sort_order === "desc" }]
        : [];
      const nextSorting = typeof updater === "function" ? updater(currentSort) : updater;
      if (nextSorting.length > 0) {
        logTableState.setSort(nextSorting[0].id, nextSorting[0].desc ? "desc" : "asc");
      } else {
        logTableState.setSort(undefined, undefined);
      }
    },
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-4 md:p-6 text-line bg-slate-900/40 rounded-xl backdrop-blur-md border border-slate-700/50 shadow-2xl">
      {/* Header */}
      <div className="flex flex-row justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Alias Registry Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Configure raw spec mapping mappings and review auto-learned keys from crawler processes.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/mapper"
            className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/40 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700/60 hover:border-slate-600 transition-all shadow-md cursor-pointer"
          >
            Open Specs Mapper
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/80 w-full max-w-md">
        <button
          type="button"
          onClick={() => {
            setActiveTab("aliases");
            setSelectedRow(null);
            setShowAddForm(false);
          }}
          className={`flex-1 py-2 rounded text-xs font-bold cursor-pointer transition-all ${
            activeTab === "aliases"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Manage Aliases
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("logs");
            setSelectedRow(null);
            setShowAddForm(false);
          }}
          className={`flex-1 py-2 rounded text-xs font-bold cursor-pointer transition-all ${
            activeTab === "logs"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Learner Logs
        </button>
      </div>

      {/* Tab 1: Manage Aliases */}
      {activeTab === "aliases" && (
        <div className="flex flex-col gap-6">
          {/* Notification Alerts */}
          {aliasSuccess && (
            <div className="text-emerald-400 text-xs bg-emerald-950/20 border border-emerald-900/50 p-3 rounded-lg">
              {aliasSuccess}
            </div>
          )}
          {aliasError && (
            <div className="text-rose-400 text-xs bg-rose-950/20 border border-rose-900/50 p-3 rounded-lg">
              {aliasError}
            </div>
          )}

          {/* Add Drawer Toggle / Card */}
          {showAddForm ? (
            <AddAliasForm
              key={
                selectedRow
                  ? `alias-form-${selectedRow.id || "new"}-${selectedRow.alias}-${selectedRow.attribute}`
                  : "alias-form-empty"
              }
              initialValue={selectedRow}
              onSubmit={(payload) => {
                if (selectedRow?.id) {
                  updateAliasMutation.mutate({ id: selectedRow.id, ...payload });
                } else {
                  createAliasMutation.mutate(payload);
                }
              }}
              onCancel={() => {
                setShowAddForm(false);
                setSelectedRow(null);
              }}
              isPending={createAliasMutation.isPending || updateAliasMutation.isPending}
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setSelectedRow(null);
                setShowAddForm(true);
              }}
              className="w-full py-2.5 bg-blue-600/10 hover:bg-blue-600/25 border border-blue-500/20 hover:border-blue-500/40 text-blue-400 font-bold text-xs rounded-lg transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              + Register New Custom Alias Mapping
            </button>
          )}

          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 flex flex-col gap-1 w-full">
              <input
                type="text"
                placeholder="Search raw alias key..."
                value={aliasTableState.state.alias ?? ""}
                onChange={(e) => {
                  aliasTableState.setFilter("alias", e.target.value || undefined);
                }}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 w-full"
              />
            </div>

            {/* Product Filter */}
            <div className="flex flex-col gap-1 w-full sm:w-60">
              <select
                value={aliasTableState.state.product ?? ""}
                onChange={(e) => {
                  aliasTableState.setFilter("product", e.target.value || undefined);
                }}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 w-full"
              >
                <option value="">All Products</option>
                <option value="basic">BASIC INFO</option>
                {Object.values(Products).map((p) => (
                  <option key={p} value={p}>
                    {p.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Aliases Table */}
          <DataTable
            table={aliasTable}
            isLoading={loadingAliases}
            loadingMessage="Loading alias mappings..."
            emptyMessage="No alias mappings found matching search."
            onRowClick={(row) => {
              setSelectedRow({
                id: row.id,
                product: row.product,
                info: row.info || "",
                attribute: row.attribute,
                alias: row.alias || "",
              });
              setShowAddForm(true);
            }}
          />

          {/* Pagination */}
          {aliasData && (
            <TablePagination
              total={aliasData.total}
              page={aliasData.page}
              totalPages={aliasData.totalPages}
              pageSize={aliasTableState.state.limit}
              onPageSizeChange={(size) => aliasTableState.setPageSize(size)}
              onPageChange={(page) => aliasTableState.setPage(page)}
              entryLabel="entries"
            />
          )}
        </div>
      )}

      {/* Tab 2: Learner Logs */}
      {activeTab === "logs" && (
        <div className="flex flex-col gap-6">
          {/* Notification Alerts */}
          {logSuccess && (
            <div className="text-emerald-400 text-xs bg-emerald-950/20 border border-emerald-900/50 p-3 rounded-lg">
              {logSuccess}
            </div>
          )}
          {logError && (
            <div className="text-rose-400 text-xs bg-rose-950/20 border border-rose-900/50 p-3 rounded-lg">
              {logError}
            </div>
          )}

          {/* Filter logs */}
          <div className="flex justify-end">
            <div className="flex flex-col gap-1 w-full sm:w-60">
              <select
                value={logTableState.state.status ?? ""}
                onChange={(e) => {
                  logTableState.setFilter("status", e.target.value || undefined);
                }}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 w-full"
              >
                <option value="">All Logs</option>
                <option value="auto">Auto Learned (Unreviewed)</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Logs Table */}
          <DataTable
            table={logTable}
            isLoading={loadingLogs}
            loadingMessage="Loading learning logs..."
            emptyMessage="No learning events found in history."
            onRowClick={(row) => {
              setSelectedRow({
                product: row.product,
                info: row.info || "",
                attribute: row.attribute,
                alias: row.raw_key || "",
              });
              setShowAddForm(true);
            }}
          />

          {/* Pagination */}
          {logData && (
            <TablePagination
              total={logData.total}
              page={logData.page}
              totalPages={logData.totalPages}
              pageSize={logTableState.state.limit}
              onPageSizeChange={(size) => logTableState.setPageSize(size)}
              onPageChange={(page) => logTableState.setPage(page)}
              entryLabel="logs"
            />
          )}
        </div>
      )}
    </div>
  );
}
