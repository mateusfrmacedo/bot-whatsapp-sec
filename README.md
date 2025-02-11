
![img](https://github.com/user-attachments/assets/bbc8844d-7ccd-45d9-a719-a9fed8562005)

📌 Guia de Instalação e Uso do Bot WhatsApp

✅ 1. Pré-requisitos

Antes de instalar e rodar o bot, é necessário ter:

Node.js (recomendado: versão 18 ou superior)
Windows: Baixe e instale aqui https://nodejs.org/

macOS: Pode ser instalado via Homebrew com brew install node

🔧 2. Instalando o código

2.1 - Baixando os arquivos
Se você tem os arquivos do bot em um .zip, extraia-os para uma pasta.

git clone https://github.com/mateusfrmacedo/bot-whatsapp-sec

2.2 - Instalando dependências
Abra o terminal (CMD/PowerShell no Windows ou Terminal no macOS) e navegue até a pasta do bot:

cd caminho/para/a/pasta/do/bot
Agora, instale as dependências necessárias:

- npm install
Isso instalará os pacotes usados no bot, como 
whatsapp-web.js, 
qrcode-terminal,
moment e fs.

🚀 3. Rodando o bot pela primeira vez

3.1 - Iniciar o bot
Execute o seguinte comando:

node bot.js

Se estiver usando nodemon (para recarregar automaticamente quando o código mudar), use:

npx nodemon bot.js

3.2 - Escanear o QR Code
O terminal mostrará um QR Code.
Abra o WhatsApp no celular → Vá em Dispositivos Conectados → Conectar um dispositivo.
Escaneie o código.
O bot será autenticado e pronto para uso.

🎯 4. Instruções de Uso

📩 Enviar mensagens automáticas
O bot pode responder mensagens automaticamente.

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

