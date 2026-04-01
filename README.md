# Conversor Deluc -> Reserva de Minas

## Como usar
1. Abra o arquivo `index.html` no navegador.
2. Clique em **Selecionar CSV**.
3. Importe o arquivo no padrão `Pesquisa Deluc`.
4. Confira a prévia.
5. Baixe em `CSV final` ou `Excel (.xls)`.

## O que o sistema faz
- ignora a primeira linha técnica do CSV;
- lê a segunda linha como cabeçalho;
- converte para o layout do relatório final;
- remove da exportação qualquer coluna que esteja totalmente vazia.

## Mapeamento atual
- DATA <- DATA E HORA INÍCIO EXECUÇÃO
- PDV <- PDV
- PROMOTOR <- PROMOTOR
- ITENS <- SKU
- RUPTURA TOTAL? <- RUPTURA TOTAL?
- PRODUTO EM RUPTURA? <- PRODUTO EM RUPTURA?
- PRECO <- PRECO
- QTD. UNIDADE NO ESTOQUE <- ESTOQUE TOTAL DA LOJA (UNIDADE)
- TEM SKU VENCENDO EM 60 DIAS? <- TEM SKU VENCENDO EM 60 DIAS?
- DATA DO DIA <- data extraída de DATA E HORA INÍCIO EXECUÇÃO
- INFORME A VALIDADE <- INFORME A VALIDADE
- DIAS PARA O VENCIMENTO <- DIAS PARA O VENCIMENTO
- QUAL A QUANTIDADE EM UNIDADES? <- QUAL A QUANTIDADE EM UNIDADES?
- INFORME O LOTE <- INFORME O LOTE
- TEM UM SEGUNDO LOTE EM VENCIMENTO? <- TEM UM SEGUNDO LOTE EM VENCIMENTO?
- TEM PONTO EXTRA? <- TEM PONTO EXTRA?
- QUANTAS CAIXAS FORAM ABASTECIDAS? <- QUANTAS CAIXAS FORAM ABASTECIDAS?
