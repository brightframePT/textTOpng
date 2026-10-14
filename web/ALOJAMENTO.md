# Publicar a web app

1. Extrai o ZIP textTOpng-web.zip.
2. Abre https://app.netlify.com/drop e entra na tua conta.
3. Arrasta a pasta extraída que contém index.html, app.js, style.css e assets.
4. O Netlify disponibiliza um endereço HTTPS. Podes mudar o nome nas definições do site e associar um domínio próprio.

Também podes enviar estes ficheiros para a pasta pública de um alojamento existente (public_html, www ou equivalente). Mantém a pasta assets e os nomes dos ficheiros. Não há build, backend, base de dados ou chaves de API.

Para testar localmente: na pasta web, executa `python -m http.server 8000` e abre o endereço local indicado pelo comando.

Os CSVs e títulos são processados no browser; o pacote não contém os dados do evento. A ligação direta ao Airtable não está implementada: exporta a vista para CSV. PNGs gerados nesta app podem diferir ligeiramente dos gerados por Pillow ou After Effects na rasterização e sombra.
