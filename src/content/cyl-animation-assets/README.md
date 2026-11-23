# CYL · Assets vetoriais para animação 2D

O mestre reproduz por traçado vetorial a pose em 3/4 da figura principal da prancha anexada. O acabamento foi simplificado em curvas e áreas de cor editáveis. O contorno dos cachos, o rosto, a armação, a expressão semicerrada, o bigode, a barbicha e o fone seguem essa figura. A mão aberta e as superfícies escondidas nas articulações foram completadas para permitir o aceno.

A figura principal da prancha tem a cabeça mais alta do que a faixa indicativa de 40–50% quando a medição inclui os cachos. A pose vetorial segue a proporção visível da figura. As cores seguem os roxos da prancha com variações vetoriais de luz e sombra.

## Arquivos

| Arquivo | Uso |
| --- | --- |
| `cyl-master.svg` | Mestre editável com grupos nomeados, articulações e variantes de mão. |
| `cyl-preview.png` | Prévia RGBA da pose padrão, com o fundo circular desligado. |
| `cyl-layer-map.json` | Hierarquia, ordem de pintura, pivôs, arquivos e visibilidade inicial. |
| `parts/*.svg` | Peças vetoriais exportadas no mesmo quadro do mestre. |

## Reconstrução

1. Importe o mestre com o quadro `viewBox="-15 40 580 870"`. Cada peça individual compartilha o quadro e o registro do mestre, com posição inicial `[0,0]`. Preserve a origem ao exportar ou importar. O eixo Y cresce para baixo.
2. Para reconstruir com os SVGs individuais, use `layers` e `drawOrder` do JSON. A ordem vai de trás para a frente. Monte a árvore segundo `parent` e mantenha a ordem relativa dos irmãos. Peças com `fileIncludesChildren: true` incluem uma composição para uso isolado. Na reconstrução por folhas, monte esses grupos como contêineres e importe os filhos listados no mapa.
3. Importe as definições de preenchimento de cada arquivo, ou reutilize o bloco `defs` do mestre quando inserir as peças na mesma árvore SVG. Ao inserir somente os grupos de um arquivo individual, preserve o `clipPath` interno dos cachos.
4. Para ativar o fundo lilás, remova `display="none"` de `background`. Ele ocupa a primeira posição de pintura. O fundo externo é transparente.

## Articulações

| Articulação | Grupo que gira | Pivô no mestre |
| --- | --- | --- |
| Pescoço | `head` | `298, 536` |
| Ombro direito | `arm-right-upper` | `245, 560` |
| Cotovelo direito | `arm-right-forearm` | `179, 619` |
| Pulso direito | `hand-right-rest` | `230, 672` |
| Ombro esquerdo | `arm-left-upper` | `343, 555` |
| Cotovelo esquerdo | `arm-left-forearm` | `396, 617` |
| Pulso esquerdo | `hand-left-rest` ou `hand-left-wave` | `432, 596` |

Direito e esquerdo são os lados anatômicos do CYL. Na pose base, o braço esquerdo aparece à direita da imagem. As peças dos braços incluem extensões sob os ombros, cotovelos e pulsos para manter a área coberta ao girar. A rotação da cabeça carrega cabelo, fone, olhos, óculos e pelos faciais.

## Aceno no navegador

Inclua o mestre como SVG inline para acessar os grupos pelo DOM. As rotações SVG usam graus e recebem o pivô no próprio atributo, como `rotate(44 396 617)`. Os filhos herdam o movimento dos pais.

```js
const svg = document.querySelector('#cyl svg');
const part = (id) => svg.querySelector(`#${id}`);

function rotate(id, degrees) {
  const group = part(id);
  const { pivotX, pivotY } = group.dataset;
  group.setAttribute('transform', `rotate(${degrees} ${pivotX} ${pivotY})`);
}

// Pose de aceno para usar como ponto de partida dos keyframes.
part('hand-left-rest').setAttribute('display', 'none');
part('hand-left-wave').removeAttribute('display');
rotate('arm-left-upper', -34);
rotate('arm-left-forearm', 44);
rotate('hand-left-wave', 17);
```

Parta de zero nos três ângulos para a pose base. Na subida, faça a troca da mão durante o movimento do antebraço, depois oscile o pulso em torno da pose de aceno. Inverta a sequência para voltar à mão padrão. Mantenha a troca de mãos discreta durante o movimento. As mãos são peças rígidas intercambiáveis e os dedos compartilham a curva da mão.

Para fechar os olhos, use `eyelids` como camada de traço, oculte `eyes` e substitua as curvas da pálpebra pela expressão desejada. Para look lateral extremo ou movimento que exponha todo o interior de um ombro ou cotovelo, ajuste as junções usando os prolongamentos das formas como base.
