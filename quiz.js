//
// Estado do jogo
//
var score = 0;
//Total de Perguntas
var numberOfQuestions = 3

//
// Tela de titulo
//
var Intro = new Phaser.Scene('Intro');

Intro.preload = function()
{
    this.load.image('nextButton', 'assets/button_green.png');
    this.load.audio('click', 'assets/click.ogg');
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
        cursor: 'pointer',
        fontFamily: 'sans-serif',
        fontSize: '24px',
        color: '#000'
    });
    playLabel.setOrigin(0.5, 0.5);

    // torna botao JOGAR interativo
    playButton.setInteractive({useHandCursor: true}).on('pointerdown', () => {
        this.sound.play('click');
        this.scene.start('Question1');
        
    });
}

Intro.update = function(time, delta)
{
    //console.log(time);
    this.logo.setRotation(time / 100);
    if(time <= 2000)
        this.logo.setScale(time / 1000);

}

/////////////////////////////////////////////
// QUESTION 1 - Tela de perguntas e respostas
/////////////////////////////////////////////
var Question1 = new Phaser.Scene('Question1');
Question1.savedOption = 0;
Question1.savedAnswer;

Question1.preload = function()
{
    this.load.image('nextButton', 'assets/button_green.png');
    this.load.image('prevButton', 'assets/button_orange.png');
    this.load.image('option', 'assets/option.png');
    this.load.image('selectedOption', 'assets/option_green.png');
    this.load.audio('right', 'assets/right.ogg');
    this.load.audio('wrong', 'assets/wrong.ogg');
}

Question1.create = function()
{
    // variaveis
    var selectionOption = 0; // opcao selecionada: 0 (nenhuma), 1, 2 ou 3
    var rightOption = 2; // resposta corretaa
    var textConfig = { fontFamily: 'sans-serif', fontSize: '24px', color: '#000', wordWrap: { width: 600 } };

    // cria pergunta
    var question = this.add.text(150, 150, 'Quanto é 5 + 5?', textConfig);

    // cria feedBeck
    var feedBeck = this.add.text(400, 100, '', textConfig);

    // cria botoes das respostas
    var button1 = this.add.sprite(150, 250, 'option');
    var button2 = this.add.sprite(150, 300, 'option');
    var button3 = this.add.sprite(150, 350, 'option');
    var buttonX = this.add.sprite(150, 999, 'selectedOption');
    button1.setOrigin(0.2);
    button2.setOrigin(0.2);
    button3.setOrigin(0.2);
    buttonX.setOrigin(0.2);

    // faz botoes de resposta ficarem interativos
    button1.setInteractive({useHandCursor: true}).on('pointerdown', () => {
        selectionOption = 1;
        buttonX.y = button1.y;
    });
    button2.setInteractive({useHandCursor: true}).on('pointerdown', () => {
        selectionOption = 2;
        buttonX.y = button2.y;
    });
    button3.setInteractive({useHandCursor: true}).on('pointerdown', () => {
        selectionOption = 3;
        buttonX.y = button3.y;
    });

    // cria respostas
    var answer1 = this.add.text(200, 250, 'O valor é 6', textConfig);
    var answer2 = this.add.text(200, 300, 'O valor é 10', textConfig);
    var answer3 = this.add.text(200, 350, 'O valor é 20', textConfig);

    // botao AVANCAR
    var nextButton = this.add.sprite(600, 500, 'nextButton');
    var nextLabel = this.add.text(600, 500, 'Avançar', textConfig);
    nextLabel.setOrigin(0.5, 0.5);

    // botao VOLTAR
    var prevButton = this.add.sprite(150, 500, 'prevButton');
    var prevLabel = this.add.text(150, 500, 'Voltar', textConfig);
    prevLabel.setOrigin(0.5, 0.5);

    // fazer verificacao no botao AVANCAR
    nextButton.setInteractive({useHandCursor: true}).on('pointerdown', () => {
        
        if(selectionOption != 0) {
            // opcao correta?
            if(selectionOption == rightOption) {
                feedBeck.setText('Acertou!');
                this.savedOption = +1;
                this.sound.play('right');
                console.log('Pergunta 1 - Acertou somar ' + Question1.savedOption);
            }
            else {
                feedBeck.setText('Errou');
                this.sound.play('wrong');
                console.log('Pergunta 1 - Errou somar ' + Question1.savedOption);
            }

            // trava controles
            this.sys.input.disable(nextButton);
            this.sys.input.disable(prevButton);
            this.sys.input.disable(button1);
            this.sys.input.disable(button2);
            this.sys.input.disable(button3);

            // registra a pergunta
            this.savedAnswer = selectionOption;

            // vai p/ proxima tela
            setTimeout(() => {
                this.scene.start('Question2');
            }, 900);
        }
    });

    // verifica se a pergunta já nao foi respondida
    if(!this.savedAnswer){
        console.log('Pergunta ainda não respondido');
    }
    else{
        console.log('Pergunta já respondida');
        this.sys.input.disable(button1);
        this.sys.input.disable(button2);
        this.sys.input.disable(button3);
        nextButton.setInteractive({useHandCursor: true}).on('pointerdown', () => {
            this.scene.start('Question2');
        });
        if(Question1.savedAnswer == 1)
            buttonX.y = button1.y;
        if(Question1.savedAnswer == 2)
            buttonX.y = button2.y;
        if(Question1.savedAnswer == 3)
            buttonX.y = button3.y;
    }
    
    // faz interacao do botao VOLTAR
    prevButton.setInteractive({useHandCursor: true}).on('pointerdown', () => {
        this.scene.start('Intro');
    });
}

Question1.update = function(time, delta)
{

}

//
// QUESTION 2 - Tela de perguntas e respostas
//
var Question2 = new Phaser.Scene('Question2');
Question2.savedOption = 0;
Question2.savedAnswer;

Question2.preload = function()
{
    this.load.image('nextButton', 'assets/button_green.png');
    this.load.image('prevButton', 'assets/button_orange.png');
    this.load.image('option', 'assets/option.png');
    this.load.image('selectedOption', 'assets/option_green.png');
    this.load.audio('right', 'assets/right.ogg');
    this.load.audio('wrong', 'assets/wrong.ogg');
}

Question2.create = function()
{
    // variaveis
    var selectionOption = 0; // opcao selecionada: 0 (nenhuma), 1, 2 ou 3
    var rightOption = 3; // resposta corretaa
    var textConfig = { fontFamily: 'sans-serif', fontSize: '24px', color: '#000', wordWrap: { width: 600 } };

    // cria pergunta
    var question = this.add.text(150, 150, 'Quanto é 10 + 10?', textConfig);

    // cria feedBeck
    var feedBeck = this.add.text(400, 100, '', textConfig);

    // cria botoes das respostas
    var button1 = this.add.sprite(150, 250, 'option');
    var button2 = this.add.sprite(150, 300, 'option');
    var button3 = this.add.sprite(150, 350, 'option');
    var buttonX = this.add.sprite(150, 999, 'selectedOption');
    button1.setOrigin(0.2);
    button2.setOrigin(0.2);
    button3.setOrigin(0.2);
    buttonX.setOrigin(0.2);

    // faz botoes de resposta ficarem interativos
    button1.setInteractive({useHandCursor: true}).on('pointerdown', () => {
        selectionOption = 1;
        buttonX.y = button1.y;
    });
    button2.setInteractive({useHandCursor: true}).on('pointerdown', () => {
        selectionOption = 2;
        buttonX.y = button2.y;
    });
    button3.setInteractive({useHandCursor: true}).on('pointerdown', () => {
        selectionOption = 3;
        buttonX.y = button3.y;
    });

    // cria respostas
    var answer1 = this.add.text(200, 250, 'O valor é 6', textConfig);
    var answer2 = this.add.text(200, 300, 'O valor é 10', textConfig);
    var answer3 = this.add.text(200, 350, 'O valor é 20', textConfig);

    // botao AVANCAR
    var nextButton = this.add.sprite(600, 500, 'nextButton');
    var nextLabel = this.add.text(600, 500, 'Avançar', textConfig);
    nextLabel.setOrigin(0.5, 0.5);

    // botao VOLTAR
    var prevButton = this.add.sprite(150, 500, 'prevButton');
    var prevLabel = this.add.text(150, 500, 'Voltar', textConfig);
    prevLabel.setOrigin(0.5, 0.5);

    // fazer verificacao no botao AVANCAR
    nextButton.setInteractive({useHandCursor: true}).on('pointerdown', () => {
        
        if(selectionOption != 0) {
            // opcao correta?
            if(selectionOption == rightOption) {
                feedBeck.setText('Acertou!');
                this.savedOption = +1;
                this.sound.play('right');
                console.log('Pergunta 2 - Acertou somar ' + Question2.savedOption);
            }
            else {
                feedBeck.setText('Errou');
                this.sound.play('wrong');
                console.log('Pergunta 2 - Errou somar ' + Question2.savedOption);
            }

            // trava controles
            this.sys.input.disable(nextButton);
            this.sys.input.disable(prevButton);
            this.sys.input.disable(button1);
            this.sys.input.disable(button2);
            this.sys.input.disable(button3);

            // registra a pergunta
            this.savedAnswer = selectionOption;

            // vai p/ proxima tela
            setTimeout(() => {
                this.scene.start('Question3');
            }, 900);
        }
    });

    // verifica se a pergunta já nao foi respondida
    if(!this.savedAnswer){
        console.log('Pergunta ainda não respondido');
    }
    else{
        console.log('Pergunta já respondida');
        this.sys.input.disable(button1);
        this.sys.input.disable(button2);
        this.sys.input.disable(button3);
        nextButton.setInteractive({useHandCursor: true}).on('pointerdown', () => {
            this.scene.start('Question3');
        });
        if(Question2.savedAnswer == 1)
            buttonX.y = button1.y;
        if(Question2.savedAnswer == 2)
            buttonX.y = button2.y;
        if(Question2.savedAnswer == 3)
            buttonX.y = button3.y;
    }
    
    // faz interacao do botao VOLTAR
    prevButton.setInteractive({useHandCursor: true}).on('pointerdown', () => {
        this.scene.start('Question1');
    });
}

Question2.update = function(time, delta)
{

}

//
// QUESTION 3 - Tela de perguntas e respostas
//
var Question3 = new Phaser.Scene('Question3');
Question3.savedOption = 0;
Question3.savedAnswer;

Question3.preload = function()
{
    this.load.image('nextButton', 'assets/button_green.png');
    this.load.image('prevButton', 'assets/button_orange.png');
    this.load.image('option', 'assets/option.png');
    this.load.image('selectedOption', 'assets/option_green.png');
    this.load.audio('right', 'assets/right.ogg');
    this.load.audio('wrong', 'assets/wrong.ogg');
}

Question3.create = function()
{
    // variaveis
    var selectionOption = 0; // opcao selecionada: 0 (nenhuma), 1, 2 ou 3
    var rightOption = 1; // resposta corretaa
    var textConfig = { fontFamily: 'sans-serif', fontSize: '24px', color: '#000', wordWrap: { width: 600 } };

    // cria pergunta
    var question = this.add.text(150, 150, 'Quanto é 3 + 3?', textConfig);

    // cria feedBeck
    var feedBeck = this.add.text(400, 100, '', textConfig);

    // cria botoes das respostas
    var button1 = this.add.sprite(150, 250, 'option');
    var button2 = this.add.sprite(150, 300, 'option');
    var button3 = this.add.sprite(150, 350, 'option');
    var buttonX = this.add.sprite(150, 999, 'selectedOption');
    button1.setOrigin(0.2);
    button2.setOrigin(0.2);
    button3.setOrigin(0.2);
    buttonX.setOrigin(0.2);

    // faz botoes de resposta ficarem interativos
    button1.setInteractive({useHandCursor: true}).on('pointerdown', () => {
        selectionOption = 1;
        buttonX.y = button1.y;
    });
    button2.setInteractive({useHandCursor: true}).on('pointerdown', () => {
        selectionOption = 2;
        buttonX.y = button2.y;
    });
    button3.setInteractive({useHandCursor: true}).on('pointerdown', () => {
        selectionOption = 3;
        buttonX.y = button3.y;
    });

    // cria respostas
    var answer1 = this.add.text(200, 250, 'O valor é 6', textConfig);
    var answer2 = this.add.text(200, 300, 'O valor é 10', textConfig);
    var answer3 = this.add.text(200, 350, 'O valor é 20', textConfig);

    // botao AVANCAR
    var nextButton = this.add.sprite(600, 500, 'nextButton');
    var nextLabel = this.add.text(600, 500, 'Avançar', textConfig);
    nextLabel.setOrigin(0.5, 0.5);

    // botao VOLTAR
    var prevButton = this.add.sprite(150, 500, 'prevButton');
    var prevLabel = this.add.text(150, 500, 'Voltar', textConfig);
    prevLabel.setOrigin(0.5, 0.5);

    // fazer verificacao no botao AVANCAR
    nextButton.setInteractive({useHandCursor: true}).on('pointerdown', () => {
        
        if(selectionOption != 0) {
            // opcao correta?
            if(selectionOption == rightOption) {
                feedBeck.setText('Acertou!');
                this.savedOption = +1;
                this.sound.play('right');
                console.log('Pergunta 3 - Acertou somar ' + Question3.savedOption);
            }
            else {
                feedBeck.setText('Errou');
                this.sound.play('wrong');
                console.log('Pergunta 3 - Errou somar ' + Question3.savedOption);
            }

            // trava controles
            this.sys.input.disable(nextButton);
            this.sys.input.disable(prevButton);
            this.sys.input.disable(button1);
            this.sys.input.disable(button2);
            this.sys.input.disable(button3);

            // registra a pergunta
            this.savedAnswer = selectionOption;

            // vai p/ proxima tela
            setTimeout(() => {
                this.scene.start('Final');
            }, 900);
        }
    });

    // verifica se a pergunta já nao foi respondida
    if(!this.savedAnswer){
        console.log('Pergunta ainda não respondido');
    }
    else{
        console.log('Pergunta já respondida');
        this.sys.input.disable(button1);
        this.sys.input.disable(button2);
        this.sys.input.disable(button3);
        nextButton.setInteractive({useHandCursor: true}).on('pointerdown', () => {
            this.scene.start('Final');
        });
        if(Question3.savedAnswer == 1)
            buttonX.y = button1.y;
        if(Question3.savedAnswer == 2)
            buttonX.y = button2.y;
        if(Question3.savedAnswer == 3)
            buttonX.y = button3.y;
    }
    
    // faz interacao do botao VOLTAR
    prevButton.setInteractive({useHandCursor: true}).on('pointerdown', () => {
        this.scene.start('Question2');
    });
}

Question3.update = function(time, delta)
{

}

//
// Tela de pontuacao
//
var Final = new Phaser.Scene('Final');

Final.preload = function()
{
    this.load.image('nextButton', 'assets/button_green.png');
}

Final.create = function()
{
     // Soma os pontos
     totalHits = Question1.savedOption + Question2.savedOption + Question3.savedOption
     score = totalHits * 100 / numberOfQuestions

    // cria titulo
    var title = this.add.text(400, 100, 'Fim do jogo', {
        fontFamily: 'sans-serif',
        fontSize: '30px',
        color: '#ff9900'
    });
    title.setOrigin(0.5);

    // texto de pontuacao
    var scoreText = this.add.text(400, 300, 'Acertou: ' + Math.floor(score) + '%', {
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
        this.scene.start('Intro');
    });

   
}

Final.update = function(time, delta)
{

}

//
// Cria novo jogo
//
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#f1f1f1',
    scene: [ Intro, Question1, Question2, Question3, Final ]
};
var game = new Phaser.Game(config);