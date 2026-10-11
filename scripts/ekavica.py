"""Ijekavica → ekavica nad tekstom, čuvajući veliko/malo slovo prvog znaka."""
import json, re, sys, os
MAP = json.load(open(os.path.join(os.path.dirname(__file__), "ekavica-map.json")))
RULES = []
for src, dst in MAP:
    if src == dst: continue
    pat = src if src.startswith("\\b") else src
    RULES.append((re.compile(pat, re.IGNORECASE), dst))

def convert(text: str) -> str:
    def repl_factory(dst):
        def repl(m):
            s = m.group(0)
            if s.isupper() and len(s) > 1: return dst.upper()
            if s[0].isupper(): return dst[0].upper() + dst[1:]
            return dst
        return repl
    for rx, dst in RULES:
        text = rx.sub(repl_factory(dst), text)
    return text

if __name__ == "__main__":
    changed = 0
    for root in sys.argv[1:]:
        for dp, dn, fn in os.walk(root):
            if "node_modules" in dp or "/.next" in dp: continue
            for f in fn:
                if not f.endswith((".ts", ".tsx")): continue
                p = os.path.join(dp, f)
                s = open(p, encoding="utf-8").read()
                n = convert(s)
                if n != s:
                    open(p, "w", encoding="utf-8").write(n); changed += 1; print("~", p)
    print("changed files:", changed)
