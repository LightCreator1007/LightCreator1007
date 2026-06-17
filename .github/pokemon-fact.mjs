import { readFile, writeFile } from "node:fs/promises";

const FILE = "README.md";
const START = "<!-- POKEMON-FACT:START -->";
const END = "<!-- POKEMON-FACT:END -->";

const id = Math.floor(Math.random() * 1025) + 1;

const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
if (!res.ok) throw new Error(`pokeapi responded ${res.status}`);
const species = await res.json();

const name = species.name
  .split("-")
  .map((w) => w[0].toUpperCase() + w.slice(1))
  .join(" ");

const en = species.flavor_text_entries.filter((e) => e.language.name === "en");
const pick = en[Math.floor(Math.random() * en.length)] ?? species.flavor_text_entries[0];
const fact = pick.flavor_text.replace(/\s+/g, " ").trim();

const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const block = [
  START,
  `> <img src="${sprite}" height="48" align="top" alt="${name}" /> &nbsp; **${name}** · ${fact}`,
  END,
].join("\n");

const readme = await readFile(FILE, "utf8");
const s = readme.indexOf(START);
const e = readme.indexOf(END);
if (s === -1 || e === -1) throw new Error("fact markers not found in README");

const updated = readme.slice(0, s) + block + readme.slice(e + END.length);
await writeFile(FILE, updated);
console.log(`pokemon: ${name} (#${id})`);
