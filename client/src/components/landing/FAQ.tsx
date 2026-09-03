

        import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is Codexa?",
    a: "Codexa is an AI-powered software engineering workspace that helps you generate, debug, review and manage code in one place.",
  },
  {
    q: "Which AI models are supported?",
    a: "Codexa is designed to support providers like OpenAI, Anthropic, Gemini and Groq.",
  },
  {
    q: "Can I use my own API keys?",
    a: "Yes. You'll be able to connect your own providers securely.",
  },
  {
    q: "Is Codexa open source?",
    a: "Core parts of the project will be available publicly while advanced features may be optional.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-32">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-12 text-center text-5xl font-bold">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <button
                onClick={() => setOpen(open === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="font-semibold">{faq.q}</span>

                <ChevronDown
                  className={`transition ${
                    open === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open === index && (
                <div className="px-6 pb-6 text-zinc-400">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}