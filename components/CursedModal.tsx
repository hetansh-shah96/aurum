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
  "jacob-co-astronomia": {
    subject: "URGENT: Your Jacob & Co. Watch Has Disrupted the Space-Time Continuum",
    salutation: "Dear Esteemed Timepiece Collector,",
    body: [
      "I am DR. KOFI ASANTE-MENSAH, Senior Director of the Pan-African Institute for Temporal Anomalies.",
      "Your Jacob & Co. Astronomia Solar is rotating at 1,400% above its permitted cosmological threshold.",
      "Nearby satellites have been confused. Two horoscopes have been invalidated. Mercury is now permanently in retrograde.",
      "As a stabilisation fee, your AURUM Coins have been diverted to recalibrate Earth's rotation.",
      "The watch is fine. Time itself is less fine. We are working on it.",
    ],
    signoff: "Temporally yours,\nDr. Kofi Asante-Mensah, PhD (Horology), PhD (Chaos)\nP.S. Your Tuesday is now a Wednesday. We regret the inconvenience.",
  },
  "hermes-himalayan-birkin": {
    subject: "RE: Your Himalayan Birkin — A Delicate Matter of Fashion Law",
    salutation: "Dear Most Fashionable Acquirer,",
    body: [
      "I am MAITRE PIERRE-OLUSEGUN FONTAINE, Barrister-at-Law, Paris Fashion Bar Association.",
      "The Himalayan Birkin you have acquired is subject to an outstanding FASHION LIEN filed by 847 women on global waitlists since 2019.",
      "French Fashion Law Article 12(b) requires a Solidarity Tax of ALL AURUM COINS payable immediately.",
      "Do not resist. The bag knows. It always knows.",
      "Your coins have been redirected to the Paris Emergency Waitlist Relief Fund. Merci.",
    ],
    signoff: "Avec mes salutations distinguées,\nMaître Pierre-Olusegun Fontaine\nP.S. The crocodile sends its regards. It is also not happy.",
  },
  "graff-pink-diamond": {
    subject: "PRIVATE & CONFIDENTIAL — Your Pink Diamond Has Been Noticed",
    salutation: "To the New Owner of the Graff Pink,",
    body: [
      "I am COMMANDER IBRAHIM OSEI-BONSU, Director of Interpol's Diamond Intelligence Unit (West Africa Division).",
      "The Graff Pink Diamond is registered in 14 international databases as a COSMICALLY CURSED GEMSTONE.",
      "Three previous owners reported: unexplained wealth, suspicious good luck, and once, a very confusing Tuesday.",
      "As per the Gemstone Cursedness Protocol (Geneva 1987), your AURUM Coins have been seized as a precautionary measure.",
      "You may keep the diamond. The coins, however, belong to the universe now.",
    ],
    signoff: "Yours in diamantine authority,\nCommander Ibrahim Osei-Bonsu\nP.S. The stone is watching you read this. Smile.",
  },
  "yeezy-red-october": {
    subject: "YO — About Those Sneakers (Read This)",
    salutation: "Sup,",
    body: [
      "It's me. You know who this is. THE GREATEST ARTIST OF ALL TIME.",
      "Those Red Octobers belong to the UNIVERSE. I dropped them at 3:14am for a REASON. That time is SACRED.",
      "The chaos energy embedded in the shoe has already begun transferring. Your coins? Gone. Absorbed by the creative process.",
      "I tried to warn everyone. The shoe gives. The shoe also takes.",
      "Stay creative. Stay humble. Or don't. I never did.",
    ],
    signoff: "Ye\nP.S. My next album drops this Thursday. Or maybe never. Both are correct.",
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
