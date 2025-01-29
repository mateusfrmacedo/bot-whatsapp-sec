📌 Guia de Instalação e Uso do Bot WhatsApp (Node.js)

✅ 1. Pré-requisitos

Antes de instalar e rodar o bot, é necessário ter:

Node.js (recomendado: versão 18 ou superior)
Windows: Baixe e instale aqui
macOS: Pode ser instalado via Homebrew com brew install node
Git (opcional, mas útil para gerenciar o código)
Windows: Baixe aqui
macOS: Instalado por padrão ou pode ser instalado via Homebrew (brew install git)
Google Chrome ou outro navegador baseado em Chromium atualizado (necessário para whatsapp-web.js)


🔧 2. Instalando o código

2.1 - Baixando os arquivos
Se você tem os arquivos do bot em um .zip, extraia-os para uma pasta.

Se o código estiver em um repositório Git, clone-o com:

git clone https://github.com/seu-repo/bot-whatsapp.git
cd bot-whatsapp


2.2 - Instalando dependências
Abra o terminal (CMD/PowerShell no Windows ou Terminal no macOS) e navegue até a pasta do bot:

cd caminho/para/a/pasta/do/bot
Agora, instale as dependências necessárias:

npm install
Isso instalará os pacotes usados no bot, como whatsapp-web.js, qrcode-terminal, moment e fs.

🚀 3. Rodando o bot pela primeira vez

3.1 - Iniciar o bot
Execute o seguinte comando:

node botv3.js
Se estiver usando nodemon (para recarregar automaticamente quando o código mudar), use:

npx nodemon botv3.js
3.2 - Escanear o QR Code
O terminal mostrará um QR Code.
Abra o WhatsApp no celular → Vá em Dispositivos Conectados → Conectar um dispositivo.
Escaneie o código.
O bot será autenticado e pronto para uso.
🎯 4. Instruções de Uso

📩 Enviar mensagens automáticas
O bot pode responder mensagens automaticamente.

Enviar uma saudação personalizada baseada no horário do dia.
Coletar avaliações dos usuários e salvar no arquivo avaliacoes.json.
Administradores podem monitorar e revisar essas avaliações.
⚙️ Configurações personalizáveis
Mudar o número do administrador:
Edite a variável myNumber no código ou use uma variável de ambiente:
const myNumber = process.env.ADMIN_NUMBER || 'seu_numero@c.us';
No Windows, defina a variável antes de rodar:
set ADMIN_NUMBER=5517996178834@c.us
node botv3.js
No macOS/Linux:
export ADMIN_NUMBER=5517996178834@c.us
node botv3.js
Alterar a saudação:
Edite a função getGreeting() no código para personalizar os horários de "Bom dia", "Boa tarde" e "Boa noite".
Salvar logs das mensagens recebidas:
Modifique o código para gravar mensagens em um arquivo logs.txt:
client.on('message', msg => {
    fs.appendFileSync('logs.txt', `[${new Date().toISOString()}] ${msg.from}: ${msg.body}\n`);
});
🛑 5. Parando o bot

Para parar o bot, pressione CTRL + C no terminal.

Se estiver rodando com nodemon, pode parar com CTRL + C e reiniciar com:

npx nodemon botv3.js
🔄 6. Rodando o bot automaticamente na inicialização (Opcional)

Se quiser que o bot inicie automaticamente quando ligar o computador:

Windows
Crie um arquivo .bat no mesmo diretório do bot, por exemplo, iniciar_bot.bat:
@echo off
cd /d C:\caminho\para\o\bot
node botv3.js
Adicione esse arquivo ao Inicializar do Windows (shell:startup no Executar).
macOS
Crie um script .sh e adicione ao crontab para iniciar o bot automaticamente.

📌 7. Solução de Problemas

❌ Erro: QR Code não aparece
Verifique se o WhatsApp Web está funcionando no seu navegador.
Teste rodar o bot com headless: false no puppeteer para ver o navegador abrir:
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: false }
});
❌ Erro de autenticação expirada
Delete a pasta ~/.wwebjs_auth (Linux/macOS) ou C:\Users\seu-usuario\.wwebjs_auth (Windows) e reconecte o WhatsApp.
