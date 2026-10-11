import { useEffect } from "react";

// Zaključava skrol stranice dok je drawer/meni/dropdown otvoren — bez layout
// shift-a. `html { scrollbar-gutter: stable }` u globals.css čuva prostor
// scrollbara, pa se raspored ne menja (isto kao u lubenicashop-new). Za
// browsere bez te podrške merimo stvarnu širinu html boksa pre i posle
// zaključavanja i kompenzujemo paddingom na body-ju; fiksirani elementi
// (header, "na vrh", drawer) čitaju isti pomak iz `--scrollbar-comp`.
// Napomena: ne meriti `clientWidth` — Chrome u njega uračuna i rezervisani
// gutter, pa bi kompenzacija bila lažna i sama izazvala pomeranje.
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const html = document.documentElement;
    const body = document.body;
    const widthBefore = html.getBoundingClientRect().width;
    const prevOverflow = html.style.overflow;
    const prevPadding = body.style.paddingRight;
    const prevComp = html.style.getPropertyValue("--scrollbar-comp");

    html.style.overflow = "hidden";

    const shift = Math.round(html.getBoundingClientRect().width - widthBefore);
    if (shift > 0) {
      body.style.paddingRight = `${shift}px`;
      html.style.setProperty("--scrollbar-comp", `${shift}px`);
    }

    return () => {
      html.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      if (prevComp) html.style.setProperty("--scrollbar-comp", prevComp);
      else html.style.removeProperty("--scrollbar-comp");
    };
  }, [active]);
}
