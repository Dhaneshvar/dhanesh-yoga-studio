import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import suryaPose from "@/assets/concept/yoga-practitioner-surya-v2.webp";
import forwardFoldPose from "@/assets/concept/yoga-practitioner-forward-fold-clean.webp";
import cobraPose from "@/assets/concept/yoga-practitioner-cobra-clean.webp";
import womanSideStretch from "@/assets/concept/yoga-woman-side-stretch-v2.webp";
import womanTreePose from "@/assets/concept/yoga-woman-tree-pose-v2.webp";
import womanSeatedStretch from "@/assets/concept/yoga-woman-seated-stretch-v2.webp";
import duoHoldingMat from "@/assets/concept/yoga-duo-holding-mat.webp";
import manWithMatBackpack from "@/assets/concept/yoga-man-mat-backpack.webp";
import womanWithMatBag from "@/assets/concept/yoga-woman-mat-bag.webp";
import roomProps from "@/assets/concept/yoga-room-props.webp";
import studioLogo from "@/assets/logo.webp";

const easeOut = [0.16, 1, 0.3, 1] as const;
const poses = [
  { src: suryaPose, label: "Urdhva Hastasana · arms raised", guide: true },
  { src: forwardFoldPose, label: "Uttanasana · forward fold", guide: true },
  { src: cobraPose, label: "Bhujangasana · cobra", guide: true },
  { src: suryaPose, label: "Urdhva Hastasana · return", guide: true },
  { src: womanSideStretch, label: "Parsva Tadasana · side stretch", guide: false },
  { src: womanTreePose, label: "Vrksasana · tree pose", guide: false },
  { src: womanSeatedStretch, label: "Paschimottanasana · seated stretch", guide: false },
  { src: duoHoldingMat, label: "Roll the mat together · studio welcome", guide: false },
];

const journeyCopy = [
  { eyebrow: "Arrive as you are", title: "Return to your calm.", body: "Settle into a practice that begins with one quiet breath." },
  { eyebrow: "Breathe with intention", title: "Move with strength.", body: "Let every movement follow the rhythm of your breath." },
  { eyebrow: "Open and renew", title: "Breathe with purpose.", body: "Create space through a gentle, unhurried flow." },
  { eyebrow: "Rise again", title: "Strengthen your body.", body: "Build steadiness one mindful movement at a time." },
  { eyebrow: "Make room", title: "Reconnect with yourself.", body: "Lengthen softly and return to what your body needs." },
  { eyebrow: "Steady and present", title: "Find balance in every breath.", body: "Root down, grow tall, and let the mind become clear." },
  { eyebrow: "Evening release", title: "Release stress. Restore your energy.", body: "Slow down into a restorative moment made for you." },
  { eyebrow: "Practice together", title: "Your journey begins with one breath.", body: "A welcoming studio, ready whenever you are." },
];

const YogaMatConcept = () => {
  const reducedMotion = useReducedMotion();
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const constrainedNetwork = Boolean(connection?.saveData || connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g");
  const showFinalFrame = Boolean(reducedMotion || constrainedNetwork);
  const [poseIndex, setPoseIndex] = useState(showFinalFrame ? 7 : 0);
  const [sequenceComplete, setSequenceComplete] = useState(showFinalFrame);
  const [matDelivered, setMatDelivered] = useState(showFinalFrame);
  const [exitScene, setExitScene] = useState(showFinalFrame);
  const [orbit, setOrbit] = useState({ x: 0, y: 0 });
  const journeyRef = useRef<HTMLElement>(null);
  const dragRef = useRef({ active: false, x: 0, y: 0, orbitX: 0, orbitY: 0 });
  const { scrollYProgress } = useScroll({ target: journeyRef, offset: ["start start", "end end"] });
  const sceneLift = useTransform(scrollYProgress, [0, 1], [0, -18]);
  const matScaleY = useTransform(scrollYProgress, [0, 0.07, 0.68, 0.81], [0.025, 1, 1, 0.07]);
  const matOpacity = useTransform(scrollYProgress, [0, 0.06, 0.72, 0.83], [1, 1, 1, 0]);
  const matRollY = useTransform(scrollYProgress, [0, 0.06, 0.68], [0, 0, 8]);

  const duration = (value: number) => (showFinalFrame ? 0 : value);
  const delay = (value: number) => (showFinalFrame ? 0 : value);

  useEffect(() => {
    if (!showFinalFrame) return;
    setPoseIndex(7);
    setSequenceComplete(true);
    setMatDelivered(true);
    setExitScene(true);
    setOrbit({ x: 0, y: 0 });
  }, [showFinalFrame]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (showFinalFrame) return;

    const nextPose = Math.min(7, Math.floor(progress * 8.2));
    setPoseIndex((current) => current === nextPose ? current : nextPose);
    setSequenceComplete(progress >= 0.72);
    setMatDelivered(progress >= 0.84);
    setExitScene(progress >= 0.87);

    if (progress < 0.87) {
      setOrbit((current) => current.x === 0 && current.y === 0 ? current : { x: 0, y: 0 });
    }
  });

  useEffect(() => {
    if (showFinalFrame) return;
    const nextSources = [poses[Math.min(poseIndex + 1, poses.length - 1)]?.src];
    if (poseIndex >= 6) nextSources.push(manWithMatBackpack, womanWithMatBag);
    const preloaders = nextSources.filter(Boolean).map((source) => {
      const image = new Image();
      image.decoding = "async";
      image.src = source;
      return image;
    });
    return () => preloaders.forEach((image) => image.removeAttribute("src"));
  }, [poseIndex, showFinalFrame]);

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    dragRef.current = { active: true, x: event.clientX, y: event.clientY, orbitX: orbit.x, orbitY: orbit.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!dragRef.current.active) return;
    const nextY = dragRef.current.orbitY + (event.clientX - dragRef.current.x) * 0.08;
    const nextX = dragRef.current.orbitX - (event.clientY - dragRef.current.y) * 0.06;
    setOrbit({ x: Math.max(-11, Math.min(11, nextX)), y: Math.max(-14, Math.min(14, nextY)) });
  };

  const stopDragging = () => {
    dragRef.current.active = false;
  };

  return (
    <section ref={journeyRef} className="relative h-[480svh] min-h-[2480px] bg-[#d9c9ae] text-[#f8f4ea] dark:bg-[#101816] motion-reduce:h-[100svh] motion-reduce:min-h-[620px]">
      <main className="sticky top-0 h-[100svh] min-h-[620px] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[39%] bg-[linear-gradient(180deg,#d8cbb7_0%,#e9dfcf_64%,#cbbba2_100%)] transition-[filter] duration-500 dark:brightness-[.34] dark:saturate-[.68]" />
      <div className="absolute inset-x-0 top-0 h-[39%] opacity-70 transition-opacity duration-500 [background-image:radial-gradient(circle_at_50%_-20%,rgba(255,255,255,.95),transparent_52%),linear-gradient(90deg,rgba(87,67,44,.07)_1px,transparent_1px)] [background-size:auto,88px_100%] dark:opacity-20" />

      <div className="absolute left-[6vw] top-[8vh] hidden h-[24vh] w-[19vw] min-w-[210px] max-w-[330px] overflow-hidden rounded-t-[12rem] border-[10px] border-[#eee5d6]/80 bg-[#b8d2ce] shadow-[0_22px_60px_rgba(69,50,29,.18)] transition-[filter] duration-500 dark:brightness-[.42] dark:saturate-[.65] md:block">
        <div className="absolute inset-0 bg-[linear-gradient(122deg,rgba(255,255,255,.75),rgba(255,255,255,.08)_34%,transparent_35%),linear-gradient(180deg,#b7d3d0,#e9e0cc)]" />
        <div className="absolute left-1/2 top-0 h-full w-2 -translate-x-1/2 bg-[#eee5d6]/90" />
        <div className="absolute left-0 top-[54%] h-2 w-full bg-[#eee5d6]/90" />
      </div>

      <div className="absolute right-[8vw] top-[12vh] hidden h-[17vh] w-[12vw] min-w-[150px] max-w-[230px] rounded-t-full border-[7px] border-[#d7c8b1] bg-[#ece3d5] shadow-inner transition-[filter] duration-500 dark:brightness-[.4] dark:saturate-[.6] lg:block">
        <div className="absolute bottom-0 left-1/2 h-[72%] w-[2px] -translate-x-1/2 bg-[#b9a88e]" />
        <div className="absolute bottom-[28%] left-0 h-[2px] w-full bg-[#b9a88e]" />
      </div>

      <div className="absolute inset-x-0 top-[38%] h-[62%] overflow-hidden bg-[#946c48] transition-[filter] duration-500 dark:brightness-[.36] dark:saturate-[.72]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(62,38,20,.16),transparent_13%),repeating-linear-gradient(91deg,transparent_0,transparent_7.5vw,rgba(68,37,17,.18)_7.65vw,rgba(255,226,181,.1)_7.8vw),linear-gradient(110deg,#765033_0%,#b58b62_40%,#8d603d_100%)]" />
        <div className="absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(0deg,transparent_0,transparent_72px,rgba(51,28,13,.35)_73px,rgba(255,236,203,.2)_74px)]" />
        <div className="absolute left-1/2 top-[-12%] h-[90%] w-[76%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,237,197,.42),transparent_67%)]" />
      </div>

      <img
        src={roomProps}
        alt="Rolled yoga mats, blocks, bolster and plant in the studio"
        title="Yoga studio props"
        loading="lazy"
        decoding="async"
        className="absolute bottom-[4%] left-[2vw] z-[4] hidden w-[19vw] max-w-[280px] object-contain drop-shadow-[0_18px_24px_rgba(42,28,19,.28)] lg:block"
      />

      <div className={`absolute left-1/2 top-[5vh] z-[3] hidden -translate-x-1/2 flex-col items-center text-[#6a563b]/55 transition-opacity duration-500 dark:text-[#d8e7dd]/55 md:flex ${exitScene ? "opacity-0" : ""}`}>
        <img src={studioLogo} alt="Dhanesh Yoga Studio logo" title="Dhanesh Yoga Studio" decoding="async" className="h-20 w-20 object-contain mix-blend-multiply opacity-35 dark:brightness-150 dark:mix-blend-screen dark:opacity-50" />
        <span className="-mt-2 text-[9px] font-semibold uppercase tracking-[0.36em]">Dhanesh Yoga Studio</span>
      </div>

      <motion.div
        initial={{ opacity: 0, x: "-50%", y: -12 }}
        animate={{ opacity: 1, x: "-50%", y: 0 }}
        transition={{ duration: duration(0.8), delay: delay(0.15) }}
        className="absolute left-[69%] top-[21vh] z-20 hidden whitespace-nowrap text-center lg:block"
      >
        <p className="text-[9px] font-semibold uppercase tracking-[0.46em] text-[#4c5a50]/80 dark:text-[#dce9e1]/85 sm:text-[10px]">Arrive as you are</p>
        <div className="mx-auto mt-3 h-px w-12 bg-[#6f776d]/45 dark:bg-[#dce9e1]/35" />
      </motion.div>

      <motion.section
        aria-label="Interactive Surya Namaskar yoga mat welcome"
        className="absolute inset-0 z-10 cursor-grab select-none active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        style={{
          y: sceneLift,
          rotateX: orbit.x,
          rotateY: orbit.y,
          transformPerspective: 1200,
          transformStyle: "preserve-3d",
          touchAction: "pan-y",
        }}
      >
        {!exitScene && <motion.div
          initial={{ opacity: 0, x: "-50%", y: 30, scale: 0.92 }}
          animate={{ opacity: 1, x: "-50%", y: sequenceComplete ? 30 : 0, scale: sequenceComplete ? 1.08 : 1 }}
          transition={{ duration: duration(0.8), ease: easeOut }}
          className={`absolute bottom-[43%] left-1/2 z-30 min-h-[210px] max-h-[410px] xl:left-[60%] ${poseIndex === 7 ? "h-[37vh] sm:h-[43vh]" : poseIndex >= 4 ? "h-[28vh] sm:h-[32vh]" : "h-[34vh] sm:h-[38vh]"}`}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={poses[poseIndex].src + poseIndex}
              src={poses[poseIndex].src}
              alt={`Yoga teacher in ${poses[poseIndex].label}`}
              decoding="async"
              fetchPriority={poseIndex === 0 ? "high" : "auto"}
              initial={{ opacity: 0, y: 18, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 1.03 }}
              transition={{ duration: duration(poseIndex === 7 ? 0.85 : 0.7), ease: easeOut }}
              className="h-full w-auto max-w-none object-contain drop-shadow-[0_25px_20px_rgba(36,26,17,.28)]"
            />
          </AnimatePresence>
        </motion.div>}

        <AnimatePresence>
          {exitScene && (
            <>
              <motion.img
                src={manWithMatBackpack}
                alt="Yoga instructor leaving with a rolled mat on his back"
                title="Yoga instructor with rolled mat"
                loading="lazy"
                decoding="async"
                initial={{ left: "42%", x: "-50%", opacity: 0, scale: 0.86 }}
                animate={{ left: "23%", x: "-50%", opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration(1.55), ease: easeOut }}
                className="pointer-events-none absolute bottom-[15%] z-30 h-[43vh] max-h-[480px] w-auto object-contain drop-shadow-[0_25px_20px_rgba(36,26,17,.28)] sm:bottom-[13%] sm:h-[48vh]"
              />
              <motion.img
                src={womanWithMatBag}
                alt="Yoga instructor leaving with a yoga mat bag"
                title="Yoga instructor with mat bag"
                loading="lazy"
                decoding="async"
                initial={{ left: "58%", x: "-50%", opacity: 0, scale: 0.86 }}
                animate={{ left: "77%", x: "-50%", opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration(1.55), ease: easeOut }}
                className="pointer-events-none absolute bottom-[15%] z-30 h-[43vh] max-h-[480px] w-auto object-contain drop-shadow-[0_25px_20px_rgba(36,26,17,.28)] sm:bottom-[13%] sm:h-[48vh]"
              />
            </>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, x: "-50%", scaleX: 0.4 }}
          animate={{ opacity: exitScene ? 0 : 0.28, x: "-50%", scaleX: 1 }}
          transition={{ duration: duration(0.9), delay: delay(3.85), ease: easeOut }}
          className="absolute left-1/2 top-[42.5%] z-[9] h-5 w-40 rounded-[100%] bg-[#2e2117] blur-md"
        />

        <motion.div
          initial={{ x: showFinalFrame ? "-50%" : "72vw" }}
          animate={{ x: "-50%" }}
          transition={{ duration: duration(0.95), delay: delay(0.45), ease: easeOut }}
          className="absolute left-1/2 top-[40.5%] z-20 h-[61vh] w-[min(78vw,580px)] [perspective:1100px] sm:w-[min(58vw,620px)] lg:w-[min(44vw,650px)]"
        >
          <div className="relative h-full w-full origin-top [transform:rotateX(58deg)] [transform-style:preserve-3d]">
            <motion.div
              initial={false}
              style={{ scaleY: showFinalFrame ? 1 : matScaleY, opacity: showFinalFrame ? 0 : matOpacity }}
              className="absolute inset-0 origin-top overflow-hidden rounded-b-[2.5rem] rounded-t-[0.6rem] border border-[#a97153]/60 bg-[linear-gradient(92deg,#5f2530_0%,#914250_5%,#a9575e_48%,#74313d_96%,#4d2028_100%)] shadow-[0_45px_65px_rgba(32,19,13,.42)]"
            >
              <div className="absolute inset-0 opacity-45 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.04)_0,rgba(255,255,255,.04)_1px,transparent_1px,transparent_4px),linear-gradient(180deg,rgba(255,255,255,.14),transparent_20%,rgba(34,8,14,.16))]" />
              <div className="absolute inset-5 rounded-[1.4rem] border border-[#e8c998]/18" />

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration(0.9), delay: delay(3.15), ease: easeOut }}
                className="absolute inset-x-6 top-[31%] text-center text-[#f6e8cf]"
              >
                <p className="font-display text-[clamp(1.15rem,3.8vw,3rem)] font-semibold leading-none tracking-[0.16em] drop-shadow-[0_2px_8px_rgba(45,9,18,.28)]">DHANESH YOGA</p>
                <div className="mx-auto my-[clamp(.7rem,2vh,1.2rem)] flex items-center justify-center gap-3 opacity-65">
                  <span className="h-px w-10 bg-current" />
                  <span className="h-1.5 w-1.5 rotate-45 border border-current" />
                  <span className="h-px w-10 bg-current" />
                </div>
                <p className="text-[clamp(.55rem,1.35vw,.88rem)] font-medium uppercase tracking-[0.28em] text-[#f2d8b4]/85">Breathe in peace · move with purpose</p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: duration(0.7), delay: delay(3.55) }}
                className="absolute inset-x-0 bottom-[8%] text-center text-[8px] font-medium uppercase tracking-[0.38em] text-[#f6e8cf] sm:text-[10px]"
              >
                Begin your practice
              </motion.p>
            </motion.div>

            <motion.div
              initial={false}
              style={{ y: showFinalFrame ? 0 : matRollY, opacity: showFinalFrame ? 0 : matOpacity }}
              animate={{ top: "94%", rotate: 0 }}
              transition={{ duration: duration(0.45), ease: easeOut }}
              className="absolute left-[-1.5%] z-30 h-10 w-[103%] rounded-full border border-[#d67e82]/45 bg-[linear-gradient(180deg,#d87980_0%,#9d4854_31%,#71303c_60%,#bc606b_100%)] shadow-[0_14px_18px_rgba(45,19,16,.42)] sm:h-12"
            >
              <div className="absolute inset-x-4 top-[22%] h-[18%] rounded-full bg-[#f2b0a5]/35 blur-[2px]" />
              <div className="absolute right-2 top-1/2 h-[72%] aspect-square -translate-y-1/2 rounded-full border border-[#f1aaa4]/25 bg-[#672a35] shadow-inner" />
            </motion.div>
          </div>
        </motion.div>

        {!exitScene && <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration(0.9), delay: delay(4.45), ease: easeOut }}
          className="absolute inset-x-0 bottom-5 z-40 px-5 text-center sm:bottom-7"
        >
          <p className="text-[9px] uppercase tracking-[0.34em] text-[#f5e9d7]/75 sm:text-[10px]">A space to return to yourself</p>
        </motion.div>}

        {!exitScene && <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.94 }}
          animate={{ opacity: matDelivered ? 1 : 0, y: matDelivered ? 0 : 18, scale: matDelivered ? 1 : 0.94 }}
          transition={{ duration: duration(0.8), delay: delay(0.2), ease: easeOut }}
          className="absolute inset-x-0 bottom-[11%] z-50 flex justify-center px-5"
        >
          <Link
            to="/login"
            onPointerDown={(event) => event.stopPropagation()}
            className="group inline-flex items-center gap-3 rounded-full border border-[#f4e4c9]/30 bg-[#24483a] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f8f0e2] shadow-[0_14px_30px_rgba(24,42,31,.3)] transition hover:-translate-y-0.5 hover:bg-[#315b49] sm:px-7 sm:py-4"
          >
            Register for Dhanesh Yoga Studio
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>}

        {!matDelivered && !exitScene ? (
          <div className="pointer-events-none absolute left-1/2 top-[64%] z-50 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#f6e7cf]/20 bg-[#2d1b1d]/25 px-3 py-1.5 text-[8px] font-medium uppercase tracking-[0.24em] text-[#f6e7cf]/70 backdrop-blur-sm sm:text-[9px]">
            {journeyCopy[poseIndex].eyebrow} · {poses[poseIndex].label}
          </div>
        ) : matDelivered && !exitScene ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration(0.8), delay: delay(0.8) }}
            className="pointer-events-none absolute inset-x-0 bottom-[22%] z-50 text-center text-[10px] font-semibold uppercase tracking-[0.32em] text-[#f6e7cf]/85 sm:text-xs"
          >
            Your practice begins here
          </motion.div>
        ) : null}
        <AnimatePresence mode="wait">
          {!exitScene && (
            <motion.div
              key={poseIndex}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: duration(0.6), ease: easeOut }}
              className="pointer-events-none absolute left-[4vw] top-[45%] z-40 hidden max-w-[300px] rounded-r-3xl border border-[#6b4d39]/20 bg-[#f6f0e7]/[.98] px-5 py-5 text-left text-[#332920] shadow-[14px_16px_32px_rgba(52,35,20,.16)] backdrop-blur-md dark:border-[#d9e8dd]/15 dark:bg-[#14201d]/90 dark:text-[#f5e9d7] xl:block"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#624936] dark:text-[#d9e8dd]/70">{journeyCopy[poseIndex].eyebrow}</p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">{journeyCopy[poseIndex].title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#4d3d31] dark:text-[#e8ded0]/75">{journeyCopy[poseIndex].body}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      <AnimatePresence>
        {exitScene && (
          <motion.div
            initial={{ opacity: 0, x: "-50%", y: 16, scale: 0.94 }}
            animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
            exit={{ opacity: 0, x: "-50%" }}
            transition={{ duration: duration(0.9), delay: delay(0.65), ease: easeOut }}
            className="pointer-events-none absolute left-1/2 top-[46%] z-40 flex w-[min(54vw,420px)] -translate-x-1/2 flex-col items-center text-center text-[#5e4931]"
          >
            <img src={studioLogo} alt="Dhanesh Yoga Studio" title="Dhanesh Yoga Studio" loading="lazy" decoding="async" className="h-20 w-20 object-contain mix-blend-multiply dark:brightness-150 dark:mix-blend-screen sm:h-24 sm:w-24" />
            <p className="mt-2 font-display text-[clamp(1.35rem,3vw,2.35rem)] font-semibold tracking-[0.16em] text-[#59442e] dark:text-[#f5e9d7]">DHANESH YOGA</p>
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.36em] text-[#6b563e]/80 dark:text-[#d6e4da]/80 sm:text-[10px]">Yoga Studio</p>
            <div className="mt-4 h-px w-16 bg-[#6b563e]/40 dark:bg-[#d6e4da]/35" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(30,20,13,.18)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-32 bg-gradient-to-t from-[#2a1b12]/35 to-transparent" />
      </main>
    </section>
  );
};

export default YogaMatConcept;
