const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);

// Seed avatars and me
const avatars = [
  "https://i.pravatar.cc/100?img=5",
  "https://i.pravatar.cc/100?img=32",
  "https://i.pravatar.cc/100?img=15",
  "https://i.pravatar.cc/100?img=49",
  "https://i.pravatar.cc/100?img=68",
  "https://i.pravatar.cc/100?img=23",
];
$("#meAvatar").src = "https://i.pravatar.cc/100?img=3";

const storeKey = "orbit_state_v1";
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(storeKey);
    if (raw) return JSON.parse(raw);
  } catch {}
  const now = Date.now();
  return {
    activeId: null,
    chats: [
      {
        id: id(),
        name: "General",
        avatar: avatars[0],
        unread: 0,
        messages: [
          msg("other", "Hey, welcome to OrbitChat! ✨", now - 1000 * 60 * 12),
          msg("me", "Thanks! UI looks cool already.", now - 1000 * 60 * 9),
          msg("other", "Type a message below and hit Send.", now - 1000 * 60 * 8),
        ],
      },
      {
        id: id(),
        name: "Project Orbit",
        avatar: avatars[1],
        unread: 1,
        messages: [
          msg("other", "Let’s ship the new design today.", now - 1000 * 60 * 40),
          msg("me", "On it 🚀", now - 1000 * 60 * 35),
        ],
      },
    ],
    theme: "dark",
  };
}
function saveState() {
  localStorage.setItem(storeKey, JSON.stringify(state));
}
function id() {
  return Math.random().toString(36).slice(2, 10);
}
function msg(who, text, t = Date.now()) {
  return { id: id(), who, text, t, seen: who === "me" ? false : true, type: "text" };
}

const els = {
  chatList: $("#chatList"),
  chatPane: $("#chatPane"),
  empty: $("#emptyState"),
  messages: $("#messages"),
  activeAvatar: $("#activeAvatar"),
  activeTitle: $("#activeTitle"),
  activeStatus: $("#activeStatus"),
  search: $("#searchInput"),
  newChat: $("#newChat"),
  fabNew: $("#fabNew"),
  renameChat: $("#renameChat"),
  deleteChat: $("#deleteChat"),
  messageInput: $("#messageInput"),
  sendBtn: $("#sendBtn"),
  attachBtn: $("#attachBtn"),
  emojiBtn: $("#emojiBtn"),
  micBtn: $("#micBtn"),
  fileInput: $("#fileInput"),
  imageInput: $("#imageInput"),
  cameraBtn: $("#cameraBtn"),
  gifBtn: $("#gifBtn"),
  codeBtn: $("#codeBtn"),
  pollBtn: $("#pollBtn"),
  themeToggle: $("#themeToggle"),
  clearAll: $("#clearAll"),
  summarizeChat: $("#summarizeChat"),
  exportChat: $("#exportChat"),
};

init();
function init() {
  // Theme
  setTheme(state.theme || "dark");
  els.themeToggle.addEventListener("click", () => setTheme(toggleTheme()));

  // Search
  els.search.addEventListener("input", renderChatList);

  // New chat buttons
  els.newChat.addEventListener("click", createChatFlow);
  els.fabNew.addEventListener("click", createChatFlow);

  // Chat actions
  els.renameChat.addEventListener("click", renameActiveChat);
  els.deleteChat.addEventListener("click", deleteActiveChat);
  els.summarizeChat.addEventListener("click", summarizeActiveChat);
  els.exportChat.addEventListener("click", exportActiveChat);

  // Composer
  autosizeTextarea(els.messageInput);
  els.messageInput.addEventListener("input", onComposerChanged);
  els.messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      trySend();
    }
  });
  els.sendBtn.addEventListener("click", trySend);
  els.attachBtn.addEventListener("click", () => els.fileInput.click());
  els.fileInput.addEventListener("change", onFilePicked);
  els.cameraBtn.addEventListener("click", () => els.imageInput.click());
  els.imageInput.addEventListener("change", onImagePicked);
  els.gifBtn.addEventListener("click", insertGifPlaceholder);
  els.codeBtn.addEventListener("click", insertCodeBlock);
  els.pollBtn.addEventListener("click", insertPollTemplate);
  els.emojiBtn.addEventListener("click", insertEmoji);
  els.micBtn.addEventListener("click", () => toast("Voice recording not wired yet 🔈"));

  // Clear all (for demo)
  $("#clearAll").addEventListener("click", () => {
    if (confirm("Clear all local chats?")) {
      localStorage.removeItem(storeKey);
      state = loadState();
      renderAll();
      toast("Cleared");
    }
  });

  renderAll();
}

function renderAll() {
  renderChatList();
  renderActiveChat();
}

// Sidebar list
function renderChatList() {
  const q = (els.search.value || "").toLowerCase().trim();
  const frag = document.createDocumentFragment();

  state.chats
    .map((c) => ({
      ...c,
      lastText:
        c.messages.length ? c.messages[c.messages.length - 1].text.replace(/\s+/g, " ") : "No messages yet",
    }))
    .filter((c) => !q || c.name.toLowerCase().includes(q) || c.lastText.toLowerCase().includes(q))
    .forEach((c) => {
      const item = document.createElement("div");
      item.className = "chat-item" + (state.activeId === c.id ? " active" : "");
      item.innerHTML = `
        <img class="avatar" src="${c.avatar}" alt="">
        <div class="info">
          <div class="name">${escapeHtml(c.name)}</div>
          <div class="preview">${escapeHtml(c.lastText)}</div>
        </div>
        <div class="right">${c.unread ? `<span class="badge">${c.unread}</span>` : ""}</div>
      `;
      item.addEventListener("click", () => setActiveChat(c.id));
      frag.appendChild(item);
    });

  els.chatList.innerHTML = "";
  els.chatList.appendChild(frag);
}

// Active chat
function renderActiveChat() {
  const c = state.chats.find((x) => x.id === state.activeId);
  if (!c) {
    els.empty.classList.remove("hidden");
    els.chatPane.classList.add("hidden");
    return;
  }
  els.empty.classList.add("hidden");
  els.chatPane.classList.remove("hidden");

  c.unread = 0;
  els.activeAvatar.src = c.avatar;
  els.activeTitle.textContent = c.name;
  els.activeStatus.textContent = "online";

  // messages
  const frag = document.createDocumentFragment();
  let prevDay = "";
  c.messages.forEach((m) => {
    const day = new Date(m.t).toDateString();
    if (day !== prevDay) {
      const d = document.createElement("div");
      d.className = "day-sep";
      d.textContent = new Date(m.t).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      frag.appendChild(d);
      prevDay = day;
    }
    const row = document.createElement("div");
    row.className = "msg-row " + (m.who === "me" ? "me" : "other");

    const bubble = document.createElement("div");
    bubble.className = "msg " + (m.who === "me" ? "me" : "other");
    bubble.innerHTML = `
      <div class="txt">${linkify(escapeHtml(m.text))}</div>
      <div class="meta">
        <span>${timeStr(m.t)}</span>
        ${m.who === "me" ? `<span class="dot"></span><span>${m.seen ? "seen" : "sent"}</span>` : ""}
      </div>
    `;
    row.appendChild(bubble);
    frag.appendChild(row);
  });

  els.messages.innerHTML = "";
  els.messages.appendChild(frag);
  scrollToBottom();
}

// Actions
function setActiveChat(idVal) {
  state.activeId = idVal;
  saveState();
  renderChatList();
  renderActiveChat();
}
function createChatFlow() {
  const name = prompt("Name this chat:");
  if (!name) return;
  const c = {
    id: id(),
    name: name.trim(),
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
    unread: 0,
    messages: [msg("other", `You created "${name.trim()}". Say hi! 👋`)],
  };
  state.chats.unshift(c);
  state.activeId = c.id;
  saveState();
  renderAll();
  toast("Chat created");
}
function renameActiveChat() {
  const c = currentChat();
  if (!c) return;
  const next = prompt("Rename chat:", c.name);
  if (!next) return;
  c.name = next.trim();
  saveState();
  renderAll();
}
function deleteActiveChat() {
  const c = currentChat();
  if (!c) return;
  if (!confirm(`Delete "${c.name}"?`)) return;
  state.chats = state.chats.filter((x) => x.id !== c.id);
  state.activeId = state.chats[0]?.id || null;
  saveState();
  renderAll();
}

function onComposerChanged() {
  els.sendBtn.disabled = !els.messageInput.value.trim();
  autoGrow(els.messageInput);
}
function trySend() {
  const c = currentChat();
  if (!c) return toast("Create/select a chat first");
  const text = els.messageInput.value.trim();
  if (!text) return;

  const m = msg("me", text);
  c.messages.push(m);
  els.messageInput.value = "";
  els.sendBtn.disabled = true;
  autoGrow(els.messageInput);
  saveState();
  renderActiveChat();

  // simulate "typing" indicator then reply
  showTyping(c.id);
  setTimeout(() => {
    hideTyping(c.id);
    const reply = msg("other", autoReply(text));
    c.messages.push(reply);
    // mark previous my last message as seen
    m.seen = true;
    saveState();
    renderActiveChat();
  }, 800 + Math.random() * 800);
}
function onFilePicked(e) {
  const f = e.target.files?.[0];
  if (!f) return;
  els.messageInput.value += (els.messageInput.value ? " " : "") + `[file: ${f.name}]`;
  onComposerChanged();
  e.target.value = "";
}
function onImagePicked(e) {
  const f = e.target.files?.[0];
  if (!f) return;
  els.messageInput.value += (els.messageInput.value ? "\n" : "") + `![image](${URL.createObjectURL(f)})`;
  onComposerChanged();
  e.target.value = "";
}
function insertGifPlaceholder() {
  const q = prompt("Search GIFs (placeholder):", "cheers");
  if (!q) return;
  const url = `https://media.giphy.com/media/3o6Zt8MgUuvSbkZYWc/giphy.gif`;
  els.messageInput.value += (els.messageInput.value ? "\n" : "") + `![gif:${q}](${url})`;
  onComposerChanged();
}
function insertCodeBlock() {
  const lang = prompt("Language for code block:", "javascript");
  const template = `\n\n\u0060\u0060\u0060${lang || ""}\n// your code here\n\u0060\u0060\u0060\n`;
  els.messageInput.value += template;
  onComposerChanged();
}
function insertPollTemplate() {
  const q = prompt("Poll question:", "What should we build next?");
  if (!q) return;
  const options = ["Option A", "Option B", "Option C"];
  const block = [
    `\n[Poll] ${q}`,
    ...options.map((o, i) => `(${i + 1}) ${o}`),
    "Vote by replying with the option number.",
  ].join("\n");
  els.messageInput.value += (els.messageInput.value ? "\n" : "") + block + "\n";
  onComposerChanged();
}
function insertEmoji() {
  const add = ["😊", "✨", "🚀", "🔥", "👍", "🤝"][Math.floor(Math.random() * 6)];
  const el = els.messageInput;
  const start = el.selectionStart ?? el.value.length;
  el.value = el.value.slice(0, start) + add + el.value.slice(start);
  onComposerChanged();
  el.focus();
  el.selectionStart = el.selectionEnd = start + add.length;
}

// Typing indicator
let typingFor = null;
function showTyping(chatId) {
  typingFor = chatId;
  const c = state.chats.find((x) => x.id === chatId);
  if (!c) return;
  const row = document.createElement("div");
  row.className = "msg-row";
  row.dataset.typing = "1";
  const bubble = document.createElement("div");
  bubble.className = "msg other";
  bubble.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`;
  row.appendChild(bubble);
  els.messages.appendChild(row);
  scrollToBottom();
}
function hideTyping(chatId) {
  if (typingFor !== chatId) return;
  $$('[data-typing="1"]').forEach((n) => n.remove());
  typingFor = null;
}

// Helpers
function currentChat() {
  return state.chats.find((x) => x.id === state.activeId);
}
function setTheme(next) {
  document.documentElement.setAttribute("data-theme", next);
  state.theme = next;
  saveState();
}
function toggleTheme() {
  return (state.theme = state.theme === "dark" ? "light" : "dark");
}
function timeStr(t) {
  return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function autoGrow(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 140) + "px";
}
function autosizeTextarea(el) {
  el.addEventListener("input", () => autoGrow(el));
  autoGrow(el);
}
function scrollToBottom() {
  requestAnimationFrame(() => {
    els.messages.scrollTop = els.messages.scrollHeight;
  });
}
function toast(msg) {
  const div = document.createElement("div");
  div.textContent = msg;
  div.style.cssText =
    "position:fixed;left:50%;bottom:22px;transform:translateX(-50%);background:rgba(0,0,0,.65);color:#fff;padding:8px 12px;border-radius:10px;font-size:12px;z-index:1000";
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1500);
}
function download(filename, text) {
  const a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  a.setAttribute('download', filename);
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function summarizeActiveChat() {
  const c = currentChat();
  if (!c) return toast("No active chat");
  const lastN = c.messages.slice(-20);
  const summary = [
    `Summary of "${c.name}":`,
    ...lastN.map(m => `${m.who === 'me' ? 'You' : 'Other'}: ${m.text}`)
  ].join('\n');
  toast("Summary added as draft");
  els.messageInput.value = summary + "\n\nTL;DR: ";
  onComposerChanged();
}
function exportActiveChat() {
  const c = currentChat();
  if (!c) return toast("No active chat");
  const lines = [
    `Chat: ${c.name}`,
    `Exported: ${new Date().toLocaleString()}`,
    ''
  ];
  c.messages.forEach(m => {
    lines.push(`[${new Date(m.t).toLocaleString()}] ${m.who.toUpperCase()}: ${m.text}`);
  });
  download(`${c.name.replace(/[^a-z0-9-_]+/gi,'_')}.txt`, lines.join('\n'));
  toast("Exported");
}
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function linkify(s) {
  return s.replace(
    /(https?:\/\/[^\s]+)/g,
    (m) => `<a href="${m}" target="_blank" rel="noreferrer" style="color: var(--secondary); text-decoration: underline;">${m}</a>`
  );
}
function autoReply(text) {
  const low = text.toLowerCase();
  if (low.includes("hi") || low.includes("hello")) return "Hi! How can I help? 😊";
  if (low.includes("theme")) return "Use the sun/moon button to switch themes.";
  if (low.includes("file")) return "Attachment noted. I don’t upload files in demo mode.";
  if (low.includes("who")) return "I’m OrbitBot — here for demos and vibes 🚀";
  return "Got it! (This is a demo reply. Wire me to your backend when ready.)";
}

// initial select first chat on first load
if (!state.activeId && state.chats[0]) {
  state.activeId = state.chats[0].id;
  saveState();
}
renderAll();
