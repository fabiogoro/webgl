
# Segundo EP: Guia do usuário


Neste exercício criamos um pequeno mundo com criaturas.
A ideia é entender melhor o funcionamento das transformações,
projeções, texturas e quatérnios.

Existem 2 espécies, um pássaro e um mosquito. O pássaro voa de acordo com a batida da asa,
bate asa e sobe, depois perde força segundo a gravidade. O mosquito bate asa mais rapidamente
e é mais leve, portanto não cai nem desce, apenas mantém a altitude. Ambas as espécies giram
constantemente em um movimento circular. É possível alterar o número de mosquitos, 
e quando se aumenta o número, eles começam a se chocar. Quando eles se chocam
a direção em que andam é alterada.

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
* **images**: Esta pasta contém as imagens das texturas utilizadas na animação.

## Como utilizar

Para executar o sistema basta abrir o arquivo index.html em um navegador.  

O sistema foi feito para ser fácil de utilizar. Há poucos botões. As funçoes dos
botões, na ordem em que aparecem na tela, são:
* **Ativar/Parar**: Esse botão ativa e para a animação. A animação começa ativada,
  então o primeiro clique no botão ira parar a animação. Com a animação parada
  podemos apertar o mesmo botão e ela irá ser ativada, do mesmo ponto em que estava.
* **Reiniciar**: Esse botão recomeça a animação, colocando os objetos na posição inicial, sem velocidade.
  Ele também reseta o número de criaturas.
* **Mosquitos**: O '+' cria um novo mosquito. Se não houver espaço para o mosquito ele não é criado.
  O '-' remove um mosquito.
* **Ortogonal**: Altera a câmera para visão ortogonal.
* **Perspectiva**: Altera a câmera para visão perspectiva.
* **Horário/Anti-horário**: Altera a direção do passáro.

## Dependências

É necessário o uso de internet para execução do sistema pois ele acessa 2 bibliotecas online:
* **Bootstrap**: Utilizado para definir estilo da página.
* **JQuery**: Utilizado para facilitar a manipulação do javascript.
