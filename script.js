/* Faixas de exemplo (SoundHelix, uso livre). Para usar suas músicas,
   coloque os arquivos numa pasta "musicas/" e troque o campo "arquivo". */
const faixas = [
  { titulo: "Horizonte",    artista: "RiquelmeRMS", arquivo: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { titulo: "Maré Alta",    artista: "RiquelmeRMS", arquivo: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { titulo: "Estrada Azul", artista: "RiquelmeRMS", arquivo: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { titulo: "Ciclo Noturno",artista: "RiquelmeRMS", arquivo: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" }
];

const $ = id => document.getElementById(id);
const audio = $("audio"), play = $("play"), barra = $("barra"), disco = $("disco"), lista = $("lista");
let indice = 0;

const formatar = s => isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00";

function carregar(i, tocar = false) {
  indice = (i + faixas.length) % faixas.length;
  const f = faixas[indice];
  audio.src = f.arquivo;
  $("titulo").textContent = f.titulo;
  $("artista").textContent = f.artista;
  barra.value = 0;
  $("atual").textContent = "0:00";
  $("total").textContent = "0:00";
  [...lista.children].forEach((li, n) => li.classList.toggle("ativa", n === indice));
  if (tocar) audio.play().catch(() => {});
}

function alternar() {
  audio.paused ? audio.play().catch(() => {}) : audio.pause();
}

audio.addEventListener("play", () => { play.textContent = "⏸"; play.setAttribute("aria-label", "Pausar"); disco.classList.add("tocando"); });
audio.addEventListener("pause", () => { play.textContent = "▶"; play.setAttribute("aria-label", "Tocar"); disco.classList.remove("tocando"); });
audio.addEventListener("loadedmetadata", () => { $("total").textContent = formatar(audio.duration); });
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  barra.value = (audio.currentTime / audio.duration) * 100;
  $("atual").textContent = formatar(audio.currentTime);
});
audio.addEventListener("ended", () => carregar(indice + 1, true));

barra.addEventListener("input", () => { if (audio.duration) audio.currentTime = (barra.value / 100) * audio.duration; });
$("volume").addEventListener("input", e => { audio.volume = e.target.value; });
play.addEventListener("click", alternar);
$("proxima").addEventListener("click", () => carregar(indice + 1, true));
$("anterior").addEventListener("click", () => audio.currentTime > 3 ? (audio.currentTime = 0) : carregar(indice - 1, true));
$("avancar").addEventListener("click", () => { audio.currentTime = Math.min(audio.currentTime + 10, audio.duration || 0); });
$("voltar").addEventListener("click", () => { audio.currentTime = Math.max(audio.currentTime - 10, 0); });

document.addEventListener("keydown", e => {
  if (e.target.tagName === "INPUT") return;
  if (e.code === "Space") { e.preventDefault(); alternar(); }
  if (e.code === "ArrowRight") $("avancar").click();
  if (e.code === "ArrowLeft") $("voltar").click();
});

faixas.forEach((f, i) => {
  const li = document.createElement("li");
  li.tabIndex = 0;
  li.innerHTML = `<span>${f.titulo}</span><small>${f.artista}</small>`;
  li.addEventListener("click", () => carregar(i, true));
  li.addEventListener("keydown", e => { if (e.key === "Enter") carregar(i, true); });
  lista.appendChild(li);
});

audio.volume = 0.8;
carregar(0);
