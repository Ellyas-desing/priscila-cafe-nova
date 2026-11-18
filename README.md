# Priscila Café

Landing page estática, responsiva e sem dependências de instalação.

## Estrutura

```text
priscila-cafe/
├── index.html
├── README.md
└── assets/
    ├── css/styles.css
    └── js/main.js
```

## Como usar

1. Abra `index.html` no navegador ou publique a pasta inteira em uma hospedagem estática.
2. Pesquise pelos marcadores entre colchetes no HTML para configurar WhatsApp, Instagram, Maps, endereço, horários, preços e cardápio.
3. Antes de publicar, substitua as fotos externas identificadas como `FOTO DE REFERÊNCIA` por imagens próprias ou devidamente licenciadas.

## Estilo

Referência: ORYZO (darkroom editorial). Fundo nogueira `#100904`, texto creme `#ffedd7`, títulos em caixa alta peso 500 com entrelinha .9, divisórias tracejadas, sem sombras. Laranja `#dc5000` só em créditos e link. Fonte Inter (substitui a Halyard).

## Celular

Testado em 440×956 (iPhone 16 Pro Max): sem rolagem lateral, `viewport-fit=cover` e áreas seguras (notch/home bar) respeitadas.

## Código

CSS puro + ~100 linhas de JS (um `requestAnimationFrame` no scroll): parallax no hero, xícara que enche (Processo), marquee, texto que acende por palavra, cards 3D e botões magnéticos. Respeita `prefers-reduced-motion`.

As fotos externas foram trocadas por ilustrações SVG próprias; coloque fotos reais dos pratos quando tiver.
