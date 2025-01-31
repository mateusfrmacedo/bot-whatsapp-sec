const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const moment = require('moment');
const xlsx = require('xlsx');
const cron = require('node-cron');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

// Estados do usuário e timeouts
const userStates = new Map();
const userTimeouts = new Map();

// Estados de avaliação dos usuários
const userRated = new Map();

// Número do administrador
const myNumber = '5517996178834@c.us';

// Armazenar avaliações
const saveRating = (rating, user) => {
    const data = { rating, timestamp: new Date().toISOString() };
    fs.appendFile('avaliacoes.json', JSON.stringify(data) + ',\n', (err) => {
        if (err) console.error('Erro ao salvar avaliação:', err);
    });
    userRated.set(user, true);
};

// Função para determinar a saudação
const getGreeting = () => {
    const hour = moment().hour();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
};

// Respostas pré-definidas COMPLETAS
const responses = {
    1: `INÍCIO DAS AULAS\nAs aulas começarão no dia 10 de fevereiro de 2025. O transporte escolar estará disponível a partir dessa data.\n\nATENÇÃO\nDe 3 a 7 de fevereiro, as escolas estarão abertas para retirada dos kits de material escolar.`,
    2: `Av. Vereador Osvaldo Kushida Nº536 - Centro\nOrindiuva - 15480-003 - São Paulo - Brasil\nWhatsApp (17) 99617-8834\nE-mail: educacao@orindiuva.sp.gov.br\nwww.educacao-orindiuva.com\n\nHorário de funcionamento: Segunda a Sexta, das 8h às 17h.`,
    3: `Veja a lista de materiais acessando o link:\nhttps://www.educacao-orindiuva.com/lista-de-materiais`,
    4: `Para realizar o cadastro do transporte universitário São José do Rio Preto/Votuporanga acesse:\nbit.ly/cadastro-transporte-escolar`,
    5: `Para realizar o cadastro do transporte Escolar (ETEC) São José do Rio Preto:\nbit.ly/Transporte-Educacional-Orindiuva`,
    6: `ATIVIDADES EXTRA COMPLEMENTARES*\nAtividades opcionais como judô, karatê, balé, futebol, futsal e vôlei.\nInscreva-se até 27/01 pelo link:\nwww.educacao-orindiuva.com/escola-tempo-integral`,
    7: `*DOCUMENTOS NECESSÁRIOS PARA MATRÍCULAS*\n\n⬤ DOCUMENTO DE TRANSFERÊNCIA\n(histórico escolar ou declaração da escola de origem com boletim)\n⬤ FOTO 3X4 \n⬤ CÓPIA CERTIDÃO NASCIMENTO\n⬤ CÓPIA RG e CPF\n⬤ COMPROVANTE DE ENDEREÇO`,
    8: `Vou encaminhar você para um atendente. Aguarde um momento.`
};

// Função para ler o arquivo Excel e verificar aniversariantes
const checkBirthdays = () => {
    const workbook = xlsx.readFile('funcionarios.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const today = moment().format('MM-DD');
    data.forEach(employee => {
        const birthday = moment(employee['Data de Nascimento']).format('MM-DD');
        if (birthday === today) {
            const firstName = employee['Nome'].split(' ')[0]; // Pega o primeiro nome
            const message = `${firstName}, Feliz Aniversário! Desejamos a você um dia cheio de alegria e realizações. Sua dedicação à educação é admirável e inspiradora. Que este novo ano de vida lhe traga muito sucesso, alegrias e paz. 🎂🎉🥳🎈💚\n\nCom carinho,\nSecretaria Municipal de Educação de Orindiuva.`;
            client.sendMessage(`${employee['Numero de WhatsApp']}@c.us`, message);
        }
    });
};

// Agendar a verificação diária às 8h da manhã
cron.schedule('0 8 * * *', checkBirthdays);

client.on('qr', qr => qrcode.generate(qr, { small: true }));

client.on('ready', () => console.log('Bot iniciado!'));

client.on('message', async msg => {
    // Ignorar grupos
    if (msg.from.endsWith('@g.us')) return;

    const user = msg.from;

    // Verificar se você enviou a mensagem (substitua pelo seu número)
    if (user === myNumber) return;

    const currentState = userStates.get(user) || 'initial';

    // Resetar timeout
    clearTimeout(userTimeouts.get(user));
    userTimeouts.set(user, setTimeout(() => {
        if (!userRated.get(user)) {
            client.sendMessage(user, `⌛ *Chat inativo*\n\nSua avaliação é muito importante para melhorarmos nosso atendimento.\n\nDê uma nota entre 1 e 5.\n5. 😍 Excelente!\n4. 😃 Gostei!\n3. 😑 Poderia melhorar!\n2. 🙁 Não Gostei!\n1. 😡 Ruim!`);
            userStates.set(user, 'rating');
        } else {
            userStates.set(user, 'initial');
        }
    }, 300000)); // 5 minutos

    if (currentState === 'initial') {
        const greeting = getGreeting();
        client.sendMessage(user,
            `${greeting}! Bem-vindo à Secretaria Municipal de Educação de Orindiúva. Em que posso te ajudar hoje?\n\n` +
            `Escolha uma opção:\n\n` +
            `1️⃣ - Volta às aulas\n` +
            `2️⃣ - Horário de funcionamento e endereço\n` +
            `3️⃣ - Lista de material escolar\n` +
            `4️⃣ - Cadastro transporte universitário\n` +
            `5️⃣ - Cadastro transporte escolar (ETEC diurno)\n` +
            `6️⃣ - Atividades extras complementares\n` +
            `7️⃣ - Documentos para matrícula\n` +
            `8️⃣ - Falar com um atendente`
        );
        userStates.set(user, 'main_menu');
    }
    else if (currentState === 'main_menu') {
        const option = parseInt(msg.body);

        if (option === 8) {
            client.sendMessage(user, 'Você escolheu falar com um atendente. Aguarde um momento.');
            userStates.set(user, 'waiting_attendant'); // Estado para "aguardando atendente"
            return;
        } 
        else if (responses[option]) {
            client.sendMessage(user, responses[option]).then(() => {
                if (option !== 8) {
                    client.sendMessage(user, `\n\nDê uma nota entre 1 e 5 para nosso atendimento:\n` +
                    `5. 😍 Excelente!\n4. 😃 Gostei!\n3. 😑 Poderia melhorar!\n` +
                    `2. 🙁 Não Gostei!\n1. 😡 Ruim!`);
                    userStates.set(user, 'rating');
                }
            });
        }
    }
    else if (currentState === 'waiting_attendant') {
        // Enquanto o usuário estiver no estado "aguardando atendente", o bot não responde
        return;
    }
    else if (currentState === 'rating') {
        const rating = parseInt(msg.body);
        if (rating >= 1 && rating <= 5) {
            saveRating(rating, user);
            client.sendMessage(user, 'Obrigado por sua avaliação! A *Secretaria de Educação de Orindiúva* agradece seu contato!\nAté logo 👋').then(() => {
                // Definir o estado do usuário como inativo por 3 minutos
                userStates.set(user, 'inactive');
                setTimeout(() => {
                    userStates.set(user, 'initial');
                }, 180000); // 3 minutos
            });
        }
    }
});

client.initialize();