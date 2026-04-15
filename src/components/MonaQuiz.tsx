import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QuizProgressBar from "./QuizProgressBar";
import QuizOptionCard from "./QuizOptionCard";
import StepLayout from "./StepLayout";
import InputField from "./InputField";
import logo from "@/assets/image.png";
import { ArrowLeft } from "lucide-react";

import cover1 from "@/assets/1.png";
import cover2 from "@/assets/2.png";
import cover3 from "@/assets/3.png";
import cover4 from "@/assets/4.png";

// ── Configurações ───────────────────────────────────────────────
const WHATSAPP_NUMBER = "558622221001";
const SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbyl2H5X92RWOcASdGOu2iwVTvQ5JnG1MpNVrljbekeRu6FI8UjtU8xgwMLzsLnCsYxK/exec";
// ────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const TOTAL_STEPS = 7;

const eventTypes = [
  "Reunião corporativa",
  "Treinamento / workshop",
  "Convenção",
  "Evento institucional",
  "Outro",
];

const guestCounts = [
  "Até 10 pessoas",
  "10 a 30 pessoas",
  "30 a 70 pessoas",
  "70 a 150 pessoas",
  "150 a 210 pessoas",
];

const formats = [
  "Auditório",
  "Mesa em U",
  "Escolar",
  "Banquete",
  "Ainda não sei",
];

const timelines = [
  "Nos próximos 7 dias",
  "Nos próximos 15 dias",
  "Neste mês",
  "Ainda estou planejando",
];

const slideVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const heroSlides = [
  {
    image: cover1,
    eyebrow: "Estrutura premium",
    title: "Ambientes preparados para eventos corporativos memoráveis",
    description:
      "Salas, foyer e espaços pensados para reunir conforto, presença e funcionalidade no mesmo lugar.",
  },
  {
    image: cover2,
    eyebrow: "Flexibilidade",
    title:
      "Opções para reuniões, treinamentos, convenções e encontros institucionais",
    description:
      "Formatos adaptáveis para diferentes tipos de evento, com uma experiência mais profissional para sua equipe e convidados.",
  },
  {
    image: cover3,
    eyebrow: "Percepção de valor",
    title: "Um espaço que valoriza sua marca antes mesmo do evento começar",
    description:
      "A atmosfera certa para transmitir organização, credibilidade e atenção aos detalhes.",
  },
  {
    image: cover4,
    eyebrow: "Planejamento mais fácil",
    title: "Descubra rapidamente o formato ideal para o seu evento",
    description:
      "Responda algumas perguntas e entenda qual estrutura faz mais sentido para a sua necessidade.",
  },
];

const formatName = (value: string) =>
  value
    .replace(/[^A-Za-zÀ-ÿ\s]/g, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, 60);

const formatWhatsApp = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatEmail = (value: string) =>
  value.replace(/\s/g, "").slice(0, 100);

const MonaQuiz = () => {
  const [step, setStep] = useState(1);
  const [heroIndex, setHeroIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [answers, setAnswers] = useState({
    eventType: "",
    guestCount: "",
    format: "",
    timeline: "",
    name: "",
    whatsapp: "",
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (step !== 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [step]);

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  const selectAndAdvance = (field: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    setTimeout(() => setStep((s) => s + 1), 350);
  };

  const validateLead = () => {
    const newErrors: Record<string, string> = {};
    const whatsappDigits = answers.whatsapp.replace(/\D/g, "");

    if (!answers.name.trim()) newErrors.name = "Informe seu nome";

    if (!whatsappDigits) {
      newErrors.whatsapp = "Informe seu WhatsApp";
    } else if (whatsappDigits.length < 10) {
      newErrors.whatsapp = "Informe um WhatsApp válido";
    }

    if (!answers.email.trim() || !answers.email.includes("@")) {
      newErrors.email = "Informe um email válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendToSheets = async () => {
    const mensagem =
      `Participantes: ${answers.guestCount} | ` +
      `Formato: ${answers.format} | ` +
      `Prazo: ${answers.timeline}`;

    try {
      await fetch(SHEETS_URL, {
        method: "POST",
        body: JSON.stringify({
          nome: answers.name,
          email: answers.email,
          telefone: answers.whatsapp,
          evento: answers.eventType,
          mensagem,
        }),
      });
    } catch {
      // falha silenciosa — não bloqueia o usuário
    }
  };

  const trackLead = () => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead");
    }
  };

  const handleSubmitLead = async () => {
    if (!validateLead()) return;
    setSubmitting(true);
    await sendToSheets();
    trackLead();
    setSubmitting(false);
    setStep(7);
  };

  const openWhatsApp = () => {
    const msg = encodeURIComponent(
      `Olá! Tenho interesse em realizar um evento no Monã.\n\n` +
        `• Tipo: ${answers.eventType}\n` +
        `• Participantes: ${answers.guestCount}\n` +
        `• Formato: ${answers.format}\n` +
        `• Prazo: ${answers.timeline}\n` +
        `• Nome: ${answers.name}\n` +
        `• Email: ${answers.email}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col items-center text-center gap-8">
            <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
              <p className="text-[11px] md:text-sm uppercase tracking-[0.3em] text-accent font-medium">
                Planejamento rápido e inteligente
              </p>

              <h1 className="font-display text-3xl md:text-5xl font-semibold text-foreground leading-tight">
                Descubra o formato ideal para o seu evento
              </h1>
            </div>

            <div className="w-full max-w-3xl">
              <div className="relative overflow-hidden rounded-[28px] bg-black shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                <div className="relative h-[320px] md:h-[440px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={heroIndex}
                      className="absolute inset-0"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.55, ease: "easeOut" }}
                    >
                      <img
                        src={heroSlides[heroIndex].image}
                        alt={heroSlides[heroIndex].title}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/15" />

                      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 text-left">
                        <p className="text-white/70 text-[11px] md:text-sm uppercase tracking-[0.25em] font-body mb-3">
                          {heroSlides[heroIndex].eyebrow}
                        </p>

                        <h2 className="font-display text-2xl md:text-4xl font-semibold text-white leading-tight mb-3 max-w-2xl">
                          {heroSlides[heroIndex].title}
                        </h2>

                        <p className="text-white/80 font-body text-sm md:text-base leading-relaxed max-w-xl">
                          {heroSlides[heroIndex].description}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setHeroIndex(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          heroIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/45"
                        }`}
                        aria-label={`Ir para slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
              <p className="text-muted-foreground font-body text-base md:text-lg max-w-xl leading-relaxed">
                Em poucos passos, você identifica a estrutura mais adequada para
                a quantidade de pessoas, tipo de evento e prazo desejado.
              </p>

              <button
                onClick={() => setStep(2)}
                className="mt-2 px-10 py-3.5 rounded-xl bg-accent text-accent-foreground font-body text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
              >
                Começar
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <StepLayout question="Qual o tipo do seu evento?">
            {eventTypes.map((opt, i) => (
              <QuizOptionCard
                key={opt}
                label={opt}
                selected={answers.eventType === opt}
                onClick={() => selectAndAdvance("eventType", opt)}
                index={i}
              />
            ))}
          </StepLayout>
        );

      case 3:
        return (
          <StepLayout question="Quantas pessoas devem participar?">
            {guestCounts.map((opt, i) => (
              <QuizOptionCard
                key={opt}
                label={opt}
                selected={answers.guestCount === opt}
                onClick={() => selectAndAdvance("guestCount", opt)}
                index={i}
              />
            ))}
          </StepLayout>
        );

      case 4:
        return (
          <StepLayout question="Como você imagina o formato do seu evento?">
            {formats.map((opt, i) => (
              <QuizOptionCard
                key={opt}
                label={opt}
                selected={answers.format === opt}
                onClick={() => selectAndAdvance("format", opt)}
                index={i}
              />
            ))}
          </StepLayout>
        );

      case 5:
        return (
          <StepLayout question="Quando você pretende realizar o evento?">
            {timelines.map((opt, i) => (
              <QuizOptionCard
                key={opt}
                label={opt}
                selected={answers.timeline === opt}
                onClick={() => selectAndAdvance("timeline", opt)}
                index={i}
              />
            ))}
          </StepLayout>
        );

      case 6:
        return (
          <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground text-center">
              Estamos quase lá
            </h2>

            <div className="flex flex-col gap-4">
              <InputField
                label="Nome"
                value={answers.name}
                error={errors.name}
                onChange={(v) =>
                  setAnswers((p) => ({ ...p, name: formatName(v) }))
                }
                placeholder="Digite seu nome completo"
                autoComplete="name"
              />

              <InputField
                label="WhatsApp"
                value={answers.whatsapp}
                error={errors.whatsapp}
                onChange={(v) =>
                  setAnswers((p) => ({ ...p, whatsapp: formatWhatsApp(v) }))
                }
                type="tel"
                placeholder="(86) 99999-9999"
                inputMode="numeric"
                autoComplete="tel"
              />

              <InputField
                label="Email"
                value={answers.email}
                error={errors.email}
                onChange={(v) =>
                  setAnswers((p) => ({ ...p, email: formatEmail(v) }))
                }
                type="email"
                placeholder="voce@empresa.com"
                inputMode="email"
                autoComplete="email"
              />
            </div>

            <button
              onClick={handleSubmitLead}
              disabled={submitting}
              className="mt-2 px-10 py-3.5 rounded-xl bg-accent text-accent-foreground font-body text-sm font-medium tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Enviando..." : "Ver recomendação"}
            </button>
          </div>
        );

      case 7:
        return (
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground leading-tight">
              Perfeito, já temos uma direção para o seu evento
            </h2>

            <p className="text-muted-foreground font-body text-base max-w-md leading-relaxed">
              Com base nas suas respostas, temos opções ideais de espaços e
              formatos para atender o seu evento com excelência.
            </p>

            <button
              onClick={openWhatsApp}
              className="mt-4 px-10 py-3.5 rounded-xl bg-accent text-accent-foreground font-body text-sm font-medium tracking-wide hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.592-.828-6.328-2.212l-.44-.352-3.276 1.098 1.098-3.276-.352-.44A9.953 9.953 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
              </svg>
              Falar com especialista
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute top-6 left-6 z-50">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-[#2f2f2f] hover:opacity-70 transition"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        )}
      </div>

      <header className="w-full py-6 px-6 flex justify-center">
        <img
          src={logo}
          alt="Monã"
          className="h-10 md:h-12 w-auto object-contain mx-auto"
        />
      </header>

      {step > 1 && (
        <div className="px-6 max-w-lg mx-auto w-full">
          <QuizProgressBar progress={progress} />
        </div>
      )}

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-5xl"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default MonaQuiz;
