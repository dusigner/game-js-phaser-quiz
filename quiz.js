///////////////////////////////////
// Estado do jogo
////////////////////////////////////
var score = 100; // rever...
var initialGameState = {
  currentQuestion: 0,
  recordedAnswer: {}
};
var gameState = initialGameState;

function resetGameState()
{
  localStorage.clear();
  gameState = initialGameState;
}

function saveGameState()
{
  localStorage.setItem("gameState", JSON.stringify(gameState));
}

function loadGameState()
{
  var str = localStorage.getItem("gameState");
  if(str != null)
  gameState = JSON.parse(str);
}

////////////////////////////////////
// Tela de perguntas e respostas
////////////////////////////////////
var Question = new Phaser.Scene('Question');

Question.preload = function()
{
  this.load.image('nextButton', 'assets/button_green.png');
  this.load.image('prevButton', 'assets/button_orange.png');
  this.load.image('option', 'assets/option.png');
  this.load.image('selectedOption', 'assets/option_green.png');
  this.load.json('questions', 'data/questions.json');
}

// obtem questao de numero questionID (0, 1, 2, ...)
Question.getQuestion = function(questionID)
{
  var questions = this.cache.json.get('questions');
  return questions[questionID]; // pode ser undefined

}
// verifica se existe questao de numero questionID
Question.questionExists = function(questionID)
{
  if(this.getQuestion(questionID) != undefined)
  return true;
  else
  return false;
}

Question.create = function()
{
  // carrega estado do jogo
  loadGameState();
  // variaveis
  //var questions = this.cache.json.get('questions');
  //var question = questions[gameState.currentQuestion];
  var question = this.getQuestion(gameState.currentQuestion);

  var selectedAnswer = gameState.recordedAnswer[gameState.currentQuestion]; // opcao selecionada: undefined (nenhuma), 'a', 'b' ou 'c'
  var textConfig = { fontFamily: 'sans-serif', fontSize: '24px', color: '#000', wordWrap: { width: 600 } };

  // cria o enunciado da pergunta
  var questionText = this.add.text(150, 150, question.text, textConfig);



  // cria botoes das respostas
  var button1 = this.add.sprite(150, 250, 'option');
  var button2 = this.add.sprite(150, 300, 'option');
  var button3 = this.add.sprite(150, 350, 'option');
  var buttonX = this.add.sprite(150, 999, 'selectedOption');
  button1.setOrigin(0.2);
  button2.setOrigin(0.2);
  button3.setOrigin(0.2);
  buttonX.setOrigin(0.2);

  // faz botoes de resposta responderem a cliques
  button1.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
    selectedAnswer = 'a';
    buttonX.y = button1.y;
  });
  button2.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
    selectedAnswer = 'b';
    buttonX.y = button2.y;
  });
  button3.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
    selectedAnswer = 'c';
    buttonX.y = button3.y;
  });

  // se a pergunta ja tiver sido respondida...
  if(selectedAnswer != undefined) {
    // mostra resposta anterior
    if(selectedAnswer == 'a')
    button1.emit('pointerdown'); //buttonX.y = button1.y;
    else if(selectedAnswer == 'b')
    button2.emit('pointerdown');
    else if(selectedAnswer == 'c')
    button3.emit('pointerdown');

    // trava botoes
    this.sys.input.disable(button1);
    this.sys.input.disable(button2);
    this.sys.input.disable(button3);
  }

  // cria respostas
  var answer1 = this.add.text(200, 250, question.a, textConfig);
  var answer2 = this.add.text(200, 300, question.b, textConfig);
  var answer3 = this.add.text(200, 350, question.c, textConfig);

  // botao AVANCAR
  var nextButton = this.add.sprite(600, 500, 'nextButton');
  var nextLabel = this.add.text(600, 500, 'Avançar', textConfig);
  nextLabel.setOrigin(0.5, 0.5);

  // botao VOLTAR
  var prevButton = this.add.sprite(250, 500, 'prevButton');
  var prevLabel = this.add.text(250, 500, 'Voltar', textConfig);
  prevLabel.setOrigin(0.5, 0.5);

  // logica do botao AVANCAR
  nextButton.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
    // usuario selecionou alguma alternativa
    if(selectedAnswer != undefined) {
      // usuario marcou alternativa correta?
      if(selectedAnswer == question.answer) {
        questionText.setText('Acertou!');
      }
      else {
        questionText.setText('Errou');
      }

      // trava botoes
      this.sys.input.disable(button1);
      this.sys.input.disable(button2);
      this.sys.input.disable(button3);
      this.sys.input.disable(nextButton);
      this.sys.input.disable(prevButton);

      // ir para a proxima tela
      setTimeout(() => {
        var nextQuestion = gameState.currentQuestion + 1;

        if(this.questionExists(nextQuestion)) {
          gameState.recordedAnswer[gameState.currentQuestion] = selectedAnswer;
          gameState.currentQuestion = nextQuestion;
          saveGameState();
          this.scene.restart();
        }

        else {
          // resetGameState();
          this.scene.start('Final');
        }
        console.log("resposta Selecionada: " + selectedAnswer);
      }, 300);
    }
  });

  // faz interacao do botao VOLTAR
  prevButton.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
    // ir para a pergunta anterior
    var prevQuestion = gameState.currentQuestion - 1;
    if(this.questionExists(prevQuestion)) {

      gameState.currentQuestion = prevQuestion;
      saveGameState();
      this.scene.restart();
    }
    else {
      this.scene.start('Intro');
    }

  });
}

Question.update = function(time, delta)
{
}

//
// DESAFIOS
//
// Implementacao funcao de VOLTAR
// -> cuidado p/ nao salvar a resposta (trava)
//
// Se uma pergunta ja tiver sido respondida, trocar o buttonX
// de resposta: de verde para vermelho (indicando somente-leitura)
//
// Mostrar pontuacao final (# de questoes corretas)
//
// Mostrar % de acertos
// -> calcular no. perguntas
//
// Mostrar premio se % de acertos >= 80%
//

///////////////////////////////////////
// Tela de titulo
///////////////////////////////////////
var Intro = new Phaser.Scene('Intro');

Intro.preload = function()
{
  this.load.image('nextButton', 'assets/button_green.png');
}

Intro.create = function()
{
  // cria titulo
  var title = this.add.text(400, 100, 'Jogo de Quiz', {
    fontFamily: 'sans-serif',
    fontSize: '36px',
    color: '#000'
  });
  title.setOrigin(0.5, 0.5);

  // cria logo
  var logo = this.add.text(400, 300, '?', {
    fontFamily: 'sans-serif',
    fontSize: '128px',
    color: '#f00'
  });
  logo.setOrigin(0.5, 0.5);
  this.logo = logo;

  // cria botao JOGAR
  var playButton = this.add.sprite(400, 500, 'nextButton');
  //playButton.setOrigin(0.5);
  var playLabel = this.add.text(400, 500, 'Jogar', {
    fontFamily: 'sans-serif',
    fontSize: '24px',
    color: '#000'
  });
  playLabel.setOrigin(0.5, 0.5);

  // torna botao JOGAR interativo
  playButton.setInteractive({useHandCursor: true}).on('pointerdown', () => {
    this.scene.start('Question');
  });
}

Intro.update = function(time, delta)
{
  //console.log(time);
  this.logo.setRotation(time / 100);
  if(time <= 2000)
  this.logo.setScale(time / 1000);
}

/////////////////////////////////////////
// Tela de pontuacao
/////////////////////////////////////////
var Final = new Phaser.Scene('Final');

Final.preload = function()
{
  this.load.image('nextButton', 'assets/button_green.png');
}

Final.create = function()
{
  console.log("tela final");
  // respostas certas
  console.log(gameState);
  console.log("resposta da pergunta 1: " + gameState.recordedAnswer[0]);
  console.log("resposta da pergunta 2: " + gameState.recordedAnswer[1]);
  console.log("resposta da pergunta 3: " + gameState.recordedAnswer[2]);

  // cria titulo
  var title = this.add.text(400, 100, 'Fim do jogo', {
    fontFamily: 'sans-serif',
    fontSize: '30px',
    color: '#ff9900'
  });
  title.setOrigin(0.5);

  // texto de pontuacao
  var scoreText = this.add.text(400, 300, 'Pontos: ' + score, {
    fontFamily: 'sans-serif',
    fontSize: '80px',
    color: '#000'
  });
  scoreText.setOrigin(0.5);

  // botao REINICIAR
  var restartButton = this.add.sprite(400, 500, 'nextButton');
  var restartLabel = this.add.text(400, 500, 'Reiniciar', {
    fontFamily: 'sans-serif',
    fontSize: '24px',
    color: '#000'
  });
  restartLabel.setOrigin(0.5, 0.5);

  // faz botao REINICIAR ficar interativo
  restartButton.setInteractive({useHandCursor: true}).on('pointerdown', () => {
    resetGameState();
    this.scene.start('Intro');
  });
}

Final.update = function()
{

}


//
// Cria novo jogo
//
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#f4f4f4',
  scene: [ Intro, Question, Final ]
};
var game = new Phaser.Game(config);
