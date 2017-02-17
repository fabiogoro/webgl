
# Terceiro EP: Guia do usuário


Neste exercício criamos um editor de curvas b-spline.
A ideia é entender melhor o funcionamento da geração de curvas no computador.

Existem 3 canvas, um deles gera uma possui uma curva fechada, outro possui uma curva aberta.
O último canvas possuirá o resultado da junção da forma fechada na curva aberta criando uma superfície
que combina o perfil das 2.

Os arquivos estão separados da seguinte forma:
* **index.html**: O arquivo html da aplicação. Abra ele para executar o sistema.
  Os 2 shaders se encontram no arquivo html.
* **assets**: Esta pasta possui todos os arquivos .js da aplicação. Neles estão
  os códigos do WebGL.
  * **bsplines.js**: Esse arquivo calcula os vértices das curvas bspline.
  * **webgl.js**: Esse arquivo define os objetos WebGL do primeiro canvas. 
  * **surface.js**: Esse arquivo define os objetos WebGL do segundo canvas. 
  * **form.js**: Esse arquivo define os objetos WebGL do terceiro canvas.
  * **application.js**: Aqui são definidas as funções dos botões e controles
  da página index.html. Para entender o funcionamento deles, este é o arquivo.
  * **initshaders.js, MV.js, webgl-utils.js**: São arquivos auxiliares com funções
  para iniciar o WebGL e para executar operações com matrizes como Translação e Rotação.

## Como utilizar

Para executar o sistema basta abrir o arquivo index.html em um navegador.  

Ao iniciar o sistema algumas formas já aparecerão na tela.
Os pontos aparecem como pequenos quadrados ligados por linhas.
Para mover pontos, clicamos e arrastamos eles até a nova posição,
a curva se atualizará automaticamente.
Podemos adicionar novos pontos de controle, para tal clicamos em uma posição da tela
onde não há algum ponto já existente. Assim um novo ponto será criado e conectado ao último
vértice adicionado na lista de pontos.
As funçoes dos botões são:
* **Limpar**: Esse botão limpa todos os pontos de controle da tela, criando uma tela em branco para
  gerar uma nova forma.
* **Reiniciar**: Esse botão reinicia todos os pontos de controle, colocando-os na posição que
  são iniciados ao ativar o sistema.
* **Grau**: O '+' aumenta o grau da função que gera a curva. O '-' diminui o grau.
* **Pontos**: O '+' aumenta o número de pontos que formam a curva, o '-' diminui.

## Dependências

É necessário o uso de internet para execução do sistema pois ele acessa 2 bibliotecas online:
* **Bootstrap**: Utilizado para definir estilo da página.
* **JQuery**: Utilizado para facilitar a manipulação do javascript.
