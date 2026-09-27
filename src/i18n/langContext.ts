import { createContext } from "react";
import type { Lang } from "./types";
import type { Messages } from "./strings";

/**
 * El objeto de contexto vive separado del provider y de los hooks.
 *
 * Es lo que pide la regla de Fast Refresh: un archivo que exporta un componente
 * no debería exportar además funciones, porque al editarlo React recarga el
 * módulo entero y se pierde el estado. Con el contexto acá, el provider queda
 * solo en su archivo y los hooks en el suyo.
 */
export interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  m: Messages;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
