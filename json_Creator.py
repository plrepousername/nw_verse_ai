import json

units = {
    1: ["eins", "ein"],
    2: ["zwei"],
    3: ["drei"],
    4: ["vier"],
    5: ["fünf"],
    6: ["sechs"],
    7: ["sieben"],
    8: ["acht"],
    9: ["neun"]
}

teens = {
    10: ["zehn"],
    11: ["elf"],
    12: ["zwölf"],
    13: ["dreizehn"],
    14: ["vierzehn"],
    15: ["fünfzehn"],
    16: ["sechzehn"],
    17: ["siebzehn"],
    18: ["achtzehn"],
    19: ["neunzehn"]
}

tens = {
    20: "zwanzig",
    30: "dreißig",
    40: "vierzig",
    50: "fünfzig",
    60: "sechzig",
    70: "siebzig",
    80: "achtzig",
    90: "neunzig"
}

def add(mapping, key, value):
    mapping[key.lower()] = value


def generate(n):
    words = []

    if n < 10:
        for u in units[n]:
            words.append(u)

    elif n < 20:
        words.append(teens[n][0])

    elif n < 100:
        t = (n // 10) * 10
        u = n % 10

        if u == 0:
            words.append(tens[t])
        else:
            for uword in units[u]:
                words.append(f"{uword}unds{tens[t][1:]}")
                words.append(f"{uword} und {tens[t]}")

    elif n == 100:
        words += ["hundert", "einhundert", "ein hundert"]

    elif n < 200:
        rest = n - 100
        base = generate(rest)

        for b in base:
            words.append("hundert" + b.replace(" ", ""))
            words.append("hundert " + b)
            words.append("einhundert" + b.replace(" ", ""))
            words.append("ein hundert " + b)

    return words


mapping = {}

for i in range(1, 151):
    for w in generate(i):
        mapping[w] = i

    mapping[str(i)] = i


with open("zahlen.json", "w", encoding="utf-8") as f:
    json.dump(mapping, f, ensure_ascii=False, indent=2)

print("fertig:", len(mapping))