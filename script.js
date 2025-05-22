// Variáveis globais
const selectedCar = null
const carDepth = 0 // Profundidade do carro na pista (0 = posição inicial)
const depthStep = 10 // Quanto o carro avança/recua a cada aceleração/desaceleração
const minDepth = -50 // Profundidade mínima (mais próxima/maior)
const maxDepth = 150 // Profundidade máxima (mais distante/menor)

// Classe para manipulação do DOM
class DOMManipulator {
  constructor() {
    // Elementos do DOM
    this.yellowCar = document.getElementById("yellow")
    this.redCar = document.getElementById("red")
    this.resultText = document.getElementById("result")
    this.btnReset = document.getElementById("resetar")
    this.btnAccelerate = document.getElementById("acelerar")
    this.btnDecelerate = document.getElementById("desacelerar")
    this.audioElement = document.querySelector("audio")
    this.track = document.querySelector(".track")
    this.yellowOption = document.getElementById("yellow-option")
    this.redOption = document.getElementById("red-option")
  }

  // Método para atualizar o texto do resultado
  updateResultText(text) {
    this.resultText.textContent = text
  }

  // Método para mudar a cor de fundo
  changeBackgroundColor(color) {
    document.body.style.backgroundColor = color
  }

  // Método para mostrar os controles
  showControls() {
    this.btnReset.style.display = "block"
    this.btnAccelerate.style.display = "block"
    this.btnDecelerate.style.display = "block"
  }

  // Método para esconder os controles
  hideControls() {
    this.btnReset.style.display = "none"
    this.btnAccelerate.style.display = "none"
    this.btnDecelerate.style.display = "none"
  }

  // Método para destacar o carro selecionado na interface
  highlightSelectedCar(isYellow) {
    if (isYellow) {
      this.yellowOption.classList.add("selected")
      this.redOption.classList.remove("selected")
      this.yellowCar.style.zIndex = "3"
      this.redCar.style.zIndex = "2"
    } else {
      this.redOption.classList.add("selected")
      this.yellowOption.classList.remove("selected")
      this.redCar.style.zIndex = "3"
      this.yellowCar.style.zIndex = "2"
    }
  }

  // Método para atualizar o tamanho e posição do carro
  updateCarPosition(car, width, height, top, leftOrRight, value) {
    car.style.width = `${width}px`
    car.style.height = `${height}px`
    car.style.top = `${top}px`

    if (leftOrRight === "left") {
      car.style.left = `${value}px`
    } else {
      car.style.right = `${value}px`
    }
  }

  // Método para resetar a posição dos carros
  resetCarPositions() {
    this.updateCarPosition(this.yellowCar, 40, 40, 80, "left", 180)
    this.updateCarPosition(this.redCar, 40, 40, 80, "right", 180)
  }

  // Método para tocar o áudio
  playAudio() {
    this.audioElement.play()
  }

  // Método para pausar o áudio
  pauseAudio() {
    this.audioElement.pause()
    this.audioElement.currentTime = 0
  }
}

// Classe para a lógica do jogo
class CarGame {
  constructor() {
    this.dom = new DOMManipulator()
    this.selectedCar = null
    this.carDepth = 0

    // Configurar event listeners
    this.setupEventListeners()
  }

  // Configurar todos os event listeners
  setupEventListeners() {
    // Event Listeners para cliques nos carros
    this.dom.yellowCar.addEventListener("click", () => this.selectYellowCar())
    this.dom.redCar.addEventListener("click", () => this.selectRedCar())

    // Event Listeners para os botões de controle
    this.dom.btnReset.addEventListener("click", () => this.resetGame())
    this.dom.btnAccelerate.addEventListener("click", () => this.accelerate())
    this.dom.btnDecelerate.addEventListener("click", () => this.decelerate())

    // Event Listener para controle pelo teclado
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        this.accelerate()
      } else if (event.key === "ArrowDown") {
        this.decelerate()
      }
    })

    // Event Listeners para os elementos de seleção com GIFs
    this.dom.yellowOption.addEventListener("click", () => this.selectYellowCar())
    this.dom.redOption.addEventListener("click", () => this.selectRedCar())
  }

  // Método para selecionar o carro amarelo
  selectYellowCar() {
    this.selectedCar = this.dom.yellowCar
    this.dom.updateResultText("Amarelo")
    this.dom.changeBackgroundColor("#332200") // Fundo amarelo escuro
    this.dom.showControls()
    this.dom.highlightSelectedCar(true)

    // Reseta a profundidade do carro
    this.carDepth = 0
    this.updateCarDepth()

    // Inicia a reprodução do áudio
    this.dom.playAudio()
  }

  // Método para selecionar o carro vermelho
  selectRedCar() {
    this.selectedCar = this.dom.redCar
    this.dom.updateResultText("Vermelho")
    this.dom.changeBackgroundColor("#330000") // Fundo vermelho escuro
    this.dom.showControls()
    this.dom.highlightSelectedCar(false)

    // Reseta a profundidade do carro
    this.carDepth = 0
    this.updateCarDepth()

    // Inicia a reprodução do áudio
    this.dom.playAudio()
  }

  // Método para acelerar
  accelerate() {
    if (!this.selectedCar) return

    if (this.carDepth < maxDepth) {
      this.carDepth += depthStep
      this.updateCarDepth()
    }
  }

  // Método para desacelerar
  decelerate() {
    if (!this.selectedCar) return

    if (this.carDepth > minDepth) {
      this.carDepth -= depthStep
      this.updateCarDepth()
    }
  }

  // Método para atualizar a profundidade e o tamanho do carro
  updateCarDepth() {
    if (!this.selectedCar) return

    // Calcula o fator de escala baseado na profundidade
    const scaleFactor = 1 - this.carDepth / 300
    const limitedScale = Math.max(0.5, Math.min(1.5, scaleFactor))

    // Calcula o novo tamanho
    const newWidth = 40 * limitedScale
    const newHeight = 40 * limitedScale

    // Calcula a nova posição vertical
    const baseTop = 80
    const topAdjustment = this.carDepth / 3
    const topPosition = baseTop - topAdjustment

    // Ajuste horizontal para simular perspectiva da pista
    if (this.selectedCar === this.dom.yellowCar) {
      const baseLeft = 180
      const leftAdjustment = (this.carDepth / maxDepth) * (baseLeft - 120)
      const leftPosition = baseLeft - leftAdjustment

      this.dom.updateCarPosition(this.selectedCar, newWidth, newHeight, topPosition, "left", leftPosition)
    } else {
      const baseRight = 180
      const rightAdjustment = (this.carDepth / maxDepth) * (baseRight - 120)
      const rightPosition = baseRight - rightAdjustment

      this.dom.updateCarPosition(this.selectedCar, newWidth, newHeight, topPosition, "right", rightPosition)
    }
  }

  // Método para resetar o jogo
  resetGame() {
    // Reseta as posições dos carros
    this.dom.resetCarPositions()

    // Reseta as variáveis
    this.selectedCar = null
    this.carDepth = 0

    // Reseta a interface
    this.dom.updateResultText("?")
    this.dom.changeBackgroundColor("black")
    this.dom.hideControls()

    // Remove a seleção dos carros
    this.dom.yellowOption.classList.remove("selected")
    this.dom.redOption.classList.remove("selected")

    // Pausa o áudio
    this.dom.pauseAudio()
  }
}

// Inicialização do jogo
document.addEventListener("DOMContentLoaded", () => {
  const game = new CarGame()
  game.resetGame() // Configura o estado inicial
})
