// Edite aqui os dados de contato e os valores usados no orçamento.
export const CONTACT = {
  whatsapp: "5500000000000", // DDI + DDD + número, só dígitos
  email: "contato@cyldev.com.br",
  instagram: "https://instagram.com/cyldev",
  linkedin: "https://linkedin.com/in/cyldev",
};

export const waLink = (msg: string) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;
