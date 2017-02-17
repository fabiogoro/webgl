# Primeiro EP: Guia do usuário


Neste exercício aproximamos uma esfera a partir de um octaedro.
A idéia é entender melhor o funcionamento do pipeline do WebGL,
utilizando shaders para definir iluminação cores e posições de objetos.

Aqui os objetos são as esferas e o chão. As esferas estão em uma definida altura,
e quando a animação começa elas caem até entrar em contato com o chão.
Nesse momento elas quicam de volta, subindo com uma força reduzida, até que percam
completamente a força para subirem novamente.

A cada vez que as esferas quicam, elas se aproximam um pouco mais de uma esfera,
aumentando o número de divisões que o octaedro possuia. Aqui foi colocado um limite
superior de divisões para que a aplicação não trave por excesso de processamento.
No momento em que elas atingem o número máximo de divisões, elas voltam a ser
um octaedro simples.

Os arquivos estão separados da seguinte forma:
* **index.html**: O arquivo html da aplicação. Abra ele para executar o sistema.
  Os 2 shaders se encontram no arquivo html.
* **assets**: Esta pasta possui todos os arquivos .js da aplicação. Neles estão
  os códigos do WebGL.
  * **webgl.js**: Esse arquivo define os objetos WebGL. As esferas, o chão,
  a iluminação, o movimento. O arquivo principal do WebGL.
  * **application.js**: Aqui são definidas as funções dos botões e controles
  da página index.html. Para entender o funcionamento deles, este é o arquivo.
  * **initshaders.js, MV.js, webgl-utils.js**: São arquivos auxiliares com funções
  para iniciar o WebGL e para executar operações com matrizes como Translação e Rotação.

## Como utilizar

Para executar o sistema basta abrir o arquivo index.html em um navegador.  

O sistema foi feito para ser fácil de utilizar. Há poucos botões. As funçoes dos
botões, na ordem em que aparecem na tela, são:
* **Ativar/Parar**: Esse botão ativa e para a animação. A animação começa ativada,
  então o primeiro clique no botão ira parar a animação. Com a animação parada
  podemos apertar o mesmo botão e ela irá ser ativada, do mesmo ponto em que estava.
* **Reiniciar**: Esse botão recomeça a animação, colocando os objetos na posição inicial, sem velocidade.
  Ele também reseta o número de divisões do octaedro.
* **Wire/Shade**: Esse botão permite alternar entre o modo tonalizado e o modo wireframe.
  As esferas estão inicialmente tonalizadas, então no primeiro clique o modo será alterado para wireframe.
  No segundo ele voltará a ser tonalizado.
* **Gravity**: O '+' aumenta a força da gravidade, o '-' reduz. A gravidade pode ficar negativa.
  Nesse caso o objeto irá flutuar para cima e nunca cairá a não ser que a gravidade seja
  invertida novamente.
* **Light**: Pressione o botão e apareceram opções para alterar a posição da luz.
  Sua posição é definida por três variáveis, uma em cada eixo, x, y e z.

## Dependências

É necessário o uso de internet para execução do sistema pois ele acessa 2 bibliotecas online:
* **Bootstrap**: Utilizado para definir estilo da página.
* **JQuery**: Utilizado para facilitar a manipulação do javascript.
