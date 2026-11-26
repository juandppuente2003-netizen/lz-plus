# LZ-PLUS

App de TV para películas, series, anime y canales en vivo. Se maneja con el control remoto.

## Instalar en Android TV / Google TV

1. En la TV instala la app **Downloader** (de AFTVnews) desde Google Play.
2. Permite que Downloader instale apps: *Ajustes → Privacidad/Seguridad → Fuentes desconocidas → Downloader*.
3. En Downloader escribe el link de la descarga directa (está en la sección **Releases** de este repositorio):
   `https://github.com/juandppuente2003-netizen/lz-plus/releases/latest/download/LZ-PLUS.apk`
4. Instala y abre **LZ-PLUS** desde el inicio de la TV.

Cada vez que se actualiza `lz-plus.html` en la rama `main`, GitHub compila una versión nueva sola
(pestaña **Actions**) y la publica en el mismo link.

## Tu configuración con un código

1. En la PC: LZ-PLUS → Ajustes → **Crear mi código** (descarga `NNNNNN.json`).
2. Súbelo aquí: https://github.com/juandppuente2003-netizen/lz-plus/upload/main/configs
3. En cada TV escribe ese código en la bienvenida (o en Ajustes → Traer con código o link).

## Windows

Descarga `LZ-PLUS-Windows-instalador.exe` desde **Releases**. Trae adentro el intermediario y FFmpeg: no hace falta abrir nada más.

## Archivos

- `lz-plus.html` — la app (también funciona en un navegador).
- `android/` — la app de Android TV (abre la app y usa un reproductor nativo que lee MKV, HEVC, etc.).
- `lz-servidor.js`, `INICIAR-LZ-PLUS.bat`, `PERMITIR-EN-RED.bat` — opcional, solo si usas la app en un navegador.
