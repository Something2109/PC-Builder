"use client";

import { Products, Mapping, Information, SELF_ATTRIBUTE } from "@pc-builder/shared/part";
import React, { useState } from "react";
import { z } from "zod";

const BASIC_ATTRIBUTES = [
  "product_name",
  "code_name",
  "brand",
  "series",
  "launch_date",
  "url",
  "image_url",
];

interface AddAliasFormProps {
  onSubmit: (payload: { product: string; info: string; attribute: string; alias: string }) => void;
  onCancel: () => void;
  isPending: boolean;
  initialValue?: {
    id?: number;
    product: string;
    info: string;
    attribute: string;
    alias: string;
  } | null;
}

export function AddAliasForm({ onSubmit, onCancel, isPending, initialValue }: AddAliasFormProps) {
  const [newProduct, setNewProduct] = useState(initialValue?.product ?? "basic");
  const [newInfo, setNewInfo] = useState(initialValue?.info ?? "");
  const [newAttribute, setNewAttribute] = useState(initialValue?.attribute ?? BASIC_ATTRIBUTES[0]);
  const [newAlias, setNewAlias] = useState(initialValue?.alias ?? "");

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
    let attrs: string[] = [SELF_ATTRIBUTE];
    if (schema instanceof z.ZodObject) {
      attrs = [SELF_ATTRIBUTE, ...Object.keys(schema.shape)];
    }
    setNewAttribute(attrs[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlias.trim()) return;

    onSubmit({
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
    if (!newInfo) return [SELF_ATTRIBUTE];

    const schema = Information.Info.shape[newInfo as keyof typeof Information.Info.shape];
    if (schema instanceof z.ZodObject) {
      return [SELF_ATTRIBUTE, ...Object.keys(schema.shape)];
    }
    return [SELF_ATTRIBUTE];
  })();

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex flex-col gap-4"
    >
      <div className="flex flex-row justify-between items-center border-b border-slate-800 pb-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          {initialValue?.id ? "Edit Custom Alias Mapping" : "Add New Alias Mapping"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
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
        disabled={isPending}
        className="w-full md:w-auto self-end px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
      >
        {isPending && (
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {initialValue?.id ? "Save Changes" : "Register Alias"}
      </button>
    </form>
  );
}
