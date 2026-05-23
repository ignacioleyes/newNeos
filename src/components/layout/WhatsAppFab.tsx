import { WhatsAppIcon } from "../ui/WhatsAppIcon";

interface WhatsAppFabProps {
  phone: string;
  message?: string;
}

export function WhatsAppFab({ phone, message = "Hola, me gustaría más información sobre los proyectos de NEOS." }: WhatsAppFabProps) {
  const href = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      <WhatsAppIcon className="relative h-7 w-7" />
    </a>
  );
}
