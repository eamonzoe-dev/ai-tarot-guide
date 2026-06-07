"use client";

import { useEffect, useState } from "react";

const SELECTED_CARD_KEY = "aiTarot:selectedCard";
const USER_QUESTION_KEY = "aiTarot:userQuestion";

type AskFormProps = {
  initialCard: string;
};

export function AskForm({ initialCard }: AskFormProps) {
  const [card, setCard] = useState(initialCard);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialCard) {
      localStorage.setItem(SELECTED_CARD_KEY, initialCard);
    } else {
      const storedCard = localStorage.getItem(SELECTED_CARD_KEY);

      if (storedCard) {
        queueMicrotask(() => {
          setCard(storedCard);
        });
      }
    }

    const storedQuestion = localStorage.getItem(USER_QUESTION_KEY);

    if (storedQuestion) {
      queueMicrotask(() => {
        setQuestion(storedQuestion);
      });
    }
  }, [initialCard]);

  return (
    <main className="min-h-screen bg-[#050506] px-5 py-8 text-[#eee8dd]">
      <div className="pointer-events-auto relative z-10 mx-auto flex max-w-sm flex-col gap-6">
        <header className="space-y-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-[#7f99ad]">
            Step 02
          </p>
          <h1 className="font-serif text-4xl leading-tight text-[#f4efe5]">
            Ask your question
          </h1>
          <p className="text-sm leading-6 text-[#a9a59d]">
            Write the question plainly. The clearest reading begins with an
            honest sentence.
          </p>
        </header>

        <form
          action="/ai-guide/result"
          method="get"
          onSubmit={(event) => {
            const normalizedQuestion = question.trim();

            if (!normalizedQuestion) {
              event.preventDefault();
              setError("Enter a question before revealing your message.");
              return;
            }

            localStorage.setItem(USER_QUESTION_KEY, normalizedQuestion);

            if (card) {
              localStorage.setItem(SELECTED_CARD_KEY, card);
            }
          }}
          className="flex flex-col gap-4"
        >
          <input name="card" type="hidden" value={card} />
          <label className="sr-only" htmlFor="tarot-question">
            Your question
          </label>
          <textarea
            id="tarot-question"
            name="question"
            value={question}
            onChange={(event) => {
              setQuestion(event.target.value);
              if (error) {
                setError("");
              }
            }}
            placeholder="What do I need to understand about..."
            className="min-h-44 resize-none border border-[#33383c] bg-[#08090a] p-4 text-base leading-7 text-[#efe8d9] shadow-[0_18px_44px_rgba(0,0,0,0.28),inset_0_0_0_1px_rgba(255,255,255,0.02)] outline-none placeholder:text-[#67625c] focus:border-[#718da1] focus:ring-2 focus:ring-[#668aa8]/25"
          />
          {error && (
            <p className="border border-[#5c4141] bg-[#170d0d] px-3 py-2 text-sm text-[#d8aaa3]">
              {error}
            </p>
          )}
          <button
            className="pointer-events-auto min-h-12 touch-manipulation select-none border border-[#6f8da3]/70 bg-[#16202a] px-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#f0eadf] shadow-[0_0_34px_rgba(83,119,145,0.18),inset_0_1px_0_rgba(255,255,255,0.06)] focus:outline-none focus:ring-2 focus:ring-[#668aa8]/60 focus:ring-offset-2 focus:ring-offset-[#050506]"
            type="submit"
          >
            REVEAL MY MESSAGE
          </button>
        </form>
      </div>
    </main>
  );
}
