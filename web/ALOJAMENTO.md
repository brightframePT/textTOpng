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

## Comparar versões do CSV

1. Importa o CSV novo no botão principal.
2. Abre Comparar com um CSV anterior e importa a versão anterior.
3. Consulta os novos, alterados, removidos e iguais.
4. Ativa Mostrar e exportar só novos / alterados. O filtro de palco continua a aplicar-se.
5. Exporta os PNGs em ZIP ou descarrega o relatório JSON completo.

Mantém uma coluna de IDs únicos em ambos os ficheiros: Session Record ID (preferida) ou Shorthand Session Record ID. A comparação ignora a ordem das linhas e considera apenas título e palco. Mudanças de palco também exigem atualizar o PNG. Sem IDs únicos, a app explica o problema e mantém a exportação normal disponível. Os removidos são listados para removeres os ficheiros antigos manualmente; não é gerado um PNG para eles. Exporta sempre a mesma vista, pois registos ausentes na nova exportação são tratados como removidos.

Os CSVs não são guardados quando fechas ou recarregas a página. Conserva a versão anterior no teu computador. Os PNGs com IDs disponíveis passam a usar o ID como nome estável. Como as versões anteriores da app usavam títulos no nome, faz uma exportação completa uma vez para começar a usar esta convenção. Mudanças às definições de fonte, posição ou composição exigem uma exportação completa, mesmo sem alterações no CSV.
