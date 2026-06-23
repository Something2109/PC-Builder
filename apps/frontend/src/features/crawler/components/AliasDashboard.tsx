"use client";

import { Products, Mapping, Information } from "@pc-builder/shared/part";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";

import axiosInstance from "@/lib/axios";

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

const BASIC_ATTRIBUTES = [
  "product_name",
  "code_name",
  "brand",
  "series",
  "launch_date",
  "url",
  "image_url",
];

type ActiveTab = "aliases" | "logs";

export default function AliasDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ActiveTab>("aliases");

  // Manage Aliases State
  const [aliasPage, setAliasPage] = useState(1);
  const [aliasSearch, setAliasSearch] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [aliasError, setAliasError] = useState<string | null>(null);
  const [aliasSuccess, setAliasSuccess] = useState<string | null>(null);

  // Add Alias Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState("basic");
  const [newInfo, setNewInfo] = useState("");
  const [newAttribute, setNewAttribute] = useState("");
  const [newAlias, setNewAlias] = useState("");

  // Logs State
  const [logPage, setLogPage] = useState(1);
  const [logStatusFilter, setLogStatusFilter] = useState("");
  const [logError, setLogError] = useState<string | null>(null);
  const [logSuccess, setLogSuccess] = useState<string | null>(null);

  const limit = 10;

  // 1. Query: List Aliases
  const { data: aliasData, isLoading: loadingAliases } = useQuery<AliasListResponse>({
    queryKey: ["aliases", aliasPage, aliasSearch, productFilter],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page: aliasPage,
        limit,
      };
      if (aliasSearch) params.alias = aliasSearch;
      if (productFilter) params.product = productFilter;

      const response = await axiosInstance.get<AliasListResponse>("/alias", { params });
      return response.data;
    },
  });

  // 2. Query: List Learner Logs
  const { data: logData, isLoading: loadingLogs } = useQuery<LogListResponse>({
    queryKey: ["learnerLogs", logPage, logStatusFilter],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page: logPage,
        limit,
      };
      if (logStatusFilter) params.status = logStatusFilter;

      const response = await axiosInstance.get<LogListResponse>("/alias/learner/logs", { params });
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
      setNewAlias("");
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

  // Handle Form changes
  const handleProductChange = (prod: string) => {
    setNewProduct(prod);
    if (prod === "basic") {
      setNewInfo("");
      setNewAttribute(BASIC_ATTRIBUTES[0]);
    } else {
      const allowedInfos = Mapping.Info[prod as Products] || [];
      const firstInfo = allowedInfos[0] || "";
      setNewInfo(firstInfo);
      updateAttributesList(prod, firstInfo);
    }
  };

  const handleInfoChange = (info: string) => {
    setNewInfo(info);
    updateAttributesList(newProduct, info);
  };

  const updateAttributesList = (prod: string, info: string) => {
    if (prod === "basic") {
      setNewAttribute(BASIC_ATTRIBUTES[0]);
      return;
    }

    const schema = Information.Info.shape[info as keyof typeof Information.Info.shape];
    let attrs: string[] = ["_self"];
    if (schema instanceof z.ZodObject) {
      attrs = ["_self", ...Object.keys(schema.shape)];
    }
    setNewAttribute(attrs[0]);
  };

  const handleAddAliasSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlias.trim()) return;

    createAliasMutation.mutate({
      product: newProduct,
      info: newInfo,
      attribute: newAttribute,
      alias: newAlias.trim(),
    });
  };

  // Compute options based on selections
  const allowedInfosForSelectedProduct =
    newProduct === "basic" ? [] : Mapping.Info[newProduct as Products] || [];

  const allowedAttributesForSelectedInfo = (() => {
    if (newProduct === "basic") return BASIC_ATTRIBUTES;
    if (!newInfo) return ["_self"];

    const schema = Information.Info.shape[newInfo as keyof typeof Information.Info.shape];
    if (schema instanceof z.ZodObject) {
      return ["_self", ...Object.keys(schema.shape)];
    }
    return ["_self"];
  })();

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
          onClick={() => setActiveTab("aliases")}
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
          onClick={() => setActiveTab("logs")}
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
            <form
              onSubmit={handleAddAliasSubmit}
              className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex flex-col gap-4"
            >
              <div className="flex flex-row justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Add New Alias Mapping
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Product */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Product
                  </label>
                  <select
                    value={newProduct}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className="bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="basic">BASIC INFO</option>
                    {Object.values(Products).map((p) => (
                      <option key={p} value={p}>
                        {p.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Info Component */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Info (Sub-Component)
                  </label>
                  <select
                    value={newInfo}
                    onChange={(e) => handleInfoChange(e.target.value)}
                    disabled={newProduct === "basic"}
                    className="bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  >
                    {newProduct === "basic" ? (
                      <option value="">N/A (Basic Attributes)</option>
                    ) : (
                      allowedInfosForSelectedProduct.map((info) => (
                        <option key={info} value={info}>
                          {info}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Attribute */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Schema Attribute
                  </label>
                  <select
                    value={newAttribute}
                    onChange={(e) => setNewAttribute(e.target.value)}
                    className="bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {allowedAttributesForSelectedInfo.map((attr) => (
                      <option key={attr} value={attr}>
                        {attr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Alias Key */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Raw Scraped Key (Alias)
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. usbports"
                    value={newAlias}
                    onChange={(e) => setNewAlias(e.target.value)}
                    className="bg-slate-950 border border-slate-700/80 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={createAliasMutation.isPending}
                className="w-full md:w-auto self-end px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                {createAliasMutation.isPending && (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Register Alias
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setShowAddForm(true);
                handleProductChange("basic");
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
                value={aliasSearch}
                onChange={(e) => {
                  setAliasSearch(e.target.value);
                  setAliasPage(1);
                }}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 w-full"
              />
            </div>

            {/* Product Filter */}
            <div className="flex flex-col gap-1 w-full sm:w-60">
              <select
                value={productFilter}
                onChange={(e) => {
                  setProductFilter(e.target.value);
                  setAliasPage(1);
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
          <div className="bg-slate-950/20 border border-slate-800 rounded-xl overflow-hidden">
            {loadingAliases ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading alias mappings...</span>
              </div>
            ) : !aliasData || aliasData.data.length === 0 ? (
              <div className="text-center py-20 text-slate-500 italic">
                No alias mappings found matching search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Sub-Component</th>
                      <th className="px-4 py-3">Attribute</th>
                      <th className="px-4 py-3">Raw Key (Alias)</th>
                      <th className="px-4 py-3 text-center">Source</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {aliasData.data.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-4 py-3 font-semibold text-white">
                          {entry.product.toUpperCase()}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-400">
                          {entry.info || <span className="text-slate-600 italic">basic</span>}
                        </td>
                        <td className="px-4 py-3 font-mono text-blue-400">{entry.attribute}</td>
                        <td className="px-4 py-3 font-mono text-emerald-400">{entry.alias}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                              entry.source === "seed"
                                ? "bg-blue-550/10 text-blue-400 border border-blue-500/20"
                                : entry.source === "manual"
                                  ? "bg-purple-550/10 text-purple-400 border border-purple-500/20"
                                  : "bg-emerald-550/10 text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            {entry.source.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this alias mapping?")) {
                                deleteAliasMutation.mutate(entry.id);
                              }
                            }}
                            className="text-[10px] text-rose-400 hover:text-rose-300 font-bold hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {aliasData && aliasData.totalPages > 1 && (
            <div className="flex flex-row justify-between items-center text-xs text-slate-400 mt-2">
              <div>
                Showing page <span className="text-white font-bold">{aliasData.page}</span> of{" "}
                <span className="text-white font-bold">{aliasData.totalPages}</span> (
                <span className="text-white">{aliasData.total}</span> total entries)
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={aliasPage === 1}
                  onClick={() => setAliasPage((prev) => prev - 1)}
                  className="px-3 py-1 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold cursor-pointer"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={aliasPage === aliasData.totalPages}
                  onClick={() => setAliasPage((prev) => prev + 1)}
                  className="px-3 py-1 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
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
                value={logStatusFilter}
                onChange={(e) => {
                  setLogStatusFilter(e.target.value);
                  setLogPage(1);
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
          <div className="bg-slate-950/20 border border-slate-800 rounded-xl overflow-hidden">
            {loadingLogs ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading learning logs...</span>
              </div>
            ) : !logData || logData.data.length === 0 ? (
              <div className="text-center py-20 text-slate-500 italic">
                No learning events found in history.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Sub-Component</th>
                      <th className="px-4 py-3">Target Attribute</th>
                      <th className="px-4 py-3">Raw Key Learned</th>
                      <th className="px-4 py-3 text-center">Score</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {logData.data.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-4 py-3 font-semibold text-white">
                          {log.product.toUpperCase()}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-400">
                          {log.info || <span className="text-slate-600 italic">basic</span>}
                        </td>
                        <td className="px-4 py-3 font-mono text-blue-400">{log.attribute}</td>
                        <td className="px-4 py-3 font-mono text-yellow-450">{log.raw_key}</td>
                        <td className="px-4 py-3 text-center font-bold text-slate-300">
                          {log.match_score}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.status === "auto"
                                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                : log.status === "approved"
                                  ? "bg-emerald-550/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-rose-550/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {log.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {logData && logData.totalPages > 1 && (
            <div className="flex flex-row justify-between items-center text-xs text-slate-400 mt-2">
              <div>
                Showing page <span className="text-white font-bold">{logData.page}</span> of{" "}
                <span className="text-white font-bold">{logData.totalPages}</span> (
                <span className="text-white">{logData.total}</span> total logs)
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={logPage === 1}
                  onClick={() => setLogPage((prev) => prev - 1)}
                  className="px-3 py-1 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold cursor-pointer"
                >
                  Prev
                </button>
                <button
                  type="button"
                  disabled={logPage === logData.totalPages}
                  onClick={() => setLogPage((prev) => prev + 1)}
                  className="px-3 py-1 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
