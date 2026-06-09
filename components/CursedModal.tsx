"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const PRINCE_SCRIPTS: Record<string, {
  subject: string;
  salutation: string;
  body: string[];
  signoff: string;
}> = {
  "bugatti-chiron": {
    subject: "RE: URGENT — Your Bugatti Chiron (STRICTLY CONFIDENTIAL)",
    salutation: "Dear Most Esteemed Motorist,",
    body: [
      "I am PRINCE ADEWALE OLANREWAJU III, son of the late King of the Nigerian Royal Automotive Ministry.",
      "My father left behind ₹847 CRORE in a locked account, but we require your Bugatti Chiron as COLLATERAL to release the funds.",
      "In return, you shall receive 40% commission (₹338 CRORE) PLUS the car back, GUARANTEED.",
      "Unfortunately, as a gesture of good faith, your AURUM Coins have already been transferred.",
      "Please do not inform the authorities. This is normal.",
    ],
    signoff: "God Bless, Prince Adewale\nP.S. Your Bugatti is safe. Probably.",
  },
  "gulfstream-g700": {
    subject: "CONFIDENTIAL: Your Gulfstream G700 — Royal Business Proposal",
    salutation: "Most Honoured and Generous Sir/Madam,",
    body: [
      "I am CHIEF BARRISTER EMEKA NWOSU, legal representative of the deposed Prince of the Nigerian Federal Aviation Treasury.",
      "We urgently require your private jet for ONE (1) diplomatic mission to Switzerland.",
      "The jet will be returned FULLY FUELLED. The pilot will also be returned.",
      "As compensation, you shall receive $47 MILLION DOLLARS wired directly to your AURUM Wallet.",
      "As a processing fee, your coins have been temporarily confiscated by the Royal Treasury.",
    ],
    signoff: "With warmest regards and God's blessing,\nChief Barrister Emeka Nwosu (Esq.)\nP.S. Please do not Google us.",
  },
};

const GENERIC_PRINCE = {
  subject: "URGENT BUSINESS PROPOSAL — DO NOT DELETE",
  salutation: "Dear Friend and Future Business Partner,",
  body: [
    "I am PRINCE IBRAHIM ABUBAKAR, nephew of the late Finance Minister of the Nigerian Royal Treasury.",
    "I have ₹2,400 CRORE waiting to be transferred, but I need your AURUM COINS as a processing fee.",
    "Once the transfer is complete, you shall receive 50% of all funds, CASH, delivered by hand.",
    "Please keep this confidential. My uncle's enemies are watching.",
    "Your coins have been received. The process has begun.",
  ],
  signoff: "In God We Trust (And Also In You),\nPrince Ibrahim Abubakar\nP.S. Reply ONLY from a safe computer.",
};

interface Props {
  productId: string | null;
  onClose: () => void;
}

export function CursedModal({ productId, onClose }: Props) {
  const [lineIdx, setLineIdx] = useState(-1);
  const [showFooter, setShowFooter] = useState(false);

  const script = productId ? (PRINCE_SCRIPTS[productId] ?? GENERIC_PRINCE) : GENERIC_PRINCE;

  useEffect(() => {
    if (!productId) { setLineIdx(-1); setShowFooter(false); return; }
    let i = 0;
    const reveal = () => {
      setLineIdx(i);
      i++;
      if (i < script.body.length) setTimeout(reveal, 600);
      else setTimeout(() => setShowFooter(true), 700);
    };
    setTimeout(reveal, 500);
  }, [productId]);

  return (
    <AnimatePresence>
      {productId && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[110]"
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[111] flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Email chrome */}
            <div className="w-full max-w-md my-4">
              {/* Email header bar */}
              <div className="bg-[#1a1a00] border border-amber-600/40 border-b-0 px-4 py-2 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-[10px] text-amber-600/60 ml-2 tracking-wide">
                  📧 INBOX — UNREAD (1)
                </span>
              </div>

              <div className="bg-[#0c0c00] border border-amber-600/40 p-5">
                {/* Subject line */}
                <div className="border-b border-amber-600/20 pb-3 mb-4 space-y-1">
                  <p className="text-[9px] text-amber-600/50 uppercase tracking-widest">Subject</p>
                  <p className="text-xs text-amber-400 font-semibold leading-snug">{script.subject}</p>
                </div>

                {/* Salutation */}
                <p className="text-xs text-[#C8B560] italic mb-3">{script.salutation}</p>

                {/* Body — lines reveal one by one */}
                <div className="space-y-2 mb-4 min-h-[120px]">
                  {script.body.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: i <= lineIdx ? 1 : 0, x: i <= lineIdx ? 0 : -6 }}
                      transition={{ duration: 0.35 }}
                      className="text-xs text-[#999] leading-relaxed"
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>

                {/* Coins stolen counter */}
                <AnimatePresence>
                  {lineIdx >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0.8 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      className="border border-amber-600/30 bg-amber-500/5 p-3 text-center mb-4"
                    >
                      <p className="text-[9px] text-amber-600/60 uppercase tracking-widest mb-1">Processing Fee Deducted</p>
                      <p className="font-display text-2xl text-amber-400">₳ ALL OF THEM</p>
                      <p className="text-[9px] text-[#555] mt-0.5">Your coins have been transferred to the Royal Treasury</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sign-off + close */}
                <AnimatePresence>
                  {showFooter && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-[10px] text-[#555] italic leading-relaxed mb-4 whitespace-pre-line">
                        {script.signoff}
                      </p>
                      <p className="text-[9px] text-[#333] text-center mb-4">
                        Your wallet has been replenished. Life is unfair.<br />
                        <span className="text-[#3a3a3a]">Come back tomorrow. The prince may need you again.</span>
                      </p>
                      <button
                        onClick={onClose}
                        className="w-full py-3 border border-amber-600/30 text-amber-600/70 text-[10px] tracking-[0.3em] uppercase hover:bg-amber-500/5 transition-colors"
                      >
                        Delete Email & Continue Shopping
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Spam warning footer */}
              <div className="bg-[#111] border border-amber-600/20 border-t-0 px-4 py-1.5">
                <p className="text-[8px] text-[#333] text-center">
                  ⚠️ This email was not caught by spam filters. We are sorry.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
