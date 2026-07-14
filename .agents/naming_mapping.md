# PC-Builder Project Conventions: Naming & Data Mapping

Future agents working on the PC-Builder monorepo must strictly adhere to the following data parsing, naming, mapping, and slugification conventions.

---

## 1. Naming Conventions & Unique Identifiers

- **`name`**: The official marketing name scraped from official specs (e.g. `'Intel® Core™ i5-12400 Processor'`).
- **`code_name`**: Must represent the **unique manufacturing part number** or processor number.
  - **Intel CPUs**: Use the `Processor Number` (e.g. `i5-12400`, `i7-14700K`).
  - **AMD CPUs**: Use the `OPN`, `Product ID Boxed`, or `Product ID MPK` (e.g. `100-000000917`, `YD200GC6M2OFB`).
  - **GPUs**: Use the model number (e.g. `RTX-4090`, `RX-7900-XTX`).

---

## 2. Slug Generation Convention

Slug names are used to map crawled store/retail/benchmark items to clean database records.

- **Format**: Slugs must be generated using the shared utility `generateSlug` from `@pc-builder/shared/part`.
- **Structure**: `[brand]-[core_model]` (e.g., `'intel-i5-12400'`, `'amd-5600x'`, `'intel-8380'`).
- **Legacy Items**: Joins series letters with trailing models using hyphens (e.g. `A10 7400P` &rarr; `a10-7400p`).
- **Version preservation**: Appends `v2`/`v3`/`v4` designations to models if explicitly present.
- **Ordinal Exclusion**: Excludes ordinal generation markers (`7th`, `14th`) from fallback model number extraction to prevent generation clashes.

---

## 3. Data Mapping & Schema Conventions

- **Discrete Key Mapping**: Multi-value fields mapped to arrays of objects (like `cpu_memory`) must be parsed in parallel lists. Single properties (such as channel count or memory capacity) must automatically fall back to index `0` if undefined at index `i`.
- **Integrated GPU Protection**: The general CPU `Family` key must **never** be mapped to `gpu_spec.family` on CPU products. Integrated GPU families must only be mapped if the raw attributes explicitly name an integrated graphics model (e.g., `Graphics Model` or `GPU Brand`).
- **Dynamic Core Configurations**: Hybrid core counts (P-cores, E-cores, LP E-cores) must be parsed dynamically from raw key name prefixes. Core types with a count of `0` or undefined must be filtered out and excluded from the final `cpu_core_config` array.
