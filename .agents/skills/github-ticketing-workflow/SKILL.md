---
name: github-ticketing-workflow
description: End-to-end GitHub ticketing, branching, staged testing, and PR review workflow for playground.
---

# GitHub Ticketing & Development Lifecycle Skill

Skill ini mengatur alur kerja menyeluruh pengembangan fitur, perbaikan bug, atau refactoring pada repositori `playground` mulai dari proposal pengguna, pembuatan tiket GitHub, pengelolaan board GitHub Projects v2, eksekusi kode, pengujian, hingga pembuatan Pull Request dan rekap dokumentasi.

---

## 🔄 Alur Siklus Hidup (End-to-End Lifecycle)

```
[ 1. User Proposes Change ]
            │
            ▼
[ 2. Agent Creates GitHub Ticket (To-Do / Backlog) via MCP ]
     + Tambahkan ke Board Project #11 (Status: Backlog)
     + Sajikan Implementation Plan di Chat
            │
            ▼
[ 3. User Review & Approval Gate ]
            │
            ▼
[ 4. Agent Moves Ticket to "In Process" & Creates Conventional Branch ]
     + Update Board Project #11 ➔ "In progress"
     + Update Issue Metadata Table ➔ "🟡 In Process"
     + Checkout conventional branch
            │
            ▼
[ 5. Incremental Execution & Verification ]
            │
            ▼
[ 6. Commit, Push, Create Pull Request (Linked to Ticket) ]
            │
            ▼
[ 7. Agent Moves Ticket to "In Review" ]
     + Update Board Project #11 ➔ "In review"
     + Update Issue Metadata Table ➔ "🔍 In Review" & link PR
     + Tambah audit comment di Issue
            │
            ▼
[ 8. User PR Review, Merge, & Update Changes.md ]
     + Update Board Project #11 ➔ "Done"
     + Catat di Changes.md
```

---

## ⚙️ Persyaratan Autentikasi GitHub Token

Untuk dapat mengelola issue, pull request, dan mutasi board **GitHub Projects v2** (`@MChandraR's Playground Project`), token dapat dibaca langsung dari environment `$GITHUB_PERSONAL_ACCESS_TOKEN` atau diekstrak dari `~/.gemini/config/mcp_config.json`.
Scope yang wajib:
- `repo` (Full control repositori)
- `project` (Full control project boards)

---

## 🗂️ Referensi Konfigurasi GitHub Project #11

Board: **`@MChandraR's Playground Project`** (Project Number: `11`)
- **Project ID**: `PVT_kwHOCBKA_M4Bnw2S`
- **Field Status ID**: `PVTSSF_lAHOCBKA_M4Bnw2SzhmT8k4`
- **Status Option IDs**:
  | Status Nama | Option ID | Keterangan |
  | :--- | :--- | :--- |
  | `Backlog` | `f75ad846` | Saat tiket pertama kali dibuat (Tahap 2) |
  | `Ready` | `61e4505c` | Tiket siap dikerjakan / disetujui |
  | `In progress` | `47fc9ee4` | Saat branch dibuat & pengerjaan dimulai (Tahap 4) |
  | `In review` | `df73e18b` | Saat PR telah dibuka (Tahap 7) |
  | `Done` | `98236657` | Saat PR telah di-merge (Tahap 8) |

### Helper Script Mutasi Status Kartu Project Board:
```bash
python3 -c '
import json, urllib.request

with open("/Users/mcr/.gemini/config/mcp_config.json") as f:
    cfg = json.load(f)
token = cfg.get("mcpServers", {}).get("github-mcp-server", {}).get("env", {}).get("GITHUB_PERSONAL_ACCESS_TOKEN", "")

def run_query(query, variables=None):
    req = urllib.request.Request(
        "https://api.github.com/graphql",
        data=json.dumps({"query": query, "variables": variables or {}}).encode(),
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

# 1. Add issue to project if not already added
add_mutation = """
mutation($projectId: ID!, $contentId: ID!) {
  addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
    item { id }
  }
}
"""
# 2. Update status option
update_mutation = """
mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
  updateProjectV2ItemFieldValue(input: {
    projectId: $projectId,
    itemId: $itemId,
    fieldId: $fieldId,
    value: { singleSelectOptionId: $optionId }
  }) {
    projectV2Item { id }
  }
}
"""
'
```

---

## 📌 Rincian Tiap Tahap

### Tahap 1: Proposal Perubahan (User Proposal)
- Pengguna menyampaikan deskripsi fitur, perbaikan bug, atau refactor yang diinginkan.
- Agent meninjau kebutuhan teknis, UI/UX, dan rancangan arsitektur.

---

### Tahap 2: Pembuatan Tiket GitHub & Rencana Implementasi di Chat
Agent membuat tiket GitHub Issue baru menggunakan MCP server `github-mcp-server` (`issue_write` dengan `method: "create"`):
- **Repository**: `MChandraR/playground`
- **Assignee**: `MChandraR`
- **Labels**: Menyesuaikan tipe pekerjaan:
  - Feature: `enhancement`
  - Bugfix: `bug`
  - Refactor: `refactor`
- **Format Judul**:
  - `[FEAT]: <Judul Singkat Deskriptif>`
  - `[FIX]: <Judul Singkat Deskriptif>`
  - `[REFACTOR]: <Judul Singkat Deskriptif>`

#### Format Isi Body Tiket:
```markdown
# [<TYPE>]: <Judul Pekerjaan>

| Metadata | Detail |
| :--- | :--- |
| **Issue Key** | PLAY-<FEAT/FIX/REFACTOR>-<XX> |
| **Issue Type** | 🚀 Feature / 🐛 Bug Fix / 🛠️ Refactor |
| **Component** | Web / Frontend |
| **Target Branch** | `<conventional-branch-name>` |
| **Priority** | Medium |
| **Status** | To-Do / Backlog |
| **Assignee** | @MChandraR |

---

## 📌 1. Background & Problem Statement
<Latar belakang kebutuhan atau akar masalah>

---

## 📋 2. Proposed Changes & Implementation Details
<Rincian langkah implementasi>

---

## 📁 3. Scope of Changes
| File | Tipe Perubahan | Deskripsi |
| :--- | :--- | :--- |
| `...` | NEW / MODIFY | ... |

---

## 🧪 4. Verification Plan
- [ ] Pengujian fungsionalitas dan tampilan
- [ ] Validasi HTML/CSS/JS

---

## ✅ 5. Acceptance Criteria (Definition of Done)
- [ ] Kriteria 1
- [ ] Kriteria 2
```

Hubungkan Issue ke Project #11 (Status: `Backlog` / `f75ad846`).
Agent **wajib menyajikan rencana implementasi ini secara utuh di chat** agar pengguna dapat memeriksanya sebelum pengerjaan dimulai.

---

### Tahap 3: Gerbang Persetujuan Pengguna (Approval Gate)
- Pengguna memeriksa rencana implementasi.
- Agent **BERHENTI dan MENUNGGU** persetujuan eksplisit pengguna sebelum memodifikasi kode atau checkout branch baru.

---

### Tahap 4: Update Tiket ke "In Process" & Buat Branch Konvensional
Setelah disetujui:
1. **Pindahkan Status Board Project #11 ke `In progress`**:
   - Jalankan mutasi GraphQL dengan option ID `47fc9ee4`.
2. **Update Metadata Tiket**:
   - Panggil `issue_write` (`method: "update"`) untuk memperbarui status di tabel metadata issue menjadi `🟡 In Process`.
3. **Buat Branch Baru**:
   - Gunakan nama branch yang tercantum persis pada tabel metadata `Target Branch`:
     ```bash
     git checkout main
     git pull origin main
     git checkout -b <target-branch-name>
     ```

---

### Tahap 5: Eksekusi Bertahap & Verifikasi
1. Pengerjaan kode sesuai spesifikasi UI/UX modern, responsif, dan rapi.
2. Pengujian fungsi secara lokal dan visual.

---

### Tahap 6: Commit, Push, dan Pembuatan Pull Request (PR)
1. **Conventional Commit**:
   - Format: `<type>(<scope>): <deskripsi singkat>`
2. **Push ke Remote**:
   - `git push -u origin <branch-name>`
3. **Buat Pull Request via MCP Server** (`create_pull_request`):
   - **Base Branch**: `main`
   - **Head Branch**: `<branch-name>`
   - **Title**: `<type>(<scope>): <deskripsi singkat>`
   - **Body PR**:
     - Wajib mencantumkan `Closes #<issue_number>` agar tersambung ke issue.
     - Ringkasan perubahan dan bukti pengujian.

---

### Tahap 7: Update Tiket ke "In Review" & Sinkronisasi
1. **Pindahkan Status Board Project #11 ke `In review`**:
   - Option ID `df73e18b`.
2. **Update Metadata Tiket**:
   - `Status: 🔍 In Review`
   - `Pull Request: [#<PR_NO>](<PR_URL>)`
3. Tambahkan audit comment di Issue.

---

### Tahap 8: Review Pengguna, Merge, & Pencatatan `Changes.md`
1. Pengguna mereview PR dan melakukan merge di GitHub ke branch `main`.
2. Pindahkan status kartu di Board Project #11 ke **`Done`** (`98236657`).
3. Catat rilis perubahan ke berkas `Changes.md`.
