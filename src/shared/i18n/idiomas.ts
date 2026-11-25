// Idiomas do site. Lógica pura (sem navegador), usada no build (vite.config.ts), no seletor e na detecção.
// Decisão e motivos: docs/decisoes/idiomas.md.

/** Código usado no endereço (/en/, /zh/...). O português é o idioma original e vive na raiz, sem prefixo. */
export type CodigoIdioma = "pt" | "en" | "zh" | "hi" | "es" | "fr" | "ar" | "bn" | "ru" | "ur";

export type Idioma = {
  codigo: CodigoIdioma;
  /** Valor do atributo lang e do hreflang. */
  bcp47: string;
  /** Valor de og:locale. */
  og: string;
  /** Nome do idioma escrito no próprio idioma (é o que aparece na lista do botão). */
  nome: string;
  /** Sigla curta mostrada no botão. */
  sigla: string;
  /** Escrita da direita para a esquerda. */
  rtl: boolean;
  /** Usado em toLocaleString (números, datas). */
  formato: string;
};

/** Os 10 idiomas mais falados do mundo. A ordem é a da lista do botão. */
export const idiomas: readonly Idioma[] = [
  { codigo: "pt", bcp47: "pt-BR", og: "pt_BR", nome: "Português", sigla: "PT", rtl: false, formato: "pt-BR" },
  { codigo: "en", bcp47: "en", og: "en_US", nome: "English", sigla: "EN", rtl: false, formato: "en-US" },
  { codigo: "es", bcp47: "es", og: "es_ES", nome: "Español", sigla: "ES", rtl: false, formato: "es-ES" },
  { codigo: "fr", bcp47: "fr", og: "fr_FR", nome: "Français", sigla: "FR", rtl: false, formato: "fr-FR" },
  { codigo: "zh", bcp47: "zh-Hans", og: "zh_CN", nome: "中文", sigla: "ZH", rtl: false, formato: "zh-CN" },
  { codigo: "hi", bcp47: "hi", og: "hi_IN", nome: "हिन्दी", sigla: "HI", rtl: false, formato: "hi-IN" },
  { codigo: "ar", bcp47: "ar", og: "ar_AR", nome: "العربية", sigla: "AR", rtl: true, formato: "ar" },
  { codigo: "bn", bcp47: "bn", og: "bn_BD", nome: "বাংলা", sigla: "BN", rtl: false, formato: "bn-BD" },
  { codigo: "ru", bcp47: "ru", og: "ru_RU", nome: "Русский", sigla: "RU", rtl: false, formato: "ru-RU" },
  { codigo: "ur", bcp47: "ur", og: "ur_PK", nome: "اردو", sigla: "UR", rtl: true, formato: "ur-PK" },
];

export const idiomaOriginal: CodigoIdioma = "pt";
/** Quem pede um idioma que o site não tem recebe este. */
export const idiomaReserva: CodigoIdioma = "en";

export const codigos = idiomas.map((i) => i.codigo);

export function eIdioma(valor: unknown): valor is CodigoIdioma {
  return typeof valor === "string" && codigos.includes(valor as CodigoIdioma);
}

export function dadosDoIdioma(codigo: CodigoIdioma): Idioma {
  return idiomas.find((i) => i.codigo === codigo) ?? idiomas[0];
}

/**
 * Escolhe o idioma pela lista de preferências do navegador (`navigator.languages`, em ordem de preferência).
 * Vale o primeiro da lista que o site tem (pt-BR e pt-PT viram pt; zh-TW e zh-CN viram zh).
 * Se nenhum estiver entre os 10, o resultado é o inglês.
 */
export function idiomaDasPreferencias(preferencias: readonly string[] | undefined): CodigoIdioma {
  for (const bruto of preferencias ?? []) {
    const primeiro = String(bruto).toLowerCase().split(/[-_]/)[0];
    if (eIdioma(primeiro)) return primeiro;
  }
  return idiomaReserva;
}

/** Prefixo do endereço: "" para o português, "/en" para o inglês. */
export function prefixoDoIdioma(codigo: CodigoIdioma): string {
  return codigo === idiomaOriginal ? "" : `/${codigo}`;
}

/** Endereço de uma página em um idioma. `caminho` começa com "/" e pode levar ?busca e #âncora. */
export function enderecoNoIdioma(caminho: string, codigo: CodigoIdioma): string {
  if (!caminho.startsWith("/") || caminho.startsWith("//")) return caminho;
  return `${prefixoDoIdioma(codigo)}${caminho}`;
}

/** Tira o prefixo de idioma de um caminho (/en/termos/ vira /termos/) e diz de qual idioma ele era. */
export function separarIdioma(caminho: string): { idioma: CodigoIdioma; caminho: string } {
  const m = /^\/([a-z]{2})(\/.*)?$/.exec(caminho);
  if (m && m[1] !== idiomaOriginal && eIdioma(m[1])) return { idioma: m[1], caminho: m[2] ?? "/" };
  return { idioma: idiomaOriginal, caminho };
}
