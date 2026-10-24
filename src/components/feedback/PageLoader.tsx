import logoImg from "@/assets/logo.webp";

const PageLoader = () => (
  <div
    className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-[#f4eee4] px-6 text-[#24483a] dark:bg-[#101816] dark:text-[#f6efe2]"
    role="status"
    aria-live="polite"
    aria-label="Loading the next page"
  >
    <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_50%_42%,rgba(92,151,123,.18),transparent_34%),linear-gradient(135deg,rgba(218,183,104,.08),transparent_55%)] dark:opacity-45" />

    <div className="relative flex flex-col items-center text-center">
      <div className="relative grid h-28 w-28 place-items-center sm:h-32 sm:w-32">
        <span className="absolute inset-0 rounded-full border border-[#d3b064]/40 animate-[ping_2.4s_ease-out_infinite] motion-reduce:animate-none" />
        <span className="absolute inset-2 rounded-full border border-[#4d8068]/30 animate-[spin_5s_linear_infinite] border-r-transparent motion-reduce:animate-none" />
        <span className="absolute inset-4 rounded-full bg-white/65 shadow-[0_18px_50px_rgba(36,72,58,.18)] backdrop-blur-sm dark:bg-[#193027]/80" />
        <img
          src={logoImg}
          alt=""
          width="72"
          height="72"
          decoding="async"
          className="relative h-[4.5rem] w-[4.5rem] object-contain animate-[pulse_2.2s_ease-in-out_infinite] motion-reduce:animate-none"
        />
      </div>

      <p className="mt-6 font-display text-2xl font-semibold tracking-[0.08em] sm:text-3xl">
        Dhanesh Yoga
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#5d7569] dark:text-[#b8c9c0]">
        Preparing your practice
      </p>

      <div className="mt-5 flex items-center gap-2" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="h-1.5 w-1.5 rounded-full bg-[#c29b4a] animate-bounce motion-reduce:animate-none"
            style={{ animationDelay: `${dot * 160}ms` }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default PageLoader;
