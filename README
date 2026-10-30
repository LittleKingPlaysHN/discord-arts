# DISCORD-ARTS · Tarjeta de invitación para Discord

Generador de tarjetas de invitación en imagen (PNG) hecho con Node.js y [`@napi-rs/canvas`](https://github.com/Brooooooklyn/canvas). Muestra al usuario invitado y a quien lo invitó, cada uno con su avatar, su decoración de avatar y su indicador de estado, sobre un fondo personalizado con desenfoque.

## Vista previa

![Ejemplo 1](./vistarapida/invite.png)
![Ejemplo 2](./vistarapida/invite2.png)

## Características

- Avatares circulares con borde y sombra.
- Una decoración de avatar distinta para cada usuario (estilo `discord-arts`).
- Indicador de estado (`online`, `dnd`, etc.) con hueco transparente alrededor, como en Discord.
- Fondo personalizado con desenfoque y capa oscura para que el texto se lea bien.
- Fuente personalizada para el texto "FUISTE INVITADO POR".
- Todo configurable desde constantes al inicio del archivo.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- npm

## Instalación

```bash
git clone https://github.com/LittleKingPlaysHN/discord-arts.git
cd TU_REPOSITORIO
npm install @napi-rs/canvas
```

## Estructura de carpetas

```
.
├── discord-arts.js            # Script principal
├── imagenes/
│   ├── fondo.png       # Fondo personalizado
│   ├── deco.webp       # Decoración del usuario invitado
│   ├── deco2.webp      # Decoración de quien invita
│   ├── online.png      # Iconos de estado
│   ├── dnd.png
│   ├── idle.png
│   └── offline.png
├── fuentes/
│   └── fuente.otf      # Fuente para "FUISTE INVITADO POR"
└── README.md
```

> Los nombres de los iconos de estado deben coincidir con el valor `status` que le pases a la función (`online`, `dnd`, `idle`, `offline`, etc.).

## Uso

```bash
node discord-arts.js
```

Se genera un archivo `invite.png` en la misma carpeta del script.

## Créditos

Este proyecto está inspirado en el estilo visual de [**discord-arts**](https://www.npmjs.com/package/discord-arts), el paquete de npm para generar imágenes de perfil de Discord, en especial en el uso de decoraciones de avatar y el hueco alrededor del indicador de estado. Este repositorio no incluye ni usa el código de `discord-arts`; es una implementación independiente. Todo el crédito por la idea y el diseño original es de sus autores, así que si buscas algo más completo, échale un vistazo.

También se usa:

- [`@napi-rs/canvas`](https://github.com/Brooooooklyn/canvas) para dibujar las imágenes.
