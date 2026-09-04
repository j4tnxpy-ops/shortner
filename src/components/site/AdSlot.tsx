import { useEffect, useRef } from "react";

export function AdSlot({ html, className = "" }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host || !html.trim()) return;
    host.replaceChildren();
    const template = document.createElement("template");
    template.innerHTML = html;
    const nodes = Array.from(template.content.childNodes);
    for (const node of nodes) {
      if (node.nodeName.toLowerCase() === "script") {
        const old = node as HTMLScriptElement;
        const script = document.createElement("script");
        for (const attr of Array.from(old.attributes)) script.setAttribute(attr.name, attr.value);
        script.text = old.text;
        host.appendChild(script);
      } else host.appendChild(node.cloneNode(true));
    }
    return () => host.replaceChildren();
  }, [html]);
  return <div ref={ref} className={className} />;
}
