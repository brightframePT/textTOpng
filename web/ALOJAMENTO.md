# Publicar a web app

1. Extrai o ZIP textTOpng-web.zip.
2. Abre https://app.netlify.com/drop e entra na tua conta.
3. Arrasta a pasta extraída que contém index.html, app.js, style.css e assets.
4. O Netlify disponibiliza um endereço HTTPS. Podes mudar o nome nas definições do site e associar um domínio próprio.

Também podes enviar estes ficheiros para a pasta pública de um alojamento existente (public_html, www ou equivalente). Mantém a pasta assets e os nomes dos ficheiros. Não há build, backend, base de dados ou chaves de API.

Para testar localmente: na pasta web, executa `python -m http.server 8000` e abre o endereço local indicado pelo comando.

Os CSVs e títulos são processados no browser; o pacote não contém os dados do evento. A ligação direta ao Airtable não está implementada: exporta a vista para CSV. PNGs gerados nesta app podem diferir ligeiramente dos gerados por Pillow ou After Effects na rasterização e sombra.

## Formatos de ecrã

- Plenary A/B: 5632 × 1792 px.
- LAB 1: 24576 × 1792 px.
- LAB 2, 3, 4 e 5: 3360 × 1344 px.
- Dome / Pitch: 2016 × 1008 px.

Escolhe o filtro de palco e deixa o formato em Automático pelo palco. O ZIP usa as dimensões de cada sessão e regista-as no manifesto. Podes escolher um formato explícito ou Personalizado para outros casos. Palcos sem formato conhecido não são exportados automaticamente. Os 23 registos apenas Plenary continuam sem formato automático até confirmação.

Os valores de fonte, posição, escala, limite de caracteres e entrelinha são comuns às sessões e continuam provisórios para Labs/Dome. O LAB 1 requer um browser com suporte para canvas de 24576 px; foi validado em Chromium de computador. Em dispositivos com limites menores, a app apresenta um erro.
