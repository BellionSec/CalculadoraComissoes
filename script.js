document.addEventListener('DOMContentLoaded', function() {
    // Função para formatar um número para o padrão monetário brasileiro: 1.118,00
    function formatarNumeroEmReais(numero) {
        // Garantir que o número seja tratado como número
        let num = typeof numero === 'string' ? parseFloat(numero.replace(',', '.')) : Number(numero);
        
        // Converter para string com 2 casas decimais
        let valorStr = num.toFixed(2);
        
        // Separar parte inteira e decimal
        let partes = valorStr.split('.');
        let parteInteira = partes[0];
        let parteDecimal = partes[1];
        
        // Adicionar pontos como separadores de milhar
        parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        // Juntar as partes usando vírgula como separador decimal
        return parteInteira + ',' + parteDecimal;
    }
    
    // Função para formatar valores monetários no padrão brasileiro (1.500,00)
    function formatarMoeda(valor) {
        return formatarNumeroEmReais(valor);
    }
    
    // Garantir que a página sempre role para o topo ao ser carregada
    window.onload = function() {
        window.scrollTo(0, 0);
    };
    
    // Desativar a restauração automática da posição de scroll
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    // Aplicar estilos para mobile em elementos de detalhes
    function aplicarEstilosMobile() {
        // Verificar se está em modo mobile
        if (window.innerWidth <= 480) {
            // Selecionar todas as linhas de detalhes
            const linhasDetalhes = document.querySelectorAll('.detail-block .detail-row, .professional-result .detail-row');
            
            // Aplicar estilos diretamente
            linhasDetalhes.forEach(linha => {
                linha.style.display = 'flex';
                linha.style.flexDirection = 'column';
                linha.style.textAlign = 'left';
                linha.style.padding = '12px 8px';
                linha.style.borderBottom = '1px solid rgba(139, 69, 19, 0.2)';
                
                // Estilizar o rótulo
                const rotulo = linha.querySelector('span:first-child');
                if (rotulo) {
                    rotulo.style.marginBottom = '8px';
                    rotulo.style.fontWeight = '600';
                    rotulo.style.textAlign = 'left';
                }
                
                // Estilizar o valor
                const valor = linha.querySelector('span:last-child');
                if (valor) {
                    valor.style.textAlign = 'left';
                    valor.style.fontSize = '1.1rem';
                    valor.style.paddingLeft = '25px';
                    valor.style.color = 'var(--primary-light)';
                }
            });
        }
    }
    
    // Chamar a função quando a página carregar
    aplicarEstilosMobile();
    
    // Adicionar listener para quando a tela for redimensionada
    window.addEventListener('resize', aplicarEstilosMobile);
    
    // Gerenciamento de abas
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const tabId = button.getAttribute('data-tab');
            
            // Verificar se a aba de resultados está sendo acessada e bloquear se necessário
            if (tabId === "resultados" && button.classList.contains('disabled')) {
                e.preventDefault();
                mostrarNotificacao('Execute o cálculo antes de visualizar os resultados', true);
                return;
            }
            
            // Remover classe ativa de todos os botões e conteúdos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adicionar classe ativa ao botão e conteúdo clicado
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Botão para calcular comissões
    const calcularBtn = document.getElementById('calcular');
    calcularBtn.addEventListener('click', calcularComissoes);
    
    // Desabilitar botões e abas inicialmente
    const btnResultados = document.querySelector('[data-tab="resultados"]');
    const btnExportarPDF = document.getElementById('exportarPDF');
    
    // Inicializar a aba de resultados como desabilitada
    desabilitarAbaResultados();
    // Verificar campos apenas para o botão de cálculo inicialmente
    verificarCamposPreenchidos();
    
    function desabilitarAbaResultados() {
        btnResultados.classList.add('disabled');
        btnExportarPDF.classList.add('disabled');
        btnExportarPDF.disabled = true;
    }
    
    function habilitarAbaResultados() {
        btnResultados.classList.remove('disabled');
        btnExportarPDF.classList.remove('disabled');
        btnExportarPDF.disabled = false;
    }
    
    function desabilitarElementos() {
        calcularBtn.classList.add('disabled');
        calcularBtn.disabled = true;
    }
    
    function habilitarElementos() {
        calcularBtn.classList.remove('disabled');
        calcularBtn.disabled = false;
    }
    
    function verificarCamposPreenchidos() {
        // Verificar campos de serviços
        const qtdCabelo = document.getElementById('cabelo-qtd').value.trim();
        const qtdBarba = document.getElementById('barba-qtd').value.trim();
        const qtdCombo = document.getElementById('combo-qtd').value.trim();
        
        // Verificar campos dos profissionais
        const p1Cabelo = document.getElementById('p1-cabelo-qtd').value.trim();
        const p1Barba = document.getElementById('p1-barba-qtd').value.trim();
        const p1Combo = document.getElementById('p1-combo-qtd').value.trim();
        
        const p2Cabelo = document.getElementById('p2-cabelo-qtd').value.trim();
        const p2Barba = document.getElementById('p2-barba-qtd').value.trim();
        const p2Combo = document.getElementById('p2-combo-qtd').value.trim();
        
        const p3Cabelo = document.getElementById('p3-cabelo-qtd').value.trim();
        const p3Barba = document.getElementById('p3-barba-qtd').value.trim();
        const p3Combo = document.getElementById('p3-combo-qtd').value.trim();
        
        // Verificar campos de valor e porcentagem
        const valorTotal = document.getElementById('valor-total').value.trim();
        const porcentagem = document.getElementById('porcentagem').value.trim();
        
        // Verificar se todos os campos estão preenchidos
        const todosCamposPreenchidos = 
            qtdCabelo !== '' && qtdBarba !== '' && qtdCombo !== '' &&
            p1Cabelo !== '' && p1Barba !== '' && p1Combo !== '' &&
            p2Cabelo !== '' && p2Barba !== '' && p2Combo !== '' &&
            p3Cabelo !== '' && p3Barba !== '' && p3Combo !== '' &&
            valorTotal !== '' && porcentagem !== '';
        
        // Atualizar apenas o estado do botão de cálculo
        if (todosCamposPreenchidos) {
            habilitarElementos();
        } else {
            desabilitarElementos();
        }
        
        return todosCamposPreenchidos;
    }
    
    function calcularComissoes() {
        // Verificar se todos os campos estão preenchidos
        if (!verificarCamposPreenchidos()) {
            mostrarNotificacao('Preencha todos os campos antes de calcular', true);
            return;
        }
        
        // Valores fixos para as fichas
        const valorCabelo = 30; // Valor fixo para cabelo: 30 fichas
        const valorBarba = 30;  // Valor fixo para barba: 30 fichas
        const valorCombo = 60;  // Valor fixo para combo: 60 fichas
        
        // Obter os valores totais informados na seção "Serviços e Valores"
        const totalServicosInformado = parseInt(document.getElementById('total-servicos').textContent) || 0;
        const totalFichasInformado = parseInt(document.getElementById('servicos-total-fichas').textContent) || 0;
        
        // Calcular totais dos barbeiros
        let totalServicosBarbeiros = 0;
        let totalFichasBarbeiros = 0;
        
        // Verificar cada barbeiro
        for (let profId = 1; profId <= 3; profId++) {
            const qtdCabelo = parseInt(document.getElementById(`p${profId}-cabelo-qtd`).value) || 0;
            const qtdBarba = parseInt(document.getElementById(`p${profId}-barba-qtd`).value) || 0;
            const qtdCombo = parseInt(document.getElementById(`p${profId}-combo-qtd`).value) || 0;
            
            totalServicosBarbeiros += (qtdCabelo + qtdBarba + qtdCombo);
            totalFichasBarbeiros += (qtdCabelo * valorCabelo) + (qtdBarba * valorBarba) + (qtdCombo * valorCombo);
        }
        
        // Verificar se os totais são iguais
        if (totalServicosBarbeiros !== totalServicosInformado) {
            mostrarNotificacao(`O total de serviços dos barbeiros (${totalServicosBarbeiros}) é diferente do informado (${totalServicosInformado})`, true);
            return;
        }
        
        if (totalFichasBarbeiros !== totalFichasInformado) {
            mostrarNotificacao(`O total de fichas dos barbeiros (${totalFichasBarbeiros}) é diferente do informado (${totalFichasInformado})`, true);
            return;
        }
        
        // Valor total faturado e porcentagem para comissões
        const valorTotalFaturado = parseFloat(document.getElementById('valor-total').value) || 0;
        const porcentagemComissoes = parseFloat(document.getElementById('porcentagem').value) || 0;
        
        // Calcular o valor total das comissões
        const valorTotalComissoes = valorTotalFaturado * (porcentagemComissoes / 100);
        
        // Objeto para armazenar os resultados de cada profissional
        const resultadosProfissionais = [];
        
        // Calcular o total de fichas de cada profissional
        let totalFichasGeral = 0;
        
        // Nomes dos profissionais
        const nomesProfissionais = ["Pedro Licor", "Thiago Diniz", "Elias Santos"];
        
        // Processar cada profissional
        for (let profId = 1; profId <= 3; profId++) {
            // Obter quantidade de serviços realizados pelo profissional
            const qtdCabelo = parseInt(document.getElementById(`p${profId}-cabelo-qtd`).value) || 0;
            const qtdBarba = parseInt(document.getElementById(`p${profId}-barba-qtd`).value) || 0;
            const qtdCombo = parseInt(document.getElementById(`p${profId}-combo-qtd`).value) || 0;
            
            // Calcular o total de fichas do profissional
            const totalFichasProfissional = (qtdCabelo * valorCabelo) + (qtdBarba * valorBarba) + (qtdCombo * valorCombo);
            
            // Adicionar ao total geral de fichas
            totalFichasGeral += totalFichasProfissional;
            
            // Armazenar os resultados do profissional
            resultadosProfissionais.push({
                id: profId,
                nome: nomesProfissionais[profId-1],
                qtdCabelo,
                qtdBarba,
                qtdCombo,
                totalFichas: totalFichasProfissional,
                comissao: 0 // Será calculado depois que tivermos o total geral
            });
        }
        
        // Calcular a comissão de cada profissional
        resultadosProfissionais.forEach(profissional => {
            if (totalFichasGeral > 0) {
                // Comissãoprofissional = (TFprofissional ÷ TFtotal) × Valorcomissões
                profissional.comissao = (profissional.totalFichas / totalFichasGeral) * valorTotalComissoes;
            }
        });
        
        // Agora que calculamos, habilitar a aba de resultados
        habilitarAbaResultados();
        
        // Atualizar a interface com os resultados
        atualizarResultados(resultadosProfissionais, totalFichasGeral, valorTotalComissoes);
        
        // Mudar para a aba de resultados
        document.querySelector('[data-tab="resultados"]').click();
        
        // Rolar para o topo da página
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    function atualizarResultados(resultadosProfissionais, totalFichasGeral, valorTotalComissoes) {
        // Obter valores adicionais
        const valorTotalFaturado = parseFloat(document.getElementById('valor-total').value) || 0;
        const porcentagemComissoes = parseFloat(document.getElementById('porcentagem').value) || 0;
        
        // Calcular o total de serviços
        let totalServicosGeral = 0;
        resultadosProfissionais.forEach(prof => {
            totalServicosGeral += (prof.qtdCabelo + prof.qtdBarba + prof.qtdCombo);
        });
        
        // Atualizar total de fichas e valor das comissões
        document.getElementById('total-fichas').textContent = Math.round(totalFichasGeral);
        document.getElementById('valor-comissoes').textContent = `R$ ${formatarNumeroEmReais(valorTotalComissoes)}`;
        document.getElementById('percentual-utilizado').textContent = `${porcentagemComissoes}%`;
        
        // Atualizar detalhes adicionais
        document.getElementById('result-valor-faturado').textContent = `R$ ${formatarNumeroEmReais(valorTotalFaturado)}`;
        
        // Calcular valor das comissões em reais e sua porcentagem
        const valorComissoesReais = (valorTotalFaturado * porcentagemComissoes) / 100;
        document.getElementById('result-porcentagem').textContent = `R$ ${formatarNumeroEmReais(valorComissoesReais)} (${porcentagemComissoes}%)`;
        
        // Calcular lucro da barbearia e sua porcentagem
        const lucroBarbearia = valorTotalFaturado - valorComissoesReais;
        const percentualLucro = 100 - porcentagemComissoes;
        document.getElementById('result-lucro').textContent = `R$ ${formatarNumeroEmReais(lucroBarbearia)} (${percentualLucro}%)`;
        
        document.getElementById('result-total-servicos').textContent = totalServicosGeral;
        
        // Atualizar data do cálculo
        const dataAtual = new Date();
        const dataFormatada = dataAtual.toLocaleDateString() + ' ' + dataAtual.toLocaleTimeString();
        document.getElementById('result-data-calculo').textContent = dataFormatada;
        
        // Limpar resultados anteriores
        const professionalsResults = document.getElementById('professionals-results');
        professionalsResults.innerHTML = '';
        
        // Exibir resultados para cada profissional
        resultadosProfissionais.forEach(profissional => {
            const profissionalElement = document.createElement('div');
            profissionalElement.className = 'professional-result';
            
            // Calcular percentual de contribuição do profissional
            const percentualContribuicao = totalFichasGeral > 0 ? 
                ((profissional.totalFichas / totalFichasGeral) * 100).toFixed(1) : 0;
            
            profissionalElement.innerHTML = `
                <h4><i class="fas fa-user-circle"></i> ${profissional.nome}</h4>
                <div class="result-details">
                    <div class="detail-row">
                        <span><i class="fas fa-cut"></i> Cabelo:</span>
                        <span>${profissional.qtdCabelo}x</span>
                    </div>
                    <div class="detail-row">
                        <span><i class="fas fa-cut"></i> Barba:</span>
                        <span>${profissional.qtdBarba}x</span>
                    </div>
                    <div class="detail-row">
                        <span><i class="fas fa-cut"></i> Combo:</span>
                        <span>${profissional.qtdCombo}x</span>
                    </div>
                    <div class="detail-row">
                        <span><i class="fas fa-calculator"></i> Total de Serviços:</span>
                        <span>${profissional.qtdCabelo + profissional.qtdBarba + profissional.qtdCombo} </span>
                    </div>
                    <div class="detail-row">
                        <span><i class="fas fa-ticket-alt"></i> Total de Fichas:</span>
                        <span>${Math.round(profissional.totalFichas)}</span>
                    </div>
                    <div class="detail-row">
                        <span><i class="fas fa-chart-pie"></i> Contribuição:</span>
                        <span>${percentualContribuicao}%</span>
                    </div>
                </div>
                <div class="commission"><i class="fas fa-money-bill-wave"></i> R$ ${formatarNumeroEmReais(profissional.comissao)}</div>
            `;
            
            professionalsResults.appendChild(profissionalElement);
        });
        
        // Aplicar estilos mobile após adicionar os resultados ao DOM
        setTimeout(aplicarEstilosMobile, 0);
        
        // Após atualizar a interface, configurar o botão de exportar
        setTimeout(configurarBotaoExportarResultados, 100);
    }
    
    // Função para mostrar notificações temporárias
    function mostrarNotificacao(mensagem, isError = false) {
        // Criar o elemento de notificação
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao ${isError ? 'erro' : 'sucesso'}`;
        notificacao.textContent = mensagem;
        
        // Adicionar à página
        document.body.appendChild(notificacao);
        
        // Mostrar com animação
        setTimeout(() => {
            notificacao.classList.add('visivel');
        }, 10);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notificacao.classList.remove('visivel');
            
            setTimeout(() => {
                notificacao.remove();
            }, 300);
        }, 3000);
    }
    
    // Associar evento ao botão na aba de resultados
    function configurarBotaoExportarResultados() {
        const botaoExportarResultados = document.getElementById('exportarPDF');
        if (botaoExportarResultados) {
            botaoExportarResultados.addEventListener('click', exportarPDF);
            console.log('Botão de exportar na aba de resultados configurado');
        } else {
            console.warn('Botão de exportar na aba de resultados não encontrado');
        }
    }
    
    // Função para exportar resultados para PDF
    function exportarPDF() {
        // Verificar se há resultados para exportar (e não pelos campos preenchidos)
        const resultadosContainer = document.getElementById('professionals-results');
        if (!resultadosContainer.children.length) {
            // Se não houver resultados, mostrar mensagem
            mostrarNotificacao('É necessário calcular as comissões antes de exportar', true);
            return;
        }
        
        try {
            // Acessar a biblioteca jsPDF
            const { jsPDF } = window.jspdf;
            // Criar o documento em formato retrato
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            // Função para formatar valores no PDF (substituir ponto por vírgula e adicionar separador de milhar)
            function formatarValorPDF(valorStr) {
                // Remover R$ e espaços
                let valor = valorStr.replace('R$ ', '').trim();
                
                // Se o valor já tem uma formatação percentual, preservar
                if (valor.includes('(')) {
                    // Extrair apenas a parte do valor antes do parênteses
                    const valorParte = valor.split('(')[0].trim();
                    const percentualParte = valor.split('(')[1];
                    
                    // Formatar a parte do valor
                    const valorFormatado = formatarValorPDF(valorParte);
                    return `${valorFormatado} (${percentualParte}`;
                }
                
                // Verificar se é um número válido
                // Primeiro converter para formato numérico do JavaScript (com ponto como separador decimal)
                const valorNumerico = valor.replace(/\./g, '').replace(',', '.');
                const valorNum = parseFloat(valorNumerico);
                
                if (isNaN(valorNum)) return valor;
                
                // Formatar usando a função personalizada
                return formatarNumeroEmReais(valorNum);
            }
            
            // Obter dados para o relatório
            const totalFichas = document.getElementById('total-fichas').textContent;
            const valorComissoes = document.getElementById('valor-comissoes').textContent;
            const valorFaturado = document.getElementById('result-valor-faturado').textContent;
            const percentualUtilizado = document.getElementById('percentual-utilizado').textContent;
            const totalServicos = document.getElementById('result-total-servicos').textContent;
            const dataCalculo = document.getElementById('result-data-calculo').textContent;
            const valorTotalComissoes = document.getElementById('result-porcentagem').textContent;
            const lucroBarbearia = document.getElementById('result-lucro').textContent;
            
            // Cores personalizadas para o PDF
            const corPrimaria = [139, 69, 19]; // Marrom (#8B4513) em RGB
            
            // Configurações iniciais do documento
            doc.setFontSize(20);
            doc.setTextColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]); // Cor personalizada
            doc.text('Relatório de Comissões - JOHN 3.16', 105, 15, { align: 'center' });
            
            // Informações gerais
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Data: ${dataCalculo}`, 14, 30);
            
            // Adicionar subtítulo "Resumo Geral"
            doc.setFontSize(16);
            doc.setTextColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
            doc.text('Resumo Geral', 105, 35, { align: 'center' });
            
            // Formatar totalFichas para remover casas decimais se existirem
            const totalFichasFormatado = totalFichas.includes('.') ? totalFichas.substring(0, totalFichas.indexOf('.')) : totalFichas;
            
            // Tabela de resumo
            const resumoData = [
                ['Valor Total Faturado', valorFaturado],
                ['Valor Total das Comissões', valorTotalComissoes],
                ['Lucro da Barbearia', lucroBarbearia],
                ['Total de Serviços', totalServicos],
                ['Total de Fichas', totalFichasFormatado]
            ];
            
            doc.autoTable({
                head: [['Descrição', 'Valor']],
                body: resumoData,
                startY: 45,
                theme: 'grid',
                headStyles: { fillColor: corPrimaria, textColor: [255, 255, 255] },
                styles: { fontSize: 10, cellPadding: 5 }
            });
            
            // Obter os dados dos profissionais
            const profissionaisResults = document.querySelectorAll('.professional-result');
            const dadosProfissionais = [];
            
            // Nomes dos profissionais
            const nomesBarbeiros = ["Pedro Licor", "Thiago Diniz", "Elias Santos"];
            
            // Extrair os dados com uma abordagem simplificada para evitar problemas no PDF
            profissionaisResults.forEach((profElement, index) => {
                // Usar o índice para obter o nome correto da lista
                const nome = nomesBarbeiros[index];
                const detalhes = profElement.querySelectorAll('.detail-row span:last-child');
                
                // Obter valores de serviços
                const cabelo = detalhes[0].textContent.replace('x', '').trim();
                const barba = detalhes[1].textContent.replace('x', '').trim();
                const combo = detalhes[2].textContent.replace('x', '').trim();
                const totalServicos = detalhes[3].textContent.trim();
                const totalFichas = detalhes[4].textContent.trim();
                const contribuicao = detalhes[5].textContent.trim();
                
                // Obter comissão diretamente do DOM
                const comissaoElement = profElement.querySelector('.commission');
                let comissaoTexto = comissaoElement.textContent.trim();
                
                // Extrair apenas o valor numérico, preservando a formatação original
                let valorComissaoTexto = comissaoTexto.replace('R$ ', '').trim();
                
                // Converter para número (substituindo vírgula por ponto para o JavaScript)
                // Primeiro remover os pontos de separador de milhar, depois trocar vírgula por ponto
                const valorComissaoNumerico = valorComissaoTexto.replace(/\./g, '').replace(',', '.');
                const valorComissao = parseFloat(valorComissaoNumerico);
                
                // Adicionar ao array de dados
                dadosProfissionais.push({
                    nome,
                    cabelo,
                    barba,
                    combo,
                    totalServicos,
                    totalFichas,
                    contribuicao,
                    valorComissao
                });
            });
            
            // Para cada profissional, criar uma página individual com tabela no formato da tabela geral
            dadosProfissionais.forEach((prof, index) => {
                // Adicionar uma nova página para cada barbeiro
                doc.addPage();
                
                // Configurações iniciais da página
                // Título principal
                doc.setFontSize(20);
                doc.setTextColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
                doc.text('Relatório de Comissões - JOHN 3.16', 105, 15, { align: 'center' });
                
                // Informações gerais
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text(`Data: ${dataCalculo}`, 14, 30);
                
                // Título da seção do barbeiro
                doc.setFontSize(14);
                doc.setTextColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
                doc.text(`${prof.nome}`, 105, 40, { align: 'center' });
                
                // Garantir que o valor da comissão esteja formatado corretamente
                let comissaoFormatada = formatarNumeroEmReais(prof.valorComissao);
                const comissaoComSimbolo = `R$ ${comissaoFormatada}`;
                
                // Criar tabela no mesmo formato da tabela geral
                const dadosBarbeiro = [
                    ['Descrição', 'Valor'],
                    ['Cabelo', `${prof.cabelo}x`],
                    ['Barba', `${prof.barba}x`],
                    ['Combo', `${prof.combo}x`],
                    ['Total de Serviços', prof.totalServicos],
                    ['Total de Fichas', prof.totalFichas],
                    ['Contribuição', prof.contribuicao],
                    ['Comissão', comissaoComSimbolo]
                ];
                
                // Criar a tabela com o mesmo estilo da tabela de resumo
                doc.autoTable({
                    startY: 50,
                    body: dadosBarbeiro.slice(1), // Remover o cabeçalho do corpo da tabela
                    head: [dadosBarbeiro[0]], // Usar a primeira linha como cabeçalho
                    theme: 'grid',
                    headStyles: { fillColor: corPrimaria, textColor: [255, 255, 255] },
                    styles: { fontSize: 10, cellPadding: 5 }
                });
            });
            
            // Rodapé
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text('Comissões por assinatura - JOHN 3.16', 105, 285, { align: 'center' });
                doc.text(`Página ${i} de ${pageCount}`, 195, 285, { align: 'right' });
            }
            
            // Salvar o PDF
            doc.save(`comissoes_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
            
            mostrarNotificacao('Relatório PDF exportado!');
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            mostrarNotificacao('Erro ao gerar PDF. Verifique o console para detalhes.', true);
        }
    }
    
    // Função para calcular e atualizar os totais em tempo real
    function atualizarTotaisServicos() {
        // Valores fixos para as fichas
        const valorCabelo = 30;
        const valorBarba = 30;
        const valorCombo = 60;
        
        // Obter quantidades
        const qtdCabelo = parseInt(document.getElementById('cabelo-qtd').value) || 0;
        const qtdBarba = parseInt(document.getElementById('barba-qtd').value) || 0;
        const qtdCombo = parseInt(document.getElementById('combo-qtd').value) || 0;
        
        // Calcular totais
        const totalServicos = qtdCabelo + qtdBarba + qtdCombo;
        const totalFichas = (qtdCabelo * valorCabelo) + (qtdBarba * valorBarba) + (qtdCombo * valorCombo);
        
        // Atualizar elementos na interface
        const infoServicos = document.getElementById('total-servicos');
        const infoFichas = document.getElementById('servicos-total-fichas');
        
        infoServicos.textContent = totalServicos;
        infoFichas.textContent = totalFichas;
        
        // Resetar cores
        infoServicos.style.color = '';
        infoFichas.style.color = '';
        infoServicos.title = '';
        infoFichas.title = '';
    }
    
    // Função para calcular e atualizar o valor total da comissão em tempo real
    function atualizarValorTotalComissao() {
        const valorTotalFaturado = parseFloat(document.getElementById('valor-total').value) || 0;
        const porcentagemComissoes = parseFloat(document.getElementById('porcentagem').value) || 0;
        
        // Calcular o valor total das comissões
        const valorTotalComissoes = valorTotalFaturado * (porcentagemComissoes / 100);
        
        // Atualizar o elemento na interface
        document.getElementById('valor-total-comissao').textContent = `R$ ${formatarNumeroEmReais(valorTotalComissoes)}`;
    }

    // Adicionar event listeners para inputs de quantidade
    document.querySelectorAll('.servico-qtd').forEach(input => {
        input.addEventListener('input', function() {
            atualizarTotaisServicos();
            verificarCamposPreenchidos();
            verificarTotaisBarbeiros();
        });
    });
    
    // Adicionar event listeners para todos os campos de entrada dos profissionais
    const camposProfissionais = [
        'p1-cabelo-qtd', 'p1-barba-qtd', 'p1-combo-qtd',
        'p2-cabelo-qtd', 'p2-barba-qtd', 'p2-combo-qtd',
        'p3-cabelo-qtd', 'p3-barba-qtd', 'p3-combo-qtd'
    ];
    
    camposProfissionais.forEach(id => {
        document.getElementById(id).addEventListener('input', function() {
            verificarCamposPreenchidos();
            verificarTotaisBarbeiros();
        });
    });
    
    // Adicionar event listeners para inputs de valor total e porcentagem
    document.getElementById('valor-total').addEventListener('input', function() {
        atualizarValorTotalComissao();
        verificarCamposPreenchidos();
    });
    
    document.getElementById('porcentagem').addEventListener('input', function() {
        atualizarValorTotalComissao();
        verificarCamposPreenchidos();
    });
    
    // Inicializar totais
    atualizarTotaisServicos();
    atualizarValorTotalComissao();
    verificarTotaisBarbeiros();
    
    // Executar a configuração inicial do botão de exportar na aba de resultados
    setTimeout(configurarBotaoExportarResultados, 500);

    // Função para verificar se os totais dos barbeiros correspondem aos totais informados
    function verificarTotaisBarbeiros() {
        // Valores fixos para as fichas
        const valorCabelo = 30;
        const valorBarba = 30;
        const valorCombo = 60;
        
        // Obter os valores totais informados na seção "Serviços e Valores"
        const totalServicosInformado = parseInt(document.getElementById('total-servicos').textContent) || 0;
        const totalFichasInformado = parseInt(document.getElementById('servicos-total-fichas').textContent) || 0;
        
        // Calcular totais dos barbeiros
        let totalServicosBarbeiros = 0;
        let totalFichasBarbeiros = 0;
        
        // Verificar cada barbeiro
        for (let profId = 1; profId <= 3; profId++) {
            const qtdCabelo = parseInt(document.getElementById(`p${profId}-cabelo-qtd`).value) || 0;
            const qtdBarba = parseInt(document.getElementById(`p${profId}-barba-qtd`).value) || 0;
            const qtdCombo = parseInt(document.getElementById(`p${profId}-combo-qtd`).value) || 0;
            
            totalServicosBarbeiros += (qtdCabelo + qtdBarba + qtdCombo);
            totalFichasBarbeiros += (qtdCabelo * valorCabelo) + (qtdBarba * valorBarba) + (qtdCombo * valorCombo);
        }
        
        // Se os campos dos barbeiros estiverem preenchidos, verificar a diferença
        if (totalServicosBarbeiros > 0) {
            const servicosIguais = totalServicosBarbeiros === totalServicosInformado;
            const fichasIguais = totalFichasBarbeiros === totalFichasInformado;
            
            // Atualizar informações no painel de serviços
            const infoServicos = document.getElementById('total-servicos');
            const infoFichas = document.getElementById('servicos-total-fichas');
            
            if (!servicosIguais) {
                infoServicos.style.color = 'red';
                infoServicos.title = `Os barbeiros têm ${totalServicosBarbeiros} serviços. Verifique a distribuição.`;
            } else {
                infoServicos.style.color = '';
                infoServicos.title = '';
            }
            
            if (!fichasIguais) {
                infoFichas.style.color = 'red';
                infoFichas.title = `Os barbeiros têm ${totalFichasBarbeiros} fichas. Verifique a distribuição.`;
            } else {
                infoFichas.style.color = '';
                infoFichas.title = '';
            }
        }
    }
}); 
