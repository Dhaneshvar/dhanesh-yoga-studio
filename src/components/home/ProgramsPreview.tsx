import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Flower2, MessageCircle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPrograms, type Program } from "@/lib/studioApi";

const ProgramsPreview = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasConnectionError, setHasConnectionError] = useState(false);

  const loadPrograms = useCallback(async () => {
    setLoading(true);
    setHasConnectionError(false);

    try {
      setPrograms(await getPrograms());
    } catch {
      // The technical failure is deliberately not shown to a studio visitor.
      setHasConnectionError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPrograms();
  }, [loadPrograms]);

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24">
      <div className="absolute left-0 top-0 h-40 w-40 animate-float-slow rounded-full bg-sage-light/20 blur-3xl sm:h-64 sm:w-64" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-terracotta-light/10 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-10 text-center sm:mb-16">
          <span className="mb-4 inline-block rounded-full bg-sage-light px-4 py-2 text-sm font-medium text-sage-dark">Studio programmes</span>
          <h2 className="mb-4 font-display text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">Practice for every stage of life</h2>
          <p className="mx-auto max-w-2xl font-body text-base text-muted-foreground sm:text-lg">Explore the programmes currently published by Dhanesh Yoga Studio.</p>
        </motion.div>
        {loading && <p role="status" aria-live="polite" className="py-8 text-center text-muted-foreground">Loading live programmes…</p>}
        {hasConnectionError && <div role="status" aria-live="polite" className="mx-auto max-w-2xl rounded-3xl border border-primary/20 bg-card p-7 text-center shadow-card sm:p-8"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><WifiOff className="h-6 w-6" aria-hidden="true" /></div><h3 className="mt-4 font-display text-2xl font-semibold text-foreground">We&apos;re refreshing the studio programmes</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">We couldn&apos;t connect to the programme list just now. Your yoga journey is still here—please try again, or ask our studio team for the latest options.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Button type="button" onClick={() => void loadPrograms()}><RefreshCw className="h-4 w-4" aria-hidden="true" />Try again</Button><Button variant="outline" asChild><Link to="/contact"><MessageCircle className="h-4 w-4" aria-hidden="true" />Contact the studio</Link></Button></div></div>}
        {!loading && !hasConnectionError && programs.length === 0 && <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-card"><h3 className="font-display text-2xl font-semibold text-foreground">Programmes are being prepared</h3><p className="mt-2 text-muted-foreground">The studio will publish its current programmes here.</p><Button asChild className="mt-6"><Link to="/contact">Contact the studio</Link></Button></div>}
        {!loading && !hasConnectionError && programs.length > 0 && <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {programs.slice(0, 4).map((program) => <motion.article key={program.id} variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }} className="card-hover group rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
            <div className="icon-spring mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sage text-primary-foreground sm:mb-5 sm:h-14 sm:w-14" aria-hidden="true"><Flower2 className="h-6 w-6 sm:h-7 sm:w-7" /></div>
            <h3 className="font-display text-lg font-semibold text-foreground sm:text-xl">{program.name}</h3>
            <p className="mt-3 min-h-12 text-xs text-muted-foreground sm:text-sm">{program.description || "Details will be shared by the studio."}</p>
            <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">{program.duration_minutes ? <><Clock className="h-4 w-4" aria-hidden="true" />{program.duration_minutes} minutes</> : (program.audience || "All levels")}</div>
            <Link to="/schedule" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition-all hover:gap-3 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">See classes <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </motion.article>)}
        </motion.div>}
        <div className="mt-10 text-center sm:mt-12"><Button variant="hero" size="lg" asChild><Link to="/programs">View all programmes <ArrowRight className="h-5 w-5" aria-hidden="true" /></Link></Button></div>
      </div>
    </section>
  );
};

export default ProgramsPreview;
