// input.js

let input = {
    down: {},
    pressed: {},
    init() {
        // Event listener para teclas pressionadas (keydown)
        window.addEventListener("keydown", (e) => {
            // Marca a tecla como pressionada
            this.down[e.code] = true;
            
            // --- CRÍTICO: Previne o comportamento padrão do navegador para teclas de controle ---
            // Isso evita que as setas, WASD, e espaço rolem a página
            if (e.code === "ArrowUp" || e.code === "ArrowDown" || 
                e.code === "ArrowLeft" || e.code === "ArrowRight" || 
                e.code === "Space" || 
                e.code === "KeyW" || e.code === "KeyA" || e.code === "KeyS" || e.code === "KeyD") {
                e.preventDefault(); 
            }
            // --------------------------------------------------------------------------------
        });

        // Event listener para teclas liberadas (keyup)
        window.addEventListener("keyup", (e) => {
            // Remove a marcação de pressionado
            delete this.down[e.code];
            // Remove a marcação de "já processado" para `isPressed`
            delete this.pressed[e.code];
        });
    },
    
    // Verifica se a tecla está sendo mantida pressionada
    isDown(key) {
        return this.down[key];
    },
    
    // Verifica se a tecla foi RECÉM-Pressionada (e não mantida)
    isPressed(key) {
        if (this.down[key] && !this.pressed[key]) {
            this.pressed[key] = true; // Marca como processado para este pressionamento
            return true;
        }
        return false;
    },
    
    // Método para atualizar o estado do Mario com base nos inputs
    update(gameObj) {
        let mario = gameObj.entities.mario; // Pega a instância do Mario

        if (gameObj.userControl == true) { // Se o controle do usuário estiver ativo
            
            // --- MOVIMENTO HORIZONTAL (ESQUERDA) ---
            // Verifica se ArrowLeft OU KeyA está pressionada
            if (this.isDown("ArrowLeft") || this.isDown("KeyA")) {
                mario.posX -= mario.velX; // Move Mario para a esquerda
                mario.currentDirection = "left";
                mario.currentState = mario.states.walkingAnim; // Define animação de andar
            }
            // --- MOVIMENTO HORIZONTAL (DIREITA) ---
            // Verifica se ArrowRight OU KeyD está pressionada
            else if (this.isDown("ArrowRight") || this.isDown("KeyD")) {
                mario.posX += mario.velX; // Move Mario para a direita
                mario.currentDirection = "right";
                mario.currentState = mario.states.walkingAnim; // Define animação de andar
            }
            // --- MARIO PARADO ---
            else {
                // Se Mario não estiver pulando/caindo, volte para a animação idle/parado
                // Esta condição é importante para não interromper a animação de pulo
                if (mario.velY === 0 && mario.currentState !== mario.states.jumpingAnim) {
                    mario.currentState = mario.states.idleAnim || mario.states.standingAnim; // Use idle ou standing
                }
            }

            // --- PULO (Space, ArrowUp ou KeyW) ---
            // Verifica se Space OU ArrowUp OU KeyW foi recém-pressionada
            if (this.isPressed("Space") || this.isPressed("ArrowUp") || this.isPressed("KeyW")) {
                // Condição de pulo: A MAIS ROBUSTA É VERIFICAR SE MARIO ESTÁ NO CHÃO (onGround)
                // Se você ainda usa mario.velY == 1.1, é uma condição frágil.
                // Recomendo fortemente adicionar `mario.onGround` no seu `mario.js` e `physics.js`.
                if (mario.onGround || mario.velY == 1.1) { // Mantenho sua condição para não estragar se `onGround` não existe
                    mario.velY = -14; // A força do pulo (negativo para ir para cima)
                    mario.currentState = mario.states.jumpingAnim; // Define animação de pulo
                    // Se você tiver `mario.onGround`, defina-o como `false` aqui:
                    // mario.onGround = false; 
                }
            }
        }
    }
};

input.init(); // Inicializa o sistema de input