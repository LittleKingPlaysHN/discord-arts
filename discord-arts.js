const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const WIDTH = 1100;
const HEIGHT = 420;

const INVITED_AVATAR = 'https://cdn.discordapp.com/embed/avatars/0.png';
const INVITER_AVATAR = 'https://cdn.discordapp.com/embed/avatars/3.png';

const INVITED_DECORATION = 'deco1.webp';
const INVITER_DECORATION = 'deco2.webp';

const BACKGROUND_FILENAME = 'fondo.png';
const BG_BLUR = 8;       
const BG_DARKEN = 0.45; 

const TITLE_FONT_FILE = 'fuente.otf';
const TITLE_FONT_FAMILY = 'TitleFont';
const TITLE_FONT_SIZE = 32;

const STATUS_GAP = 5;
const STATUS_ICON_SCALE = 0.75;
const STATUS_HOLE_SCALE = 0.55;
const TEXT_GAP = 42;

const fontPath = path.join(__dirname, 'fuentes', TITLE_FONT_FILE);
if (fs.existsSync(fontPath)) {
    GlobalFonts.registerFromPath(fontPath, TITLE_FONT_FAMILY);
} else {
    console.warn(`[CANVAS] - No se encontró la fuente: ${fontPath} (se usará Arial)`);
}

function roundedRect(ctx, x, y, w, h, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fill();
}

async function drawBlurredBackground(ctx) {
    const px = 15, py = 15, pw = 1070, ph = 390;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph, 30);
    ctx.clip();

    const bgPath = BACKGROUND_FILENAME
        ? path.join(__dirname, 'imagenes', BACKGROUND_FILENAME)
        : null;

    if (bgPath && fs.existsSync(bgPath)) {
        const bg = await loadImage(bgPath);

        const bleed = BG_BLUR * 3;
        const dx = px - bleed, dy = py - bleed;
        const dw = pw + bleed * 2, dh = ph + bleed * 2;

        const scale = Math.max(dw / bg.width, dh / bg.height);
        const w = bg.width * scale;
        const h = bg.height * scale;
        const x = dx + (dw - w) / 2;
        const y = dy + (dh - h) / 2;

        ctx.filter = `blur(${BG_BLUR}px)`;
        ctx.drawImage(bg, x, y, w, h);
        ctx.filter = 'none';

        ctx.fillStyle = `rgba(15,17,30,${BG_DARKEN})`;
        ctx.fillRect(px, py, pw, ph);
    } else {
        if (BACKGROUND_FILENAME) {
            console.warn(`[CANVAS] - No se encontró el fondo: ${bgPath}`);
        }
        ctx.fillStyle = '#343955';
        ctx.fillRect(px, py, pw, ph);
    }

    ctx.restore();
}

async function drawAvatarWithStatusAndDecoration(ctx, imgUrl, decorationFile, x, y, radius, status = 'online') {
    const img = await loadImage(imgUrl);

    const layer = createCanvas(WIDTH, HEIGHT);
    const lctx = layer.getContext('2d');

    lctx.save();

    lctx.shadowColor = 'rgba(0,0,0,0.4)';
    lctx.shadowBlur = 20;
    lctx.shadowOffsetY = 6;

    lctx.beginPath();
    lctx.arc(x, y, radius + 6, 0, Math.PI * 2);
    lctx.fillStyle = '#ffffff';
    lctx.fill();

    lctx.shadowColor = 'transparent';

    lctx.beginPath();
    lctx.arc(x, y, radius, 0, Math.PI * 2);
    lctx.clip();

    lctx.drawImage(img, x - radius, y - radius, radius * 2, radius * 2);

    lctx.restore();

    if (decorationFile) {
        const decorationPath = path.join(__dirname, 'imagenes', decorationFile);
        if (fs.existsSync(decorationPath)) {
            const decImg = await loadImage(decorationPath);
            const decSize = radius * 2.35;
            lctx.drawImage(decImg, x - decSize / 2, y - decSize / 2, decSize, decSize);
        } else {
            console.warn(`[CANVAS] - No se encontró la decoración: ${decorationPath}`);
        }
    }

    const statusCX = x + radius * 0.825;
    const statusCY = y + radius * 0.825;

    const holeRadius = (radius * STATUS_HOLE_SCALE) / 2 + STATUS_GAP;

    lctx.save();
    lctx.globalCompositeOperation = 'destination-out';
    lctx.beginPath();
    lctx.arc(statusCX, statusCY, holeRadius, 0, Math.PI * 2);
    lctx.fillStyle = '#000000';
    lctx.fill();
    lctx.restore();
    ctx.drawImage(layer, 0, 0);
    const statusPath = path.join(__dirname, 'imagenes', `${status}.png`);
    if (fs.existsSync(statusPath)) {
        const statusImg = await loadImage(statusPath);
        const iconSize = radius * STATUS_ICON_SCALE;
        ctx.drawImage(
            statusImg,
            statusCX - iconSize / 2,
            statusCY - iconSize / 2,
            iconSize,
            iconSize
        );
    }
}

async function main() {
    console.log('[CANVAS] -Generando tarjeta...');

    const userInvitado = '@vergota';
    const userInviter = '@littlekingplays';

    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1e212b';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    roundedRect(ctx, 5, 5, 1090, 410, 35, '#5896f2');

    await drawBlurredBackground(ctx);

    const gradient = ctx.createLinearGradient(0, 15, 0, 405);
    gradient.addColorStop(0, 'rgba(255,255,255,0.08)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.15)');
    roundedRect(ctx, 15, 15, 1070, 390, 30, gradient);

    roundedRect(ctx, 380, 35, 340, 45, 18, 'rgba(10,12,25,0.55)');

    ctx.textAlign = 'center';
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#c6c9ff';
    ctx.fillText('INVITACIÓN REGISTRADA', 550, 63);

    await drawAvatarWithStatusAndDecoration(ctx, INVITED_AVATAR, INVITED_DECORATION, 200, 210, 110, 'online');
    await drawAvatarWithStatusAndDecoration(ctx, INVITER_AVATAR, INVITER_DECORATION, 900, 210, 110, 'offline');

    ctx.textBaseline = 'middle';
    const centerY = 210;

    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(userInvitado, 550, centerY - TEXT_GAP);

    ctx.font = `${TITLE_FONT_SIZE}px "${TITLE_FONT_FAMILY}", Arial`;
    ctx.fillStyle = '#b9bdff';
    ctx.fillText('FUISTE INVITADO/A POR', 550, centerY);

    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#7f8aff';
    ctx.fillText(userInviter, 550, centerY + TEXT_GAP);

    ctx.textBaseline = 'alphabetic';

    const output = path.join(__dirname, 'invite.png');
    const buffer = await canvas.encode('png');

    fs.writeFileSync(output, buffer);

    console.log('[CANVAS] - Imagen generada correctamente.');
    console.log(`[CANVAS] - Ubicación: ${output}`);
}

main().catch(error => {
    console.error('[CANVAS] - Error:', error);
});