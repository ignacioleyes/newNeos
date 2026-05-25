/**
 * Indicador "Neo está escribiendo…". Se renderiza como una burbuja más
 * en la lista de mensajes cuando `state.isTyping === true`.
 *
 * Tres dots con bounce escalonado (wave) para feel natural.
 */
export function NeoTyping() {
  return (
    <div className="flex justify-start" aria-hidden>
      <div className="bg-base-100 border border-base-300/60 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full bg-base-content/50 animate-bounce"
            style={{ animationDelay: "0ms", animationDuration: "1.2s" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-base-content/50 animate-bounce"
            style={{ animationDelay: "200ms", animationDuration: "1.2s" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-base-content/50 animate-bounce"
            style={{ animationDelay: "400ms", animationDuration: "1.2s" }}
          />
        </div>
      </div>
    </div>
  );
}
