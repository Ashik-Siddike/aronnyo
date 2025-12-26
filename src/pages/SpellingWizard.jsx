import React, { useCallback, useEffect, useMemo, useState } from "react";

const NUMBER_TO_WORDS = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
  11: "eleven",
  12: "twelve",
  13: "thirteen",
  14: "fourteen",
  15: "fifteen",
  16: "sixteen",
  17: "seventeen",
  18: "eighteen",
  19: "nineteen",
  20: "twenty",
  21: "twenty one",
  22: "twenty two",
  23: "twenty three",
  24: "twenty four",
  25: "twenty five",
  26: "twenty six",
  27: "twenty seven",
  28: "twenty eight",
  29: "twenty nine",
  30: "thirty",
  31: "thirty one",
  32: "thirty two",
  33: "thirty three",
  34: "thirty four",
  35: "thirty five",
  36: "thirty six",
  37: "thirty seven",
  38: "thirty eight",
  39: "thirty nine",
  40: "forty",
  41: "forty one",
  42: "forty two",
  43: "forty three",
  44: "forty four",
  45: "forty five",
  46: "forty six",
  47: "forty seven",
  48: "forty eight",
  49: "forty nine",
  50: "fifty"
};

const TOTAL_NUMBERS = 50;
const BLOCK_SIZE = 5;

const normalize = (word = "") => word.replace(/\s+/g, " ").trim().toLowerCase();

const createInitialResults = () =>
  Array.from({ length: TOTAL_NUMBERS }, (_, index) => ({
    number: index + 1,
    input: "",
    correct: false,
    attempted: false,
    message: "",
    liveHint: ""
  }));

const buildBlock = (blockIndex) => {
  const start = blockIndex * BLOCK_SIZE + 1;
  return Array.from({ length: BLOCK_SIZE }, (_, idx) => start + idx).filter(
    (value) => value <= TOTAL_NUMBERS
  );
};

const MAX_BLOCK_INDEX = Math.ceil(TOTAL_NUMBERS / BLOCK_SIZE) - 1;

const SpellingWizard = () => {
  const [blockIndex, setBlockIndex] = useState(0);
  const [currentBlock, setCurrentBlock] = useState(() => buildBlock(0));
  const [results, setResults] = useState(createInitialResults);

  useEffect(() => {
    setCurrentBlock(buildBlock(blockIndex));
  }, [blockIndex]);

  const stats = useMemo(() => {
    const completed = results.filter((item) => item.correct).length;
    return {
      completed,
      remaining: TOTAL_NUMBERS - completed
    };
  }, [results]);

  const updateResult = useCallback((number, updates) => {
    setResults((prev) =>
      prev.map((item) =>
        item.number === number
          ? {
              ...item,
              ...updates
            }
          : item
      )
    );
  }, []);

  const handleInputChange = useCallback(
    (value, number) => {
      const sanitized = value.replace(/[^a-zA-Z\s-]/g, "");
      const expected = NUMBER_TO_WORDS[number];
      const normalizedExpected = normalize(expected);
      const normalizedInput = normalize(sanitized);

      let liveHint = "";
      if (sanitized) {
        if (normalizedExpected.startsWith(normalizedInput)) {
          if (normalizedInput === normalizedExpected) {
            liveHint = "বাহ! সম্পূর্ণ বানান লিখে ফেলেছো। এখন সাবমিট করো।";
          } else {
            const nextPart = normalizedExpected.slice(normalizedInput.length, normalizedInput.length + 1);
            liveHint = nextPart
              ? `দারুণ! এবার '${nextPart.toUpperCase()}' অক্ষরটি লিখো।`
              : "একটু দেখে নাও বানানের ফাঁকা জায়গাগুলো ঠিক আছে কি না।";
          }
        } else {
          const expectedPieces = normalizedExpected.split(" ");
          const typedPieces = normalizedInput.split(" ");
          const currentPieceIndex = typedPieces.length - 1;
          const correctPiece = expectedPieces[currentPieceIndex] || "";
          liveHint = correctPiece
            ? `ওহ! এই অংশটি '${correctPiece.toUpperCase()}' হবে। আরেকবার চেষ্টা করো।`
            : "বানানটি একটু গুছিয়ে লিখে দেখো।";
        }
      }

      updateResult(number, {
        input: sanitized,
        correct: false,
        attempted: false,
        message: "",
        liveHint
      });
    },
    [updateResult]
  );

  const handleFinalizeAnswer = useCallback(
    (number) => {
      const entry = results.find((item) => item.number === number);
      if (!entry) return;

      const expected = NUMBER_TO_WORDS[number];
      const isCorrect = normalize(entry.input) === normalize(expected);

      updateResult(number, {
        correct: isCorrect,
        attempted: true,
        message: isCorrect
          ? "দারুণ! তুমি ঠিক বানান লিখেছো।"
          : "আহা! বানানটা একটু পালটাও, আরেকবার চেষ্টা করো।",
        liveHint: isCorrect ? "" : "হিন্ট: শব্দটিকে ধীরে ধীরে উচ্চারণ করে লিখে দেখো।"
      });
    },
    [results, updateResult]
  );

  const renderColoredText = (inputValue, correctWord) => {
    if (!inputValue) {
      return <span className="text-slate-300">টাইপ করা শুরু করো...</span>;
    }

    const normalizedCorrect = normalize(correctWord);

    return inputValue.split("").map((char, index) => {
      const expectedChar = normalizedCorrect[index];
      const isMatch = expectedChar && char.toLowerCase() === expectedChar;
      const displayChar = char === " " ? "\u00A0" : char;

      return (
        <span
          key={`${char}-${index}`}
          className={isMatch ? "text-emerald-500" : "text-rose-500"}
        >
          {displayChar}
        </span>
      );
    });
  };

  const handleKeyDown = (event, number) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleFinalizeAnswer(number);
    }
  };

  const handleBlur = (number) => {
    const entry = results.find((item) => item.number === number);
    if (entry && entry.input.trim()) {
      handleFinalizeAnswer(number);
    }
  };

  const goToPrevBlock = () => {
    setBlockIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNextBlock = () => {
    setBlockIndex((prev) => Math.min(prev + 1, MAX_BLOCK_INDEX));
  };

  const jumpToBlock = (index) => {
    setBlockIndex(() => Math.min(Math.max(index, 0), MAX_BLOCK_INDEX));
  };

  const allBlocks = useMemo(
    () =>
      Array.from({ length: MAX_BLOCK_INDEX + 1 }, (_, idx) => buildBlock(idx)),
    []
  );

  const handleSubmitClick = (number) => {
    handleFinalizeAnswer(number);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl border-4 border-white shadow-2xl p-8 space-y-10">
        <header className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-purple-500 font-semibold">
            স্পেলিং উইজার্ড 🪄
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700">
            সংখ্যা লিখো, বানান মিলাও!
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            ১ থেকে ৫০ পর্যন্ত সংখ্যার ইংরেজি বানান লিখতে শিখো। প্রতিটি অক্ষর রঙ বদলে দেখাবে তুমি ঠিক লিখছো কি না!
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="col-span-2 bg-gradient-to-r from-purple-200/70 to-blue-200/70 rounded-3xl p-6 border border-white">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-purple-700">বর্তমান ব্লক</h2>
                <p className="text-sm text-purple-600">
                  {currentBlock[0]} – {currentBlock[currentBlock.length - 1]}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={goToPrevBlock}
                  className="px-4 py-2 rounded-full bg-white text-purple-600 font-semibold shadow-md hover:shadow-lg transition disabled:opacity-40"
                  disabled={blockIndex === 0}
                >
                  ⬅️ পিছনে
                </button>
                <button
                  onClick={goToNextBlock}
                  className="px-4 py-2 rounded-full bg-white text-purple-600 font-semibold shadow-md hover:shadow-lg transition disabled:opacity-40"
                  disabled={(blockIndex + 1) * BLOCK_SIZE >= TOTAL_NUMBERS}
                >
                  সামনে ➡️
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2">
              {allBlocks.map((block, idx) => (
                <button
                  key={block[0]}
                  onClick={() => jumpToBlock(idx)}
                  className={`rounded-2xl px-3 py-2 text-sm font-semibold transition shadow-md ${
                    idx === blockIndex
                      ? "bg-purple-500 text-white"
                      : "bg-white/80 text-purple-600 hover:bg-purple-100"
                  }`}
                >
                  {block[0]}-{block[block.length - 1]}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-200/70 to-teal-200/70 rounded-3xl p-6 border border-white text-center">
            <p className="text-2xl font-bold text-emerald-700">অগ্রগতি</p>
            <p className="text-5xl font-extrabold text-emerald-600 mt-3">
              {stats.completed}/50
            </p>
            <p className="text-sm font-medium text-emerald-700">
              আরও {stats.remaining} সংখ্যার বানান বাকি!
            </p>
          </div>
        </section>

        <section className="bg-white/80 rounded-3xl border border-white/80 shadow-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentBlock.map((number) => {
              const entry = results.find((item) => item.number === number);
              const expectedWord = NUMBER_TO_WORDS[number];

              return (
                <div
                  key={number}
                  className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-3xl border-2 border-white/70 shadow-lg p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white font-black text-2xl shadow-inner">
                        {number}
                      </span>
                      <div>
                        <p className="text-sm uppercase tracking-wide text-purple-500 font-semibold">
                          নম্বরের বানান
                        </p>
                        <p className="text-lg font-bold text-slate-700">{expectedWord.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-600">
                      বানান টাইপ করো
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 pointer-events-none flex items-center px-4 py-3 text-lg font-semibold tracking-wide">
                        {renderColoredText(entry?.input ?? "", expectedWord)}
                      </div>
                      <input
                        type="text"
                        value={entry?.input ?? ""}
                        onChange={(event) => handleInputChange(event.target.value, number)}
                        onKeyDown={(event) => handleKeyDown(event, number)}
                        onBlur={() => handleBlur(number)}
                        className="w-full rounded-2xl border-2 border-purple-200 bg-white/70 px-4 py-3 text-lg font-semibold text-transparent shadow-inner focus:border-purple-400 focus:ring-4 focus:ring-purple-200 transition"
                        style={{ caretColor: "#1f2937" }}
                        placeholder=""
                        spellCheck={false}
                      />
                    </div>
                  </div>

                  {entry?.liveHint && !entry?.attempted && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm text-amber-700 font-semibold shadow-inner">
                      {entry.liveHint}
                    </div>
                  )}

                  {entry?.attempted && (
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {entry.correct ? "🥳" : "😅"}
                      </span>
                      <div>
                        <p className={`text-sm font-semibold ${entry.correct ? "text-emerald-600" : "text-rose-500"}`}>
                          {entry.message}
                        </p>
                        {!entry.correct && (
                          <p className="text-xs text-slate-500">
                            হিন্ট: বানানে ফাঁকা জায়গা ঠিক আছে কি না দেখে নাও।
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSubmitClick(number)}
                      className="mt-2 inline-flex items-center gap-2 rounded-full bg-purple-500 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-purple-600 transition"
                    >
                      ✅ সাবমিট
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-3xl p-6 border border-white shadow-lg text-center space-y-4">
          <p className="text-xl font-bold text-purple-700">
            প্রতিটি সঠিক বানানে তুমি আরও এক ধাপ উইজার্ড হওয়ার পথে! ✨
          </p>
          <p className="text-sm text-purple-700">
            Enter চাপলে বা ইনপুটের বাইরে ক্লিক করলেই উত্তর চেক হবে।
          </p>
          <button
            onClick={goToNextBlock}
            disabled={blockIndex === MAX_BLOCK_INDEX}
            className="mx-auto inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-lg font-bold text-white shadow-xl hover:shadow-2xl transition disabled:opacity-40"
          >
            পরের চ্যালেঞ্জ আনো ➡️
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SpellingWizard;

