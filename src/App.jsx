import { useState, useMemo } from "react";
import { WEEKS, WEEKS_CONTINUED, SCHEDULE, CATEGORIES } from "./data";
import { WEEKS_4_TO_6 } from "./data2";

const ALL_WEEKS = [...WEEKS, ...WEEKS_CONTINUED, ...WEEKS_4_TO_6].sort((a, b) => a.id - b.id);

function App() {
  const [view, setView] = useState("home"); // home, week, dictionary
  const [activeWeek, setActiveWeek] = useState(null);
  const [activeTab, setActiveTab] = useState("vocab");
  const [showTr, setShowTr] = useState({});
  const [showPron, setShowPron] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const week = ALL_WEEKS.find((w) => w.id === activeWeek);
  const toggleTr = (key) => setShowTr((prev) => ({ ...prev, [key]: !prev[key] }));

  // Combine all vocabulary for dictionary
  const allVocabulary = useMemo(() => {
    const vocab = [];
    ALL_WEEKS.forEach(w => {
      w.vocabulary.forEach(v => {
        vocab.push({ ...v, weekId: w.id, weekTitle: w.title });
      });
      if (w.numbers) {
        w.numbers.forEach(n => {
          vocab.push({ ...n, category: "sayilar", weekId: w.id, weekTitle: w.title });
        });
      }
    });
    return vocab;
  }, []);

  const filteredVocabulary = useMemo(() => {
    return allVocabulary.filter(v => {
      const matchesSearch = searchTerm === "" ||
        v.gr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.tr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.pron.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || v.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allVocabulary, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set();
    allVocabulary.forEach(v => v.category && cats.add(v.category));
    return Array.from(cats);
  }, [allVocabulary]);

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentCard((prev) => (prev + 1) % filteredVocabulary.length);
  };

  const prevCard = () => {
    setShowAnswer(false);
    setCurrentCard((prev) => (prev - 1 + filteredVocabulary.length) % filteredVocabulary.length);
  };

  // HOME VIEW
  if (view === "home") {
    return (
      <div style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", background: "linear-gradient(160deg, #0D3B66 0%, #0a2540 50%, #051b30 100%)", minHeight: "100vh", color: "#fff", padding: 0 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 18px" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 52, marginBottom: 4 }}>🇬🇷</div>
            <h1 style={{ fontSize: 30, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Yunanca Öğreniyorum</h1>
            <p style={{ fontSize: 15, opacity: 0.75, margin: 0 }}>6 Haftalık Pratik Seyahat Yunancası</p>
            <p style={{ fontSize: 12, opacity: 0.5, margin: "6px 0 0", fontStyle: "italic" }}>Diyaloglar & Okuma Parçaları ile Adım Adım</p>
          </div>

          {/* Dictionary Button */}
          <button onClick={() => setView("dictionary")} style={{ width: "100%", padding: "16px", marginBottom: 20, background: "linear-gradient(135deg, #FFD54F, #FFA000)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#333", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            📚 Sözlük & Flashcard ({allVocabulary.length} kelime)
          </button>

          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 18px", marginBottom: 28, border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 style={{ fontSize: 16, margin: "0 0 14px", fontWeight: 600 }}>📅 Çalışma Programı</h2>
            {SCHEDULE.map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 10, padding: "10px 12px", background: i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent", borderRadius: 8, fontSize: 13, borderLeft: `3px solid ${ALL_WEEKS[i]?.color || "#fff"}`, marginBottom: 4 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{s.week}</div>
                  <div style={{ opacity: 0.5, fontSize: 11 }}>{s.days}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{s.focus}</div>
                  <div style={{ opacity: 0.5, fontSize: 11 }}>{s.daily}</div>
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 16, margin: "0 0 14px", fontWeight: 600, textAlign: "center" }}>Dersler — Bir haftaya tıklayarak başla</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ALL_WEEKS.map((w) => (
              <button key={w.id} onClick={() => { setActiveWeek(w.id); setView("week"); setActiveTab("vocab"); setShowTr({}); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, cursor: "pointer", textAlign: "left", color: "#fff", transition: "all 0.2s", borderLeft: `4px solid ${w.color}` }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "translateX(3px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateX(0)"; }}>
                <span style={{ fontSize: 28 }}>{w.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, opacity: 0.45, textTransform: "uppercase", letterSpacing: 1 }}>{w.id}. Hafta</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{w.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>{w.subtitle}</div>
                </div>
                <span style={{ fontSize: 18, opacity: 0.3 }}>→</span>
              </button>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 32, padding: 16, background: "rgba(255,255,255,0.04)", borderRadius: 10, fontSize: 12, opacity: 0.6 }}>
            <strong>Günlük Çalışma:</strong> 60 dakika (3 × 20dk) — Kelime → Diyalog → Okuma
          </div>
        </div>
      </div>
    );
  }

  // DICTIONARY VIEW
  if (view === "dictionary") {
    const currentVocab = filteredVocabulary[currentCard];

    return (
      <div style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", background: "#081e36", minHeight: "100vh", color: "#e0dbd2" }}>
        <div style={{ background: "linear-gradient(135deg, #FFD54F, #FFA000)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
          <button onClick={() => { setView("home"); setFlashcardMode(false); }} style={{ background: "rgba(0,0,0,0.2)", border: "none", color: "#333", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Geri</button>
          <span style={{ fontSize: 22 }}>📚</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#333" }}>Sözlük</div>
            <div style={{ fontSize: 11, color: "#555" }}>{filteredVocabulary.length} kelime</div>
          </div>
          <button onClick={() => { setFlashcardMode(!flashcardMode); setCurrentCard(0); setShowAnswer(false); }} style={{ background: flashcardMode ? "#333" : "rgba(0,0,0,0.2)", border: "none", color: flashcardMode ? "#FFD54F" : "#333", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            {flashcardMode ? "📋 Liste" : "🎴 Flashcard"}
          </button>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "18px 14px 40px" }}>
          {/* Search and Filter */}
          <div style={{ marginBottom: 16 }}>
            <input type="text" placeholder="Ara... (Yunanca, Türkçe veya okunuş)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, marginBottom: 10 }} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => setSelectedCategory("all")} style={{ padding: "6px 12px", borderRadius: 20, border: "none", background: selectedCategory === "all" ? "#FFD54F" : "rgba(255,255,255,0.1)", color: selectedCategory === "all" ? "#333" : "#fff", fontSize: 12, cursor: "pointer" }}>Tümü</button>
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: "6px 12px", borderRadius: 20, border: "none", background: selectedCategory === cat ? "#FFD54F" : "rgba(255,255,255,0.1)", color: selectedCategory === cat ? "#333" : "#fff", fontSize: 12, cursor: "pointer" }}>
                  {CATEGORIES[cat] || cat}
                </button>
              ))}
            </div>
          </div>

          {flashcardMode && filteredVocabulary.length > 0 ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 16 }}>{currentCard + 1} / {filteredVocabulary.length}</div>
              <div onClick={() => setShowAnswer(!showAnswer)} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "40px 30px", minHeight: 200, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", cursor: "pointer", border: "2px solid rgba(255,255,255,0.1)", transition: "all 0.3s" }}>
                <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>{currentVocab.gr}</div>
                <div style={{ fontSize: 14, opacity: 0.5, fontStyle: "italic", marginBottom: 20 }}>{currentVocab.pron}</div>
                {showAnswer ? (
                  <div style={{ fontSize: 20, color: "#FFD54F", fontWeight: 600 }}>🇹🇷 {currentVocab.tr}</div>
                ) : (
                  <div style={{ fontSize: 14, opacity: 0.3 }}>Cevabı görmek için tıkla</div>
                )}
              </div>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 20 }}>
                <button onClick={prevCard} style={{ padding: "12px 24px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, color: "#fff", fontSize: 16, cursor: "pointer" }}>← Önceki</button>
                <button onClick={nextCard} style={{ padding: "12px 24px", background: "#FFD54F", border: "none", borderRadius: 8, color: "#333", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Sonraki →</button>
              </div>
            </div>
          ) : (
            <div>
              {filteredVocabulary.map((v, i) => (
                <div key={i} onClick={() => toggleTr(`dict${i}`)} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "11px 12px", background: i % 2 === 0 ? "rgba(255,255,255,0.04)" : "transparent", borderRadius: 8, cursor: "pointer", borderLeft: "3px solid #FFD54F", marginBottom: 2 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{v.gr}</div>
                    <div style={{ fontSize: 11, opacity: 0.45, fontStyle: "italic" }}>{v.pron}</div>
                    <div style={{ fontSize: 10, opacity: 0.3, marginTop: 2 }}>{v.weekId}. Hafta</div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 13, color: showTr[`dict${i}`] ? "#FFD54F" : "rgba(255,255,255,0.25)", alignSelf: "center" }}>
                    {showTr[`dict${i}`] ? v.tr : "tıkla →"}
                  </div>
                </div>
              ))}
              {filteredVocabulary.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, opacity: 0.5 }}>Sonuç bulunamadı</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // WEEK VIEW
  const tabs = [
    { key: "vocab", label: "📝 Kelimeler" },
    { key: "dialogue", label: "💬 Diyaloglar" },
    { key: "reading", label: "📖 Okuma" },
    { key: "grammar", label: "📐 Gramer" },
  ];
  if (week?.numbers) tabs.splice(1, 0, { key: "numbers", label: "🔢 Sayılar" });

  return (
    <div style={{ fontFamily: "'Crimson Pro', 'Georgia', serif", background: "#081e36", minHeight: "100vh", color: "#e0dbd2" }}>
      <div style={{ background: `linear-gradient(135deg, ${week.color}, ${week.color}cc)`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
        <button onClick={() => setView("home")} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Geri</button>
        <span style={{ fontSize: 22 }}>{week.icon}</span>
        <div>
          <div style={{ fontSize: 10, opacity: 0.65, textTransform: "uppercase", letterSpacing: 1 }}>{week.id}. Hafta</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{week.title}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 2, padding: "10px 14px 0", overflowX: "auto", background: "#0b2341" }}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: "9px 12px", border: "none", borderRadius: "8px 8px 0 0", cursor: "pointer", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
            background: activeTab === t.key ? "#112d50" : "transparent", color: activeTab === t.key ? "#fff" : "rgba(255,255,255,0.45)",
            borderBottom: activeTab === t.key ? `2px solid ${week.color}` : "2px solid transparent",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "18px 14px 40px" }}>
        {activeTab === "vocab" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>Kelime Listesi ({week.vocabulary.length})</h3>
              <label style={{ fontSize: 11, opacity: 0.6, display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                <input type="checkbox" checked={showPron} onChange={(e) => setShowPron(e.target.checked)} /> Okunuş
              </label>
            </div>
            {week.vocabulary.map((v, i) => (
              <div key={i} onClick={() => toggleTr(`v${i}`)} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "11px 12px", background: i % 2 === 0 ? "rgba(255,255,255,0.04)" : "transparent", borderRadius: 8, cursor: "pointer", borderLeft: `3px solid ${week.color}`, marginBottom: 2 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{v.gr}</div>
                  {showPron && <div style={{ fontSize: 11, opacity: 0.45, fontStyle: "italic" }}>{v.pron}</div>}
                </div>
                <div style={{ textAlign: "right", fontSize: 13, color: showTr[`v${i}`] ? "#FFD54F" : "rgba(255,255,255,0.25)", alignSelf: "center" }}>
                  {showTr[`v${i}`] ? v.tr : "tıkla →"}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "numbers" && week.numbers && (
          <div>
            <h3 style={{ margin: "0 0 14px", fontSize: 15 }}>Sayılar</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
              {week.numbers.map((n, i) => (
                <div key={i} onClick={() => toggleTr(`n${i}`)} style={{ padding: "12px", background: "rgba(255,255,255,0.04)", borderRadius: 10, textAlign: "center", cursor: "pointer", border: `1px solid ${showTr[`n${i}`] ? week.color : "rgba(255,255,255,0.06)"}`, transition: "all 0.2s" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: week.color }}>{n.tr}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>{n.gr}</div>
                  {showPron && <div style={{ fontSize: 11, opacity: 0.45, fontStyle: "italic" }}>{n.pron}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "dialogue" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {week.dialogues.map((d, di) => (
              <div key={di} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ background: `linear-gradient(135deg, ${week.color}, ${week.color}bb)`, padding: "12px 14px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{d.title}</div>
                  <div style={{ fontSize: 11, opacity: 0.8, color: "#fff", marginTop: 2 }}>📍 {d.setting}</div>
                </div>
                <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {d.lines.map((l, li) => {
                    const isYou = l.speaker === "Siz";
                    return (
                      <div key={li} onClick={() => toggleTr(`d${di}l${li}`)} style={{ padding: "9px 11px", borderRadius: 8, cursor: "pointer", background: isYou ? "rgba(13,94,175,0.15)" : "rgba(255,255,255,0.03)", borderLeft: `3px solid ${isYou ? "#0D5EAF" : "rgba(255,255,255,0.12)"}` }}>
                        <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.5, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{l.speaker}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5 }}>{l.gr}</div>
                        {showPron && <div style={{ fontSize: 11, opacity: 0.4, fontStyle: "italic", marginTop: 1 }}>{l.pron}</div>}
                        {showTr[`d${di}l${li}`] && <div style={{ fontSize: 12, color: "#FFD54F", marginTop: 4, paddingTop: 4, borderTop: "1px solid rgba(255,255,255,0.08)" }}>🇹🇷 {l.tr}</div>}
                      </div>
                    );
                  })}
                </div>
                <div style={{ padding: "6px 12px 10px", textAlign: "center", fontSize: 10, opacity: 0.35 }}>
                  Çeviri için satırlara tıklayın
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reading" && (
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ background: `linear-gradient(135deg, ${week.color}, ${week.color}99)`, padding: "16px 18px" }}>
              <div style={{ fontSize: 10, opacity: 0.7, color: "#fff", textTransform: "uppercase", letterSpacing: 1 }}>Okuma Parçası — {week.reading.level}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginTop: 3 }}>{week.reading.title}</div>
              <div style={{ fontSize: 13, opacity: 0.8, color: "#fff" }}>{week.reading.titleTr}</div>
            </div>
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
              {week.reading.paragraphs.map((p, pi) => (
                <div key={pi} onClick={() => toggleTr(`r${pi}`)} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, cursor: "pointer", borderLeft: `3px solid ${week.color}`, transition: "all 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
                  <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.7 }}>{p.gr}</div>
                  {showPron && <div style={{ fontSize: 12, opacity: 0.4, fontStyle: "italic", lineHeight: 1.6, marginTop: 4 }}>{p.pron}</div>}
                  {showTr[`r${pi}`] && (
                    <div style={{ fontSize: 13, color: "#FFD54F", marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.08)", lineHeight: 1.6 }}>🇹🇷 {p.tr}</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ padding: "6px 16px 12px", textAlign: "center", fontSize: 10, opacity: 0.35 }}>
              Çeviri için paragraflara tıklayın
            </div>
          </div>
        )}

        {activeTab === "grammar" && (
          <div>
            <h3 style={{ margin: "0 0 14px", fontSize: 15 }}>📐 Gramer Notları</h3>
            {week.grammar.map((g, i) => (
              <div key={i} style={{ padding: "12px 14px", background: i % 2 === 0 ? "rgba(255,255,255,0.04)" : "transparent", borderRadius: 8, fontSize: 13, lineHeight: 1.7, borderLeft: `3px solid ${week.color}`, marginBottom: 4 }}>
                {g}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
