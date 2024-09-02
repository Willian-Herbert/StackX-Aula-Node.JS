const readline = require('readline');
const fileSystem = require('fs');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const leitor = readline.createInterface(
    {
        input: process.stdin,
        output: process.stdout,
    }
);

function programaPrincipal() {
    leitor.question('Digite o nome do arquivo em formato de texto: ', (nomeDoArquivo) => {

        const arquivo = nomeDoArquivo.toLowerCase();

        //Quanto tempo demorou a execução;
        console.time('- Quanto tempo demorou a execução');

        async function lerArquivo() {
            await fileSystem.readFile(arquivo, 'utf8', (erro, dados) => {
                if (erro) {
                    console.log(erro);
                    leitor.close();
                    return;
                }

                const linhasArquivo = dados.split(/\r?\n/);
                let linhasComNumeros = 0;
                let somaNumeros = 0;
                let linhasComTexto = 0;
                let numerosArquivo = [];

                for (i = 0; i < linhasArquivo.length; i++) {
                    //Linhas somente com números
                    if (/^\d+$/.test(linhasArquivo[i])) {
                        linhasComNumeros++;
                        somaNumeros += parseInt(linhasArquivo[i]);
                    }

                    //Linhas com strings
                    if (!(/^\d+$/.test(linhasArquivo[i]))) {
                        linhasComTexto++;
                    }

                    numerosArquivo.push(Number(linhasArquivo[i].replace(/[^0-9]/g, '')));
                }

                let somaTodosNumeros = numerosArquivo.reduce((acumulador, valor) => acumulador + valor);

                let resumo = {
                    linhasComNumeros: linhasComNumeros,
                    somaNumeros: somaNumeros,
                    somaTodosNumeros: somaTodosNumeros,
                    linhasComTexto: linhasComTexto,
                };

                eventEmitter.emit('exibirResumo', resumo);

                //Quanto tempo demorou a execução;
                console.timeEnd('- Quanto tempo demorou a execução');

                solicitarExecucao();
            });
        }

        lerArquivo();
    });
}

function exibirResumo(resumo) {
    console.log('\n- - - - - - - - - - - Resumo - - - - - - - - - - -')
    //Quantidade de linhas que possuem apenas números
    console.log(`- O arquivo tem ${resumo.linhasComNumeros} linhas que possuem apenas números.`);

    //Soma dos números onde as linhas contém apenas números
    console.log(`- A soma dos números dessas linhas é: ${resumo.somaNumeros}.`);

    //Soma dos números do arquivo
    console.log(`- Soma dos números dentro deste arquivo: ${resumo.somaTodosNumeros}`);

    //Linhas com texto
    console.log(`- Quantas linhas continham texto: ${resumo.linhasComTexto}`);
};

function solicitarExecucao() {

        leitor.question('\nDeseja executar o programa novamente [S/N]?', (resposta) => {
            let respostaFiltrada = resposta.toUpperCase().charAt(0)
    
            if (respostaFiltrada == 'S') {
                eventEmitter.emit('respostaSim');
            }
            else if (respostaFiltrada == 'N') {
                eventEmitter.emit('respostaNao')
            } 
            else {
                eventEmitter.emit('respostaInvalida')
            }
        });  
};

function executarProgramaPrincipal() {
    programaPrincipal();
};

function encerrarProgramaPrincipal() {
    console.log('Programa Encerrado...')
    leitor.close();
};

function processarRespostaInvalida() {
    console.log('Responda somente S ou N.');
    solicitarExecucao();
};

// Evento
eventEmitter.on('exibirResumo', (resumo) => {
    exibirResumo(resumo);
});

eventEmitter.on('respostaSim', () => {
    executarProgramaPrincipal();
});

eventEmitter.on('respostaNao', () => {
    encerrarProgramaPrincipal();
});

eventEmitter.on('respostaInvalida', () => {
    processarRespostaInvalida();
});

executarProgramaPrincipal();